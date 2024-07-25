import { Outlet } from "react-router"
import { LayoutHeader } from "../components/LayoutHeader"
import useWebSocket from "../hooks/useWebSocket";
import { Spin } from "antd";

export const Layout = () => {
    const { connected } = useWebSocket();

    const reconnect = () => {

    }

    return (
        <>
            {
                connected ?
                    <>
                        <div>
                            <LayoutHeader />
                        </div>
                        <Outlet />
                    </>
                    :
                    <Spin fullscreen />
            }
        </>
    )
}