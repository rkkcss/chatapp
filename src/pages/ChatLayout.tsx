
import { LeftMenu } from '../components/LeftMenu'
import { Outlet } from 'react-router'


export const ChatLayout = () => {
    return (
        <div className="flex">
            <LeftMenu />
            <Outlet />
        </div>
    )
}