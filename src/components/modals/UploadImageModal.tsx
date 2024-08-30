import { Button, Modal, notification, Popconfirm, Spin, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { APIImage } from '../../utils/APIImage'
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { API } from '../../utils/API';
import { useDispatch } from 'react-redux';
import { setImageUrl } from '../../redux/userSlice';

type UploadImageModalProps = {
    open: boolean,
    onClose: () => void,
    imageURL: string | ""
}

export const UploadImageModal = ({ open, onClose, imageURL }: UploadImageModalProps) => {
    const [uploadImage, setUploadImage] = useState(imageURL);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch()

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

    const handleChangeImg = () => {
        console.log(uploadImage);
        API.post("/api/account/change-image", { imageUrl: uploadImage }).then((res) => {
            console.log(res);
            dispatch(setImageUrl(uploadImage))
        })
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            okText="Save"
            title="Upload profile image"
            footer={
                <>
                    <Popconfirm
                        title={"Information"}
                        description={"Are you sure to save this image to you profile picture?"}
                        okText="Confirm"
                        onConfirm={handleChangeImg}
                    >
                        <Button type="primary">Save</Button>
                    </Popconfirm>
                </>
            }
        >
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
        </Modal>
    )
}