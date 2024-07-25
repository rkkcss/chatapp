import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { WebSocketStore } from '../../store/store'
import img from "../../assets/test.jpg"

type ParticipantsModalProps = {
    open: boolean,
    onClose: () => void,
}

export const ParticipantsModal = ({ open, onClose }: ParticipantsModalProps) => {
    const { selectedRoom } = useSelector((state: WebSocketStore) => state.webSocketStore);
    return (
        <Modal title="Participants" open={open} onCancel={onClose} footer={false}>
            <div>
                <ul className="mt-6">
                    {
                        selectedRoom?.participants?.map(participant => (
                            <li key={participant.id} className="flex gap-2 items-center mb-2">
                                <div>
                                    <img src={img} alt="user" width="48" height="48" className="rounded-lg" />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-semibold">{participant.firstName + " " + participant.lastName}</p>
                                </div>

                            </li>
                        )) || []
                    }
                </ul>
            </div>
        </Modal>
    )
}