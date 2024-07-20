import React from 'react'
import { LeftMenu } from '../components/LeftMenu'
import { Chat } from '../components/Chat'
import { Outlet } from 'react-router'

type Props = {}

export const ChatLayout = (props: Props) => {
    return (
        <div className="flex">
            <LeftMenu />
            <Outlet />
        </div>
    )
}