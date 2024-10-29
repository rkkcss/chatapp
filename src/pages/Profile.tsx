import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, UserStore } from "../store/store"
import { Button, notification, Tabs, TabsProps } from "antd";
import { EditProfile } from "../components/EditProfile";
import { useEffect, useState } from "react";
import { API } from "../utils/API";
import { UploadImageModal } from "../components/modals/UploadImageModal";
import { useParams } from "react-router";
import { updateUserImg } from "../redux/userSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineImage } from "react-icons/md";
import { UserProfile } from "../components/UserProfile";
import { PublicUser } from "../types/globalTypes";

export const Profile = () => {
    const { user } = useSelector((user: UserStore) => user.userStore);
    const [uploadImageModal, setUploadImageModal] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<PublicUser | null>(null);
    const { login } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        API.get(`/api/user/${login}`).then((res) => {
            setUserInfo(res.data);
            console.log("USERINFO", res.data);
        })

    }, [])

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Edit profile',
            children: <EditProfile userProps={user} />,
        },
    ];

    const handleChangeImg = (uploadImage: string) => {
        dispatch(updateUserImg(uploadImage)).then(() => {
            notification.success({ message: 'Image updated successfully', placement: 'bottom' })
        });
    }

    return (
        <>
            <UploadImageModal open={uploadImageModal}
                onClose={() => setUploadImageModal(false)}
                imageURL={user?.imageUrl || ""}
                onFinishHandler={handleChangeImg}
                headerText="Upload profile image"
            />
            <div className="flex justify-center items-center h-full">
                <div className="flex flex-col justify-center items-center min-w-[10rem] w-[50rem] max-w-[50rem] px-4">
                    <h1 className="text-2xl text-slate-700 my-6 font-medium text-left w-full">Profile Page</h1>
                    <div className="shadow-lg rounded-lg p-5 w-full">

                        {/* User Profile Here */}

                        {
                            userInfo?.id == user?.id ?
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                                        <div className="relative">
                                            <img src={user?.imageUrl} alt="User Profile" className="w-44 h-44 rounded-full object-cover mb-2" />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <Button type="default" className="font-semibold text-slate-600" icon={<MdOutlineImage size={20} />} onClick={() => setUploadImageModal(true)}>Change</Button>
                                            <Button type="default" className="font-semibold text-slate-600" icon={<RiDeleteBin6Line size={20} />} >Remove</Button>
                                        </div>
                                    </div>

                                    <Tabs defaultActiveKey="1" items={items} type="line" />
                                </>
                                :
                                <>
                                    <UserProfile userInfo={userInfo} />
                                </>

                        }

                    </div>
                </div>
            </div>
        </>
    )

}