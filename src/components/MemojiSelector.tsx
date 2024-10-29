import { useEffect, useState } from 'react'
import { API } from '../utils/API';
import { DefaultAvatarImage } from '../types/globalTypes';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { AppDispatch, UserStore } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Button, notification, Popconfirm } from 'antd';
import { updateUserImg } from '../redux/userSlice';

export const MemojiSelector = () => {
    const { user } = useSelector((user: UserStore) => user.userStore);
    const [avatarImages, setAvatarImages] = useState<DefaultAvatarImage[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(user?.imageUrl);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        API.get("/api/avatar-images/public").then(res => {
            setAvatarImages(res.data);
        });
    }, [])

    const handleSelectedImage = () => {
        dispatch(updateUserImg(selectedAvatar || "")).then(() => {
            notification.success({ message: "Successfully selected your avatar", placement: "bottom" });
        })
    }

    return (
        <div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
                {avatarImages?.map(img => (
                    <li key={img.id} className="text-center flex flex-col items-center w-full">
                        <div className={`rounded-full relative cursor-pointer 
                        ${selectedAvatar == img.url && 'outline-violet-600 outline outline-2'} `
                        }
                            onClick={() => setSelectedAvatar(img.url)}>
                            <img src={img.url}
                                alt={img.name}
                                className="h-[80px] w-[80px] object-cover rounded-full "
                            />
                            {
                                selectedAvatar == img.url &&
                                <IoIosCheckmarkCircle size={24}
                                    className=" text-violet-600 absolute top-0 -right-1 bg-white rounded-full"
                                />
                            }
                        </div>
                        <p className="font-medium text-slate-700">{img.name}</p>
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex gap-2 justify-end">
                <Popconfirm
                    title={"Information"}
                    description={"Are you sure to save this image to you profile picture?"}
                    okText="Confirm"
                    onConfirm={handleSelectedImage}
                >
                    <Button type="primary">Save</Button>
                </Popconfirm>
            </div>
        </div>
    )
}