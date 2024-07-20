import { Link, useNavigate } from 'react-router-dom'
import { ChatRoom } from '../types/globalTypes'
import moment from 'moment'
import img from "../assets/test.jpg"
import { UserStore } from '../store/store'
import { useSelector } from 'react-redux'

type LeftMenuChatRoomProps = {
    room: ChatRoom
}

export const LeftMenuChatRoom = ({ room }: LeftMenuChatRoomProps) => {
    const navigate = useNavigate();
    const { user } = useSelector((state: UserStore) => state.userStore);

    const lastMessage = room.lastMessage ? room.lastMessage.text : "No messages yet";
    const createdAt = room.lastMessage?.createdAt ? moment(room.lastMessage?.createdAt).fromNow() : "";
    const roomName = room.participants && room.participants.length > 0 ? room.participants[0].firstName + " " + room.participants[0].lastName : "";

    return (
        <li className="group" key={room.id} onClick={() => navigate(`/chat/${room.id}`)}>
            <Link to="#" className="flex items-center p-4 gap-2 hover:bg-slate-100 rounded-md">
                <img src={img} alt="img" className="w-10 h-10 rounded-md" />
                <div className="w-full">
                    <p className="text-slate-800 font-semibold text-sm">{roomName}</p>
                    <p className="text-xs text-slate-500 flex justify-between">
                        <span>{lastMessage}</span>
                        <span>{createdAt}</span>
                    </p>
                </div>
            </Link>
        </li>
    )
}
