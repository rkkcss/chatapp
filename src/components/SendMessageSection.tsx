import { Button, Input, notification, Popover, Upload } from 'antd'
import { useContext, useState } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { FaRegEdit } from 'react-icons/fa'
import { LuSendHorizonal } from 'react-icons/lu'
import { MdDeleteForever } from 'react-icons/md'
import { ChatMessage } from '../types/globalTypes'
import { APIImage } from '../utils/APIImage'
import { WebSocketContext } from '../contexts/WebSocketProvider'
import { useParams } from 'react-router'
import { UploadRequestOption } from 'rc-upload/lib/interface';

export const SendMessageSection = () => {

    const [newMessage, setNewMessage] = useState<ChatMessage>({});
    const { sendMessage } = useContext(WebSocketContext);

    const params = useParams();
    const numberRoomId = Number(params.roomId);

    //Send message to the room
    const sendMessageHandler = () => {
        const chatMessage: ChatMessage = { text: newMessage.text, mediaUrl: newMessage.mediaUrl, chatRoom: { id: numberRoomId } };
        sendMessage(numberRoomId, chatMessage);
        setNewMessage(prev => ({ ...prev, text: "", mediaUrl: "" }));
    };

    const handleImageUpload = async (options: UploadRequestOption) => {
        const { file } = options;
        // setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await APIImage.post('/api/images/upload', formData).then((res) => {
                setNewMessage(prev => ({ ...prev, mediaUrl: res.data }));
                // setLoading(false);
            });
            notification.success({ message: 'Upload successful.', placement: 'bottom' });
        } catch (error) {
            console.error('Upload failed:', error);
            notification.error({ message: 'Upload failed.' });
        }
    };

    const messageOnChange = (value: string) => {
        setNewMessage({ ...newMessage, text: value });
    };

    return (
        <>
            <Upload customRequest={handleImageUpload} showUploadList={false}>
                <Button icon={<CiImageOn size={25} />} type="text" size="large" />
            </Upload>
            <div className="w-full flex">
                {
                    newMessage.mediaUrl &&
                    <Popover content={
                        <>
                            <div className="flex gap-4">
                                <Button icon={<MdDeleteForever size={24} />} type="text" onClick={() => setNewMessage(prev => ({ ...prev, mediaUrl: "" }))} />
                                <Upload customRequest={handleImageUpload} showUploadList={false}>
                                    <Button icon={<FaRegEdit size={22} />} type="text" />
                                </Upload>
                            </div>
                        </>
                    }>
                        <div className="w-14 h-14 mr-4 hover:opacity-70 cursor-pointer">
                            <img src={newMessage.mediaUrl} alt="" className="w-full h-full rounded-md object-cover" />
                        </div>
                    </Popover>
                }
                <div className="w-full flex items-center">
                    <Input placeholder="Aa" size="large" onChange={(e) => messageOnChange(e.target.value)} value={newMessage.text} />
                </div>
            </div>
            <Button icon={<LuSendHorizonal />} type="default" size="large" onClick={sendMessageHandler} />
        </>
    )
}