import { Outlet } from "react-router"
import { LayoutHeader } from "../components/LayoutHeader"
import useWebSocket from "../hooks/useWebSocket";

export const Layout = () => {
    const { connected } = useWebSocket();

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
                    : <p>Websocket Not Connected</p>
            }
        </>
    )
}