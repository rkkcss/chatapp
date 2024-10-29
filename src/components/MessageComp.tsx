import { Image, Tooltip } from 'antd'
import moment from 'moment'
import { UserStore } from '../store/store'
import { useSelector } from 'react-redux'
import { ChatMessage } from '../types/globalTypes'

type MessageProps = {
    message: ChatMessage,
    lastMessageRef: (node: HTMLElement | null) => void;
    index: number;
    messagesSize: number
}

const MessageComp = ({ message, lastMessageRef, index, messagesSize }: MessageProps) => {
    const { user } = useSelector((state: UserStore) => state.userStore);

    return (
        <Tooltip key={message.id} placement={message.user?.id === user?.id ? "left" : "right"} title={moment(message.createdAt).fromNow()}>
            {

                <div ref={index + 1 == messagesSize ? lastMessageRef : null}
                    className={`
                    w-fit my-2 text-sm
                    ${message.user?.id === user?.id ?
                            "mr-0 ml-auto" : ""}`}
                >
                    {
                        message.mediaUrl && <Image src={message.mediaUrl} alt="" className="max-w-72 max-h-72 rounded-xl object-cover mb-1" />
                    }
                    {
                        message.text &&
                        <div className="w-full flex justify-end">
                            <div className={`border ${message.user?.id === user?.id ? "border-neutral-300 text-slate-800" : "bg-violet-600 border-violet-600 text-neutral-50"} p-2 rounded-xl`}>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    }
                </div>
            }

        </Tooltip>
    )
}
export default MessageComp