import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Navigate } from "react-router";
import { logoutUser } from "../redux/userSlice";


export const Logout = () => {
    const dispatch: ThunkDispatch<void, void, PayloadAction> = useDispatch();

    useEffect(() => {
        dispatch(logoutUser());
    }, []);

    return <Navigate to={"/login"} />;
};