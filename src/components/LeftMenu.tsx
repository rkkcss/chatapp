import { useEffect, useState } from "react"
import { API } from "../utils/API";
import { ChatRoom } from "../types/globalTypes";
import { LeftMenuChatRoom } from "./LeftMenuChatRoom";

export const LeftMenu = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        API.get("/api/chat-rooms").then((res) => {
            console.log(res);
            setChatRooms(res.data);
        })
    }, [])

    return (
        <div className="w-[360px] h-[calc(100vh-64px)] shadow-lg">
            <div className="h-full rounded-lg ">
                <div className="ml-4 pt-4">
                    <h1 className="text-2xl font-semibold text-">Chats</h1>
                </div>
                <ul className="mt-4 px-2">
                    {
                        chatRooms.map(room => (
                            <LeftMenuChatRoom key={room.id} room={room} />
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}