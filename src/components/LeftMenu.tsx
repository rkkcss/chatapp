import { useEffect, useState } from "react"
import { API } from "../utils/API";
import { ChatRoom } from "../types/globalTypes";
import { LeftMenuChatRoom } from "./LeftMenuChatRoom";
import { LuPenSquare } from "react-icons/lu";
import { Button } from "antd";
import { NewChatModal } from "./modals/NewChatModal";

export const LeftMenu = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [newChatModalIsOpen, setNewChatModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        API.get("/api/chat-rooms").then((res) => {
            console.log(res);
            setChatRooms(res.data);
        })
    }, [])

    return (
        <>
            <NewChatModal onClose={() => setNewChatModalIsOpen(false)} isOpen={newChatModalIsOpen} />
            <div className="w-[360px] h-[calc(100vh-64px)] shadow-lg">
                <div className="h-full rounded-lg ">
                    <div className="mx-4 pt-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-">Chats</h1>
                        <Button onClick={() => setNewChatModalIsOpen(true)} icon={<LuPenSquare size={22} />} type="text" size="middle" title=""></Button>
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
        </>
    )
}