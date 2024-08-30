import { useSelector } from "react-redux"
import { UserStore } from "../store/store"
import { Button, Tabs, TabsProps } from "antd";
import { BsFillImageFill } from "react-icons/bs";
import { EditProfile } from "../components/EditProfile";
import { useState } from "react";
import { } from "../utils/API";
import { UploadImageModal } from "../components/modals/UploadImageModal";

export const Profile = () => {
    const { user } = useSelector((user: UserStore) => user.userStore);
    const [uploadImageModal, setUploadImageModal] = useState<boolean>(false)

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Edit profile',
            children: <EditProfile userProps={user} />,
        },
    ];

    return (
        <>
            <UploadImageModal open={uploadImageModal} onClose={() => setUploadImageModal(false)} imageURL={user?.imageUrl} />
            <div className="flex justify-center items-center my-2 h-full">
                <div className=" flex flex-col justify-center items-center">
                    <h1 className="text-2xl text-slate-800">Profile Page</h1>
                    <div className="w-[50rem] shadow-lg rounded-lg p-5">

                        {/* User Profile Here */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img src={user?.imageUrl} alt="User Profile" className="w-44 h-44 rounded-full object-cover mb-2" />
                                <div className="absolute bottom-4 right-3 rounded-full">
                                    <Button icon={<BsFillImageFill size={18} />} type="primary" onClick={() => setUploadImageModal(true)}>
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <div className="text-center">
                            <p className="text-lg text-slate-800 font-semibold">{user?.firstName + " " + user?.lastName}</p>
                        </div>

                        <Tabs defaultActiveKey="1" items={items} />
                    </div>
                </div>
            </div>
        </>
    )

}