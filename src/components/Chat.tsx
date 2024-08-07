import { Tooltip } from "antd";
import { useParams } from "react-router";
import { useContext, useEffect, useState, useCallback } from "react";
import { API } from "../utils/API";
import { ChatMessage } from "../types/globalTypes";
import { useSelector } from "react-redux";
import { GeneralStore, UserStore } from "../store/store";
import moment from "moment";
import { ChatHeader } from "./ChatHeader";
import { Message } from "webstomp-client";
import { ChatRightSection } from "./ChatRightSection";
import { WebSocketContext } from "../contexts/WebSocketProvider";
import { SendMessageSection } from "./SendMessageSection";
import usePagination from "../hooks/usePagination";

export const Chat = () => {
    const [messages, setMessages] = useState<Map<string, ChatMessage>>(new Map());
    const params = useParams();
    const numberRoomId = Number(params.roomId);
    const { user } = useSelector((state: UserStore) => state.userStore);
    const { chatRigthSideOpen } = useSelector((state: GeneralStore) => state.generalStore);
    const { connected, subscribeToRoom, unsubscribeFromRoom } = useContext(WebSocketContext);

    const { pagination, setPagination, lastElementRef, loading } = usePagination();

    const getMessagesQuery = async (pageNumber: number) => {
        await API.get(`/api/messages/${numberRoomId}`, {
            params: { page: pageNumber },
        }).then((res) => {
            console.log(res.data.content);
            setMessages(
                (prev) =>
                    new Map([...prev, ...res.data.content.map((msg: ChatMessage) => [msg.id, msg])])
            );
            setPagination((prev) => ({ ...prev, last: res.data.last }));
        })
    }

    useEffect(() => {
        if (pagination.page === 0) {
            return;
        }
        setTimeout(() => {
            getMessagesQuery(pagination.page);
        }, 500);
    }, [pagination.page]);

    useEffect(() => {
        // Fetch initial messages from API
        setMessages(new Map());
        setPagination((prev) => ({ ...prev, page: 0 }));
        getMessagesQuery(0)
    }, [numberRoomId]);

    // Message handler from subscribed room
    const getMessageHandler = useCallback((message: Message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages(
            (prevMessages) => new Map([[chatMessage.id, chatMessage], ...prevMessages])
        );
    }, []);

    useEffect(() => {
        if (connected) {
            // Subscribe to the room
            subscribeToRoom(numberRoomId, getMessageHandler);
        }

        // Cleanup function to unsubscribe when the component unmounts or roomId changes
        return () => {
            unsubscribeFromRoom(numberRoomId);
        };
    }, [connected, numberRoomId]);

    return (
        <>
            <div className="flex flex-col flex-grow">
                <ChatHeader />
                <div className="overflow-auto p-4 h-full max-h-[calc(100vh-64px-88px-96px)] flex flex-col-reverse">
                    {Array.from(messages.values()).map((message, i) => (
                        <Tooltip key={message.id} placement={message.user?.id === user?.id ? "left" : "right"} title={moment(message.createdAt).fromNow()}>
                            {
                                i + 1 == messages.size ?
                                    <div ref={lastElementRef} className={`w-fit my-2 ${message.user?.id === user?.id ? "mr-0 ml-auto" : ""} text-sm`}>
                                        {message.mediaUrl && <img src={message.mediaUrl} alt="" className="max-w-72 max-h-72 rounded-xl object-cover mb-1" />}
                                        <div className={`border ${message.user?.id === user?.id ? "border-neutral-300 text-slate-800" : "bg-violet-600 text-neutral-50"} w-full p-2 rounded-xl`}>
                                            <p>{message.text}</p>
                                        </div>
                                    </div> :
                                    <div className={`w-fit my-2 ${message.user?.id === user?.id ? "mr-0 ml-auto" : ""} text-sm`}>
                                        {message.mediaUrl && <img src={message.mediaUrl} alt="" className="max-w-72 max-h-72 rounded-xl object-cover mb-1" />}
                                        <div className={`border ${message.user?.id === user?.id ? "border-neutral-300 text-slate-800" : "bg-violet-600 text-neutral-50"} w-full p-2 rounded-xl`}>
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                            }

                        </Tooltip>
                    ))}
                </div>
                <div className="p-4 gap-5 h-24 flex items-center">
                    <SendMessageSection />
                </div>
            </div>
            {
                chatRigthSideOpen &&
                <div className="min-w-[250px] max-w-[380px] basis-1/3">
                    <ChatRightSection />
                </div>
            }
        </>
    );
};
