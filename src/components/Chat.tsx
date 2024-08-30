import { useParams } from "react-router";
import { useContext, useEffect, useState, useCallback } from "react";
import { API } from "../utils/API";
import { ChatMessage } from "../types/globalTypes";
import { useSelector } from "react-redux";
import { GeneralStore, } from "../store/store";
import { ChatHeader } from "./ChatHeader";
import { Message } from "webstomp-client";
import { ChatRightSection } from "./ChatRightSection";
import { WebSocketContext } from "../contexts/WebSocketProvider";
import { SendMessageSection } from "./SendMessageSection";
import usePagination from "../hooks/usePagination";
import MessageComp from "./MessageComp";

export const Chat = () => {
    const [messages, setMessages] = useState<Map<string, ChatMessage>>(new Map());
    const params = useParams();
    const numberRoomId = Number(params.roomId);
    const { chatRigthSideOpen } = useSelector((state: GeneralStore) => state.generalStore);
    const { connected, subscribeToRoom, unsubscribeFromRoom } = useContext(WebSocketContext);

    const { pagination, setPagination, lastElementRef } = usePagination();

    const getMessagesQuery = async (pageNumber: number) => {
        await API.get(`/api/messages/${numberRoomId}`, {
            params: { page: pageNumber },
        }).then((res) => {
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

        return () => {
            unsubscribeFromRoom(numberRoomId);
        };
    }, [connected, numberRoomId]);

    return (
        <>
            {

                <div className="flex flex-col flex-grow">
                    <ChatHeader />
                    <div className="overflow-auto p-4 h-[calc(100vh-64px-88px-96px)] flex flex-col-reverse">
                        {Array.from(messages.values()).map((message, i) => (
                            <MessageComp
                                message={message}
                                lastMessageRef={lastElementRef}
                                index={i}
                                messagesSize={messages.size} />
                        ))}
                    </div>
                    <div className="p-4 gap-5 h-24 flex items-center">
                        <SendMessageSection />
                    </div>
                </div>

            }
            {
                chatRigthSideOpen &&
                <div className="min-w-[250px] max-w-[380px] basis-1/3">
                    <ChatRightSection />
                </div>
            }
        </>
    );
};
