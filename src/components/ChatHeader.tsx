import img from "../assets/test.jpg"
import { Button } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { GeneralStore, WebSocketStore } from "../store/store";
import useRoomName from "../hooks/useRoomName";
import { FaInfo } from "react-icons/fa";
import { toggleChatRightSide } from "../redux/generalSlice";

export const ChatHeader = () => {
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const roomName = useRoomName({ participants: selectedRoom?.participants });
    const dispatch = useDispatch();
    const { chatRigthSideOpen } = useSelector((state: GeneralStore) => state.generalStore);

    return (
        <div className="flex items-center backdrop-filter backdrop-blur-lg bg-white/40 p-4 shadow-sm">
            <img src={img} alt="img" className="w-14 h-14 rounded-md" />
            <div className="ml-3">
                <p className="font-bold text-slate-800">{roomName}</p>
                <p className="text-xs text-green-500 ">Active</p>
            </div>

            <div className="mr-0 ml-auto">
                <Button type="default" icon={<FaInfo className="text-slate-800" />} onClick={() => dispatch(toggleChatRightSide(!chatRigthSideOpen))}></Button>
            </div>
        </div>
    )
}