import { unwrapResult, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Alert, Button, Divider, Form, Input } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { loginUser, User } from "../redux/userSlice";
import { UserStore } from "../store/store";
import { useNavigate } from "react-router";
import { APILogin } from "../utils/APILogin";
import { useEffect, useState } from "react";

export const Login = () => {

    const dispatch: ThunkDispatch<User, User, PayloadAction> = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const [loginError, setLoginError] = useState<string>("")

    const setCsrfCall = async () => {
        await APILogin.get("api/account");
    };

    useEffect(() => {
        setCsrfCall();
        if (user) {
            navigate("/chat");
        }
    }, [user]);

    const handleForm = (formData: User) => {
        console.log(formData);
        dispatch(loginUser(formData))
            .then(unwrapResult)
            .then((result) => {
                console.log("Success:", result);
            })
            .catch((error) => {
                setLoginError(error.message as string);
            });
    }

    return (
        <>
            <div className="w-screen min-h-[100dvh] h-[100dvh] bg-slate-100">
                <div className="flex items-center justify-center h-full">
                    <div className="w-[90vw] md:max-w-[80vw] lg:max-w-[680px] md:p-16 p-6 bg-neutral-50/40 shadow-lg rounded-2xl flex justify-center ">
                        <div className="min-w-full w-[489px]">
                            <div className="mb-16 text-center">
                                <h1 className="text-5xl font-medium text-slate-800">
                                    Log in to
                                </h1>
                                <p className="text-5xl bg-gradient-to-tr from-indigo-200 font-bold to-indigo-400 inline-block text-transparent bg-clip-text leading-relaxed">
                                    MessageMate
                                </p>
                            </div>
                            <div>
                                {
                                    loginError &&
                                    <Alert message={loginError} type="error" showIcon className="mb-2" />
                                }

                                <Form layout="vertical" onFinish={handleForm} onChange={() => setLoginError("")}>
                                    <Form.Item
                                        className="mb-6"
                                        label={<span className="text-sm font-medium text-slate-800">Username</span>}
                                        name="username"
                                        rules={[{ required: true, message: 'Please input your username!' }]}
                                    >
                                        <Input placeholder="Your username..." size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        className="mb-10"
                                        label={<span className="text-sm font-medium text-slate-800">Password</span>}
                                        name="password"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input placeholder="Your password" type="password" size="large" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button className="w-full" size="large" type="primary" htmlType="submit" onClick={setCsrfCall}>
                                            Continue
                                        </Button>
                                    </Form.Item>
                                </Form>
                                <Divider>or</Divider>
                                <Button className="w-full" size="large" type="default" onClick={() => navigate("/registration")}>Register</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}