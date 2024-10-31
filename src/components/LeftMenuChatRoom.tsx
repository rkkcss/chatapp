import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChatRoom } from '../types/globalTypes'
import moment from 'moment'
import useRoomName from '../hooks/useRoomName'
import { ChatRoomImage } from './ChatRoomImage'
import { useEffect, useState } from 'react'

type LeftMenuChatRoomProps = {
    room: ChatRoom
}

export const LeftMenuChatRoom = ({ room }: LeftMenuChatRoomProps) => {
    const navigate = useNavigate();
    const [lastMessage, setLastMessage] = useState(room.lastMessage)
    const pathRoomId = useLocation().pathname.split('/')[2]

    const roomName = useRoomName({ participants: room.participants });

    const roomOnClickHandler = () => {
        navigate(`/chat/${room.id}`)
    }

    useEffect(() => {
        setLastMessage(room.lastMessage);
    }, [room])

    return (
        <li className="group" key={room.id} onClick={roomOnClickHandler}>
            <Link to="#" className={`flex items-center p-4 gap-2 rounded-md 
            ${room.id == Number(pathRoomId) ?
                    'bg-gray-400/30' :
                    'hover:bg-slate-100'
                }`
            }
            >
                <div>
                    <ChatRoomImage participants={room.participants || []} />
                </div>
                <div className="w-full">
                    <p className="text-slate-800 font-semibold text-sm">{roomName}</p>
                    <p className="text-xs text-slate-500 flex justify-between">
                        <span className="truncate max-w-[10rem]">{lastMessage?.text}</span>
                        <span>{lastMessage?.createdAt ? moment(room.lastMessage?.createdAt).fromNow() : ""}</span>
                    </p>
                </div>
            </Link>
        </li>
    )
}
