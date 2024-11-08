import { useSelector } from "react-redux";
import { WebSocketStore } from "../store/store";
import { Collapse, CollapseProps, Image } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { API } from "../utils/API";

export const ChatRightSection = () => {
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    const navigate = useNavigate();
    const [mediaFiles, setMediaFiles] = useState<string[]>([])

    useEffect(() => {
        API.get(`/api/messages/get-all-media/${selectedRoom?.id}`).then((res) => {
            setMediaFiles(res.data);
            console.log(res.data);
        })
    }, [selectedRoom]);

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <p className="text-lg">Participants</p>,
            children:
                <ul>
                    {selectedRoom?.participants?.map(participant => (
                        <li key={participant.id}
                            className="mb-2 hover:bg-gray-200/70 cursor-pointer p-2 rounded-xl"
                            onClick={() => navigate(`/profile/${participant.login}`)}
                        >
                            <div className="flex gap-2 items-center">
                                <div>
                                    <img src={participant.imageUrl} alt="user" className="rounded-lg min-h-9 min-w-9 h-9 w-9 object-cover" />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-semibold">{participant.firstName + " " + participant.lastName}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {selectedRoom?.participants?.length === 0 && <li>No participants</li>}
                </ul>,
        },
        {
            key: '2',
            label: 'Media files',
            children:
                <div>
                    <div className="grid grid-cols-3 gap-0.5">
                        {mediaFiles.map((file) => (
                            <Image key={file} src={file} alt="media" width={110} height={110} className="" />
                        ))}
                    </div>
                </div>,
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <p>678</p>,
        },
    ];

    return (
        <>
            <div className="p-2 bg-neutral-50 h-full w-full">
                <Collapse className="" items={items} defaultActiveKey={['1']} ghost />
            </div>
        </>
    )
}