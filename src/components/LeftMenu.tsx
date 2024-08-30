import { useContext, useEffect, useState } from "react"
import { API } from "../utils/API";
import { ChatRoom } from "../types/globalTypes";
import { LeftMenuChatRoom } from "./LeftMenuChatRoom";
import { LuPenSquare } from "react-icons/lu";
import { Button } from "antd";
import { NewChatModal } from "./modals/NewChatModal";
import { WebSocketStore } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { WebSocketContext } from "../contexts/WebSocketProvider";
import { setRoom } from "../redux/webSocketSlice";
import { TiMessages } from "react-icons/ti";
import { useParams } from "react-router";

export const LeftMenu = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [newChatRoom, setNewChatRoom] = useState<ChatRoom | null>(null);
    const [newChatModalIsOpen, setNewChatModalIsOpen] = useState<boolean>(false);
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const { messageNotification } = useContext(WebSocketContext);
    const dispatch = useDispatch();
    const { roomId } = useParams();

    useEffect(() => {
        API.get("/api/chat-rooms").then((res) => {
            setChatRooms(res.data);
        })
        return () => {
            // Reset selected room when navigating to a different room or reload page
            if (!roomId) {
                dispatch(setRoom(null));
            }
        }
    }, [])

    useEffect(() => {
        if (messageNotification?.chatRoom?.id) {
            const updatedChatRooms = [...chatRooms];
            const targetRoomIndex = updatedChatRooms.findIndex(room => room.id === messageNotification?.chatRoom?.id);
            if (targetRoomIndex !== -1) {
                const targetRoom = updatedChatRooms[targetRoomIndex];
                updatedChatRooms.splice(targetRoomIndex, 1);

                updatedChatRooms.unshift({ ...targetRoom, lastMessage: messageNotification });
                console.log("MSWE", updatedChatRooms);
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
            <div className={`h-[calc(100vh-64px)] shadow-lg w-[360px] min-w-[360px] max-w-[360px] ${selectedRoom ? "lg:block hidden" : "block"}`}>
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
            {
                !selectedRoom &&
                <div className="w-full h-[calc(100vh-64px)] pt-10 items-center flex-col gap-4 hidden sm:flex">
                    <TiMessages size={70} className="text-slate-500" />
                    <p className="text-center text-slate-500 font-medium">Select a chat room to start messaging</p>

                </div>
            }
        </>
    )
}