import { BsThreeDots } from "react-icons/bs"
import img from "../assets/test.jpg"
import { Button, Dropdown, MenuProps } from "antd"

export const ChatHeader = () => {

    const items: MenuProps['items'] = [
        {
            label: <a href="https://www.antgroup.com">1st menu item</a>,
            key: '0',
        },
        {
            label: <a href="https://www.aliyun.com">2nd menu item</a>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    return (
        <div className="flex items-center backdrop-filter backdrop-blur-lg bg-white/40 p-4 shadow-sm">
            <img src={img} alt="img" className="w-14 h-14 rounded-md" />
            <div className="ml-3">
                <p className="font-bold text-slate-800">{ }</p>
                <p className="text-xs text-green-500 ">Active</p>
            </div>

            <div className="mr-0 ml-auto">
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button type="default" icon={<BsThreeDots />} onClick={(e) => e.preventDefault()}></Button>
                </Dropdown>
            </div>
        </div>
    )
}