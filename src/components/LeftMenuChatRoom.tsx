import { Link, useNavigate } from 'react-router-dom'
import { ChatRoom } from '../types/globalTypes'
import moment from 'moment'
import useRoomName from '../hooks/useRoomName'
import { useDispatch, useSelector } from 'react-redux'
import { setRoom } from '../redux/webSocketSlice'
import { ChatRoomImage } from './ChatRoomImage'
import { useEffect, useState } from 'react'
import { WebSocketStore } from '../store/store'

type LeftMenuChatRoomProps = {
    room: ChatRoom
}

export const LeftMenuChatRoom = ({ room }: LeftMenuChatRoomProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [lastMessage, setLastMessage] = useState(room.lastMessage)
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);

    const roomName = useRoomName({ participants: room.participants });

    const roomOnClickHandler = () => {
        dispatch(setRoom(room))
        navigate(`/chat/${room.id}`)
    }

    useEffect(() => {
        setLastMessage(room.lastMessage);
    }, [room])

    return (
        <li className="group" key={room.id} onClick={roomOnClickHandler}>
            <Link to="#" className={`flex items-center p-4 gap-2 rounded-md 
            ${selectedRoom?.id == room.id ?
                    'bg-gray-400/30' :
                    'hover:bg-slate-100'
                }`
            }
            >
                {/* <img src={img} alt="img" className="w-10 h-10 rounded-md" /> */}
                <div>
                    <ChatRoomImage participants={room.participants || []} />
                </div>
                <div className="w-full">
                    <p className="text-slate-800 font-semibold text-sm">{roomName}</p>
                    <p className="text-xs text-slate-500 flex justify-between">
                        <span>{lastMessage?.text}</span>
                        <span>{lastMessage?.createdAt ? moment(room.lastMessage?.createdAt).fromNow() : ""}</span>
                    </p>
                </div>
            </Link>
        </li>
    )
}
