import { Dropdown, Tooltip } from "antd"
import { Header } from "antd/es/layout/layout"
import { LuHome, LuMessageSquare } from "react-icons/lu"
import { RxAvatar } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"
import { IoMdNotificationsOutline } from "react-icons/io"

export const LayoutHeader = () => {
    const navigate = useNavigate();
    const menuItems = [
        {
            key: 1,
            icon: <LuHome size={26} />,
            label: "Home"
        },
        {
            key: 2,
            icon: <LuMessageSquare size={26} />,
            label: "Messages"
        }
    ]

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: "Profile",
            onClick: () => navigate("/profile")
        },
        {
            type: 'divider'
        },
        {
            key: '2',
            label: "Logout",
            onClick: () => navigate("/logout")
        },
    ]

    return (
        <Header className="bg-neutral-50 p-4">
            <ul className="h-full flex gap-4">
                {
                    menuItems.map((item) => (
                        <li key={item.key} className="flex items-center">
                            <Tooltip placement="bottom" title={item.label}>
                                <Link to="#" className="p-2 w-fit bg-slate-200 rounded-full ">
                                    {item.icon}
                                </Link>
                            </Tooltip>
                        </li>
                    ))
                }
                <li className="ml-auto mr-0 flex items-center">
                    <Link to="#" className="w-fit p-2 bg-slate-100 rounded-full">
                        <IoMdNotificationsOutline size={28} />
                    </Link>
                </li>
                <li className=" flex items-center">
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()} className=" w-fit p-2 bg-slate-100 rounded-full">
                            <RxAvatar size={28} />
                        </a>
                    </Dropdown>
                </li>
            </ul>
        </Header>
    )
}