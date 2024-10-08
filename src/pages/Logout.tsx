import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Navigate } from "react-router";
import { logoutUser } from "../redux/userSlice";
import { UserStore } from "../store/store";


export const Logout = () => {
    const dispatch: ThunkDispatch<void, void, PayloadAction> = useDispatch();
    const { user } = useSelector((state: UserStore) => state.userStore);

    useEffect(() => {
        dispatch(logoutUser());
    }, []);

    return user == null && <Navigate to={"/login"} />;
};