import { useSelector } from "react-redux"
import { UserStore } from "../store/store"
import { Outlet } from "react-router"
import { Logout } from "../pages/Logout";

export const ProtectedRoutes = () => {
    const { user } = useSelector((state: UserStore) => state.userStore);
    return user !== null ? <Outlet /> : <Logout />;
}