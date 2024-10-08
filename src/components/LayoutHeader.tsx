import { Dropdown, Tooltip } from "antd"
import { Header } from "antd/es/layout/layout"
import { LuMessageSquare } from "react-icons/lu"
import { Link, useLocation, useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"
import { BiBell } from "react-icons/bi"
import exImg from "../assets/test.jpg"
import { TbMessage } from "react-icons/tb"
import { RiAdminLine } from "react-icons/ri"
import { UserStore } from "../store/store"
import { useSelector } from "react-redux"

export const LayoutHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useSelector((user: UserStore) => user.userStore);

    const adminItems = [
        {
            key: 2,
            icon: <RiAdminLine size={26} />,
            label: "Admin",
            url: "/admin",
        }
    ]

    const menuItems = [
        {
            key: 1,
            icon: <LuMessageSquare size={26} />,
            label: "Messages",
            url: "/chat"
        },
    ]

    const notificationItems: MenuProps['items'] = [
        {
            key: '0',
            label:
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute -bottom-1 -right-1.5">
                            <TbMessage className="bg-white rounded-full p-0.5" size={24} />
                        </div>
                        <img src={exImg} alt="" className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full" />
                    </div>

                    <p>Nem is tudom mit kéne mondani</p>
                </div>,
            onClick: () => navigate(`/profile/${user?.login}`)
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

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: "Profile",
            onClick: () => navigate(`/profile/${user?.login}`)
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
                                <Link reloadDocument={false} to={item.url}
                                    className={`p-2 w-fit bg-slate-200 rounded-full 
                                    ${pathname.includes(item.url) &&
                                        "text-violet-600 hover:text-violet-600"}
                                    `}
                                >
                                    {item.icon}
                                </Link>
                            </Tooltip>
                        </li>
                    ))
                }

                {
                    user?.authorities?.includes("ROLE_ADMIN") && (
                        adminItems.map((item) =>
                            <li key={item.key} className="flex items-center">
                                <Tooltip placement="bottom" title={item.label}>
                                    <Link reloadDocument={false} to={item.url}
                                        className={`p-2 w-fit bg-slate-200 rounded-full 
                                ${pathname.includes(item.url) &&
                                            "text-violet-600 hover:text-violet-600"}
                                `}
                                    >
                                        {item.icon}
                                    </Link>
                                </Tooltip>
                            </li>
                        )
                    )
                }
                <li className="flex items-center relative">
                    <Dropdown trigger={["click"]} menu={{ items: notificationItems }}>
                        <a onClick={(e) => e.preventDefault()} className=" w-fit p-2 bg-slate-100 rounded-full">
                            <p className="absolute leading-none text-sm flex justify-center items-center -top-2 -right-1 rounded-full bg-red-500 w-5 h-5 text-white">
                                5
                            </p>
                            <BiBell size={28} />

                        </a>
                    </Dropdown>

                </li>
                <li className="ml-auto mr-0 flex items-center">
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()} className=" w-fit rounded-full">
                            <img src={user?.imageUrl} className="rounded-full w-[42px] h-[42px]" alt="" />
                        </a>
                    </Dropdown>
                </li>
            </ul>
        </Header>
    )
}