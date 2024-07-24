
import { Button, Input, Tooltip } from "antd"
import { LuSendHorizonal } from "react-icons/lu";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API } from "../utils/API";
import { ChatMessage } from "../types/globalTypes";
import { useSelector } from "react-redux";
import { UserStore, WebSocketStore } from "../store/store";
import moment from "moment";
import { ChatHeader } from "./ChatHeader";
import useWebSocket from "../hooks/useWebSocket";
import { Message } from "webstomp-client";


export const Chat = () => {
    const [newMessage, setNewMessage] = useState<ChatMessage>({});
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const params = useParams();
    const numberRoomId = Number(params.roomId)
    const { user } = useSelector((state: UserStore) => state.userStore);
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const { sendMessage, connected, subscribeToRoom, unsubscribeFromRoom } = useWebSocket();

    const messageOnChange = (value: string) => {
        console.log(value);
        setNewMessage({ ...newMessage, text: value });
    }

    useEffect(() => {
        API.get(`/api/messages/${numberRoomId}`).then(res => {
            setMessages(res.data);
        });
    }, [numberRoomId]);

    const messageHandler = (message: Message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [chatMessage, ...prevMessages]);
    }

    useEffect(() => {
        console.log("CONNECT", connected);
        if (connected) {
            subscribeToRoom(numberRoomId, messageHandler);
        }

        return () => {
            unsubscribeFromRoom();
        };
    }, [connected, numberRoomId]);

    const sendMessage2 = () => {
        const chatMessage: ChatMessage = { text: newMessage.text, chatRoom: { id: numberRoomId } };
        sendMessage(numberRoomId, chatMessage);
        setNewMessage(prev => ({ ...prev, text: "" }));
    };

    return (
        <div className="flex flex-col flex-grow">
            <ChatHeader />
            <div className="overflow-auto p-4 h-full max-h-[calc(100vh-64px-88px-96px)] flex flex-col-reverse">
                {messages.map((message) => {

                    return (
                        message.user?.id === user?.id ? (
                            <Tooltip key={message.id} placement="left" title={moment(message.createdAt).fromNow()}>
                                <div className={`w-fit my-2 mr-0 ml-auto max-w-[calc(100%-3rem)] text-sm`}>
                                    <div className={`border border-neutral-300 text-slate-800 w-full p-2 rounded-xl`}>
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip key={message.id} placement="right" title={moment(message.createdAt).fromNow()}>
                                <div className="w-fit my-2 text-sm">
                                    <div className="bg-violet-600 text-neutral-50 w-full p-2 rounded-xl">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            </Tooltip>
                        )
                    )
                }
                )}
            </div>
            <div className="p-4 gap-5 h-24 flex">
                <div className="w-full">
                    <Input placeholder="Aa" size="large" onChange={(e) => messageOnChange(e.target.value)} value={newMessage.text} />
                </div>
                <Button icon={<LuSendHorizonal />} type="default" size="large" onClick={() => sendMessage2()}></Button>
            </div>
        </div >
    )
}