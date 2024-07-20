import { Link, useNavigate } from 'react-router-dom'
import { ChatRoom } from '../types/globalTypes'
import moment from 'moment'
import img from "../assets/test.jpg"
import useRoomName from '../hooks/useRoomName'

type LeftMenuChatRoomProps = {
    room: ChatRoom
}

export const LeftMenuChatRoom = ({ room }: LeftMenuChatRoomProps) => {
    const navigate = useNavigate();

    const lastMessage = room.lastMessage ? room.lastMessage.text : "No messages yet";
    const createdAt = room.lastMessage?.createdAt ? moment(room.lastMessage?.createdAt).fromNow() : "";
    const roomName = useRoomName({ participants: room.participants });

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
