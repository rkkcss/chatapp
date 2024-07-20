import { Outlet } from "react-router"
import { LayoutHeader } from "../components/LayoutHeader"
import { useEffect } from "react";
import { connect, disconnect } from "../utils/WebSocket";
import { useDispatch, useSelector } from "react-redux";
import { UserStore } from "../store/store";

export const Layout = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: UserStore) => state.userStore)

    useEffect(() => {
        if (user?.id !== undefined) {
            connect(dispatch, user?.id);
        }

        return () => {
            // unsubscribe from the topic when the component unmounts
            disconnect()
        }
    }, [])

    return (
        <>
            <div>
                <LayoutHeader />
            </div>
            <Outlet />
        </>
    )
}