import { Button, Modal, notification, Popconfirm, Spin, Tabs, TabsProps, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { APIImage } from '../../utils/APIImage'
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { GrEmoji } from 'react-icons/gr';
import { MemojiSelector } from '../MemojiSelector';
import { IoImageOutline } from 'react-icons/io5';

type UploadImageModalProps = {
    open: boolean,
    onClose: () => void,
    imageURL: string,
    onFinishHandler: (uploadImage: string) => void, //returning with the uploaded image,
    headerText?: string,
}

export const UploadImageModal = ({ open, onClose, imageURL, onFinishHandler, headerText }: UploadImageModalProps) => {
    const [uploadImage, setUploadImage] = useState(imageURL);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setLoading(false);
            setUploadImage("");
        }
        setUploadImage(imageURL)
    }, [open])

    const handleImageUpload = async (options: UploadRequestOption) => {
        const { file } = options;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await APIImage.post('/api/images/upload', formData).then((res) => {
                setUploadImage(res.data);
                setLoading(false);
            });
            notification.success({ message: 'Upload successful.', placement: 'bottom' });
        } catch (error) {
            console.error('Upload failed:', error);
            notification.error({ message: 'Upload failed.' });
        }
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label:
                <div className='flex items-center gap-2 py-1'>
                    <GrEmoji size={20} />
                    <span>Memoji</span>
                </div>,
            children: <MemojiSelector />,
        },
        {
            key: '2',
            label:
                <div className='flex items-center gap-2 py-1' >
                    <IoImageOutline size={20} />
                    <span>Upload</span>
                </div >,
            children: <>
                <Spin spinning={loading}>
                    <Upload customRequest={handleImageUpload} listType="picture-circle" showUploadList={false} className="!flex justify-center">
                        {
                            uploadImage ? (
                                <img src={uploadImage} alt="Your profile image" className="h-full rounded-full w-full object-cover p-1" />
                            ) :
                                <button type="button" className="bg-none border-none flex flex-col items-center">
                                    {!loading && <FaPlus size={20} />}
                                    <div className="mt-2">Upload</div>
                                </button>
                        }
                    </Upload>
                </Spin>
                <div className="text-right">
                    <Popconfirm
                        title={"Information"}
                        description={"Are you sure to save this image to you profile picture?"}
                        okText="Confirm"
                        onConfirm={() => onFinishHandler(uploadImage)}
                    >
                        <Button type="primary">Save</Button>
                    </Popconfirm>
                </div>
            </>,
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            okText="Save"
            title={headerText}
            footer={null}
        >
            <Tabs items={items} />

        </Modal>
    )
}