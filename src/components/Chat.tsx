
import { Button, Input, Tooltip } from "antd"
import { LuSendHorizonal } from "react-icons/lu";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API } from "../utils/API";
import { Message } from "../types/globalTypes";
import { useDispatch, useSelector } from "react-redux";
import { UserStore, WebSocketStore } from "../store/store";
import moment from "moment";
import { sendMessage, subscribeToRoom, unsubscribeFromRoom } from "../utils/WebSocket";
import { ChatHeader } from "./ChatHeader";


export const Chat = () => {
    const [newMessage, setNewMessage] = useState<Message>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const params = useParams();
    const numberRoomId = Number(params.roomId)
    const { user } = useSelector((state: UserStore) => state.userStore);
    const { connected } = useSelector((state: WebSocketStore) => state.webSocketStore)
    const dispatch = useDispatch();

    const messageOnChange = (value: string) => {
        console.log(value);
        setNewMessage({ ...newMessage, text: value });
    }

    useEffect(() => {
        API.get(`/api/messages/${numberRoomId}`).then(res => {
            setMessages(res.data);
            console.log(res);
        });
    }, [numberRoomId]);

    useEffect(() => {
        console.log("false", connected);
        if (connected) {
            console.log("true", connected);
            subscribeToRoom(numberRoomId, (message) => {
                const chatMessage = JSON.parse(message.body);
                console.log("NANANNA", message);
                setMessages((prevMessages) => [chatMessage, ...prevMessages]);
            });
        }

        return () => {
            if (numberRoomId) {
                unsubscribeFromRoom(numberRoomId as number, dispatch);
            }

        }
    }, [numberRoomId, connected])

    const sendMessage2 = () => {
        // const message = { text: newMessage };
        sendMessage(numberRoomId, { ...newMessage, chatRoom: { id: numberRoomId } });
        setNewMessage(prev => ({ ...prev, text: "" }));
    };

    // const handleSendMessage = () => {
    //     API.post(`/api/messages`, {
    //         ...newMessage,
    //         chatRoom: {
    //             id: numberRoomId,
    //         }
    //     }).then(res => {
    //         setMessages([res.data, ...messages]);
    //         setNewMessage({});
    //     })
    // }

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