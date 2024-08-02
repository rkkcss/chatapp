import { Outlet } from "react-router"
import { LayoutHeader } from "../components/LayoutHeader"
import { WebSocketContext } from "../contexts/WebSocketProvider"
import { Spin } from "antd";
import { useContext } from "react";


export const Layout = () => {
    // const { connected } = useWebSocket();
    const { connected } = useContext(WebSocketContext);
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