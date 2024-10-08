import { useEffect, useState } from 'react'
import { API } from '../utils/API'
import { Button, notification, Segmented } from 'antd'
import { UploadImageModal } from '../components/modals/UploadImageModal'
import { MdEmojiEmotions } from 'react-icons/md'
import { GrEmoji } from 'react-icons/gr'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { DefaultAvatarImage } from '../types/globalTypes'
import { useNavigate } from 'react-router'

export const AdminPage = () => {
    const [defaultImages, setDefaultImages] = useState<DefaultAvatarImage[]>([]);
    const [addImageModal, setAddImageModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        API.get("/api/avatar-images").then(res => {
            setDefaultImages(res.data)
        }).then(res => {

        }).catch(err => {
            notification.error({ message: err.response.data.detail, placement: "bottom" });
            navigate("/chat")
        });
    }, [])

    const uploadedImageHandler = (uploadedImage: string) => {
        API.post("/api/avatar-images", { imageUrl: uploadedImage }).then(res => {
            setDefaultImages([...defaultImages, res.data])
        })
    }

    return (
        <>
            <UploadImageModal onClose={() => setAddImageModal(false)}
                open={addImageModal}
                imageURL=""
                onFinishHandler={uploadedImageHandler}
            />
            <div className="h-[calc(100dvh-64px)] w-screen flex justify-center items-start pt-7">
                <div className="bg-neutral-100 min-w-[375px] w-[600px] shadow-lg p-8">
                    <h1 className="text-center text-2xl font-medium text-slate-800">
                        Admin Page
                    </h1>

                    <Segmented
                        options={[{
                            label:
                                <div className='flex items-center gap-2 py-1'>
                                    <GrEmoji size={20} />
                                    <span>Memoji</span>
                                </div>, value: "memoji"
                        },
                        {
                            label:
                                <div className='flex items-center gap-2 py-1'>
                                    <MdEmojiEmotions size={20} />
                                    <span>Images</span>
                                </div>, value: "images"
                        }
                        ]}
                    />
                    <div className="pt-8">

                        <ul className="grid grid-cols-4 gap-y-6">
                            {defaultImages.map(img => (
                                <li key={img.id} className="text-center flex flex-col items-center w-full">
                                    <div className="outline-violet-600 outline outline-2 rounded-full relative">
                                        <img src={img.url}
                                            alt={img.name}
                                            className="h-[80px] w-[80px] object-cover rounded-full "
                                        />
                                        <IoIosCheckmarkCircle size={24} className=" text-violet-600 absolute top-0 -right-1 bg-white rounded-full" />
                                    </div>
                                    <p className="font-medium text-slate-700">{img.name}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 text-end">
                            <Button type="primary" onClick={() => setAddImageModal(true)}>Add New Avatar Image</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}