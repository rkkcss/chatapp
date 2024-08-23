import { useContext, useEffect, useState } from "react"
import { API } from "../utils/API";
import { ChatRoom } from "../types/globalTypes";
import { LeftMenuChatRoom } from "./LeftMenuChatRoom";
import { LuPenSquare } from "react-icons/lu";
import { Button } from "antd";
import { NewChatModal } from "./modals/NewChatModal";
import { WebSocketStore } from "../store/store";
import { useSelector } from "react-redux";
import { WebSocketContext } from "../contexts/WebSocketProvider";

export const LeftMenu = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [newChatRoom, setNewChatRoom] = useState<ChatRoom | null>(null);
    const [newChatModalIsOpen, setNewChatModalIsOpen] = useState<boolean>(false);
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const { messageNotification } = useContext(WebSocketContext);

    useEffect(() => {
        API.get("/api/chat-rooms").then((res) => {
            console.log(res);
            setChatRooms(res.data);
        })
    }, [])

    useEffect(() => {
        if (messageNotification?.chatRoom?.id) {
            const updatedChatRooms = [...chatRooms];
            const targetRoomIndex = updatedChatRooms.findIndex(room => room.id === messageNotification?.chatRoom?.id);
            if (targetRoomIndex !== -1) {
                const targetRoom = updatedChatRooms[targetRoomIndex];
                updatedChatRooms.splice(targetRoomIndex, 1);
                updatedChatRooms.unshift({ ...targetRoom, lastMessage: messageNotification });
                setChatRooms(updatedChatRooms);
            }
        }
    }, [messageNotification]);

    useEffect(() => {
        if (newChatRoom) {
            setChatRooms(prev => {
                return [newChatRoom, ...prev,];
            })
        }
    }, [newChatRoom]);

    return (
        <>
            <NewChatModal onClose={() => setNewChatModalIsOpen(false)}
                isOpen={newChatModalIsOpen}
                setNewChatRoom={setNewChatRoom}
            />
            <div className={`h-[calc(100vh-64px)] shadow-lg w-[360px] min-w-[360px] max-w-[360px] ${selectedRoom ? "md:block hidden" : "block"}`}>
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