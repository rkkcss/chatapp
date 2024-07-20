import { BsThreeDots } from "react-icons/bs"
import img from "../assets/test.jpg"
import { Button, Dropdown, Form, Input, MenuProps, Tooltip } from "antd"
import { LuSendHorizonal } from "react-icons/lu";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { API } from "../utils/API";
import { Message } from "../types/globalTypes";
import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import moment from "moment";
import FormItem from "antd/es/form/FormItem";
import { sendMessage, subscribeToRoom, unsubscribeFromRoom } from "../utils/WebSocket";


export const Chat = () => {
    const [newMessage, setNewMessage] = useState<Message | {}>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const { roomId } = useParams();
    const { user } = useSelector((state: UserStore) => state.userStore);

    const messageOnChange = (value: string) => {
        console.log(value);
        setNewMessage({ ...newMessage, text: value });
    }

    useEffect(() => {
        API.get(`/api/messages/${roomId}`).then(res => {
            setMessages(res.data);
            console.log(res);
        });

        subscribeToRoom(roomId, (message) => {
            const chatMessage = JSON.parse(message.body);
            console.log("NANANNA", message);
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
        });

        return () => {
            unsubscribeFromRoom(roomId as number);
        }
    }, [roomId])

    const sendMessage2 = () => {
        // const message = { text: newMessage };
        sendMessage(roomId, { ...newMessage, chatRoom: { id: roomId } });
        setNewMessage("");
    };

    const handleSendMessage = () => {
        API.post(`/api/messages`, {
            ...newMessage,
            chatRoom: {
                id: roomId,
            }
        }).then(res => {
            setMessages([res.data, ...messages]);
            setNewMessage({});
        })
    }

    const items: MenuProps['items'] = [
        {
            label: <a href="https://www.antgroup.com">1st menu item</a>,
            key: '0',
        },
        {
            label: <a href="https://www.aliyun.com">2nd menu item</a>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    return (
        <div className="flex flex-col flex-grow">
            <div className="flex items-center backdrop-filter backdrop-blur-lg bg-white/40 p-4 shadow-sm">
                <img src={img} alt="img" className="w-14 h-14 rounded-md" />
                <div className="ml-3">
                    <p className="font-bold text-slate-800">{ }</p>
                    <p className="text-xs text-green-500 ">Active</p>
                </div>

                <div className="mr-0 ml-auto">
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="default" icon={<BsThreeDots />} onClick={(e) => e.preventDefault()}></Button>
                    </Dropdown>
                </div>
            </div>

            <div className="overflow-auto p-4 h-full max-h-[calc(100vh-64px-88px-96px)] flex flex-col-reverse">
                {messages.map((message, index) => {

                    return (
                        message.user?.id === user?.id ? (
                            <Tooltip placement="left" title={moment(message.createdAt).fromNow()}>
                                <div key={message.id} className={`w-fit my-2 mr-0 ml-auto max-w-[calc(100%-3rem)] text-sm`}>
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
                    <Input placeholder="Aa" size="large" onChange={(e) => messageOnChange(e.target.value)} />
                </div>
                <Button icon={<LuSendHorizonal />} type="default" size="large" onClick={() => sendMessage2()}></Button>
            </div>
        </div >
    )
}