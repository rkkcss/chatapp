import { Button, Input, Tooltip } from "antd";
import { LuSendHorizonal } from "react-icons/lu";
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

export const Chat = () => {
    const [newMessage, setNewMessage] = useState<ChatMessage>({});
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const params = useParams();
    const numberRoomId = Number(params.roomId);
    const { user } = useSelector((state: UserStore) => state.userStore);
    const { chatRigthSideOpen } = useSelector((state: GeneralStore) => state.generalStore);
    const { connected, subscribeToRoom, sendMessage, unsubscribeFromRoom } = useContext(WebSocketContext);

    const messageOnChange = (value: string) => {
        setNewMessage({ ...newMessage, text: value });
    };

    useEffect(() => {
        // Fetch initial messages from API
        API.get(`/api/messages/${numberRoomId}`).then(res => {
            setMessages(res.data);
        });
    }, [numberRoomId]);

    // Message handler from subscribed room
    const getMessageHandler = useCallback((message: Message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages(prevMessages => [chatMessage, ...prevMessages]);
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

    //Send message to the room
    const sendMessageHandler = () => {
        const chatMessage: ChatMessage = { text: newMessage.text, chatRoom: { id: numberRoomId } };
        sendMessage(numberRoomId, chatMessage);
        setNewMessage(prev => ({ ...prev, text: "" }));
    };

    return (
        <>
            <div className="flex flex-col flex-grow">
                <ChatHeader />
                <div className="overflow-auto p-4 h-full max-h-[calc(100vh-64px-88px-96px)] flex flex-col-reverse">
                    {messages.map(message => (
                        <Tooltip key={message.id} placement={message.user?.id === user?.id ? "left" : "right"} title={moment(message.createdAt).fromNow()}>
                            <div className={`w-fit my-2 ${message.user?.id === user?.id ? "mr-0 ml-auto" : ""} text-sm`}>
                                <div className={`border ${message.user?.id === user?.id ? "border-neutral-300 text-slate-800" : "bg-violet-600 text-neutral-50"} w-full p-2 rounded-xl`}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                </div>
                <div className="p-4 gap-5 h-24 flex">
                    <div className="w-full">
                        <Input placeholder="Aa" size="large" onChange={(e) => messageOnChange(e.target.value)} value={newMessage.text} />
                    </div>
                    <Button icon={<LuSendHorizonal />} type="default" size="large" onClick={sendMessageHandler} />
                </div>
            </div>
            {chatRigthSideOpen && <div className="min-w-[250px] max-w-[380px] basis-1/3"><ChatRightSection /></div>}
        </>
    );
};
