import { Button, Tooltip } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { GeneralStore, WebSocketStore } from "../store/store";
import useRoomName from "../hooks/useRoomName";
import { FaAngleLeft, FaInfo } from "react-icons/fa";
import { toggleChatRightSide } from "../redux/generalSlice";
import { ChatRoomImage } from "./ChatRoomImage";
import { useNavigate } from "react-router";
import { setRoom } from "../redux/webSocketSlice";

export const ChatHeader = () => {
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const roomName = useRoomName({ participants: selectedRoom?.participants });
    const dispatch = useDispatch();
    const { chatRigthSideOpen } = useSelector((state: GeneralStore) => state.generalStore);
    const navigate = useNavigate();

    const handleBackToChat = () => {
        dispatch(setRoom(null));
        navigate("/chat");
    }

    return (
        <div className="flex items-center backdrop-filter backdrop-blur-lg bg-white/40 p-4 shadow-sm">
            <Tooltip title="Vissza" placement="bottom" className={`block lg:hidden`}>
                <Button icon={<FaAngleLeft size={28} className="text-slate-800" />} className="mr-3" type="text" onClick={handleBackToChat} />
            </Tooltip>
            <ChatRoomImage participants={selectedRoom?.participants || []} />
            {/* <img src={img} alt="img" className="w-14 h-14 rounded-md" /> */}
            <div className="ml-3">
                <p className="font-bold text-slate-800">{roomName}</p>
                <p className="text-xs text-green-500 ">Active</p>
            </div>

            <div className="mr-0 ml-auto">
                <Button type="default" icon={<FaInfo />} onClick={() => dispatch(toggleChatRightSide(!chatRigthSideOpen))}></Button>
            </div>
        </div>
    )
}