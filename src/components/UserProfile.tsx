import React from 'react'
import { PublicUser } from '../types/globalTypes'
import { Button, Divider } from 'antd'
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

type UserProfileProps = {
    userInfo: PublicUser | null,
}

export const UserProfile = ({ userInfo }: UserProfileProps) => {
    return (
        <div>

            <div className="flex sm:flex-row gap-4 justify-center">
                <div className="relative">
                    <img src={userInfo?.imageUrl} alt="User Profile" className="w-44 h-44 rounded-full object-cover mb-2" />
                </div>
            </div>

            <p className="text-slate-700 font-semibold text-center text-xl my-2">{userInfo?.firstName + " " + userInfo?.lastName}</p>

            <div className="flex gap-4 justify-center">
                <Button icon={<FaFacebookSquare size={20} />} type="primary" ></Button>
                <Button icon={<FaInstagram size={20} />} type="primary" ></Button>
                <Button icon={<FaXTwitter size={20} />} type="primary" ></Button>
            </div>
            <Divider />
        </div>
    )
}