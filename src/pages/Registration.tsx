import { Button, Divider, Form, Input } from "antd"
import { useNavigate } from "react-router"
import { API } from "../utils/API";
import { User } from "../redux/userSlice";

export const Registration = () => {
    const navigate = useNavigate();

    const handleForm = (data: User) => {
        API.post("/api/register", data).then((res) => {
            console.log("res", res);
        });
    }

    return (
        <div className="w-screen h-screen bg-slate-100">
            <div className="flex items-center justify-center h-full">
                <div className="w-[70vw] lg:max-w-[1024px] p-16 bg-neutral-50/40 shadow-lg rounded-2xl flex justify-center ">
                    <div className="w-[489px]">
                        <div className="mb-16 text-center">
                            <h1 className="text-5xl font-medium text-slate-800">
                                Register to
                            </h1>
                            <p className="text-5xl bg-gradient-to-tr from-indigo-200 font-bold to-indigo-400 inline-block text-transparent bg-clip-text leading-relaxed">
                                MessageMate
                            </p>
                        </div>
                        <div>
                            <Form layout="vertical" onFinish={handleForm}>
                                <Form.Item
                                    className="mb-6"
                                    label={<span className="text-sm font-medium text-slate-800">Username</span>}
                                    name="login"
                                    rules={[
                                        { required: true, message: 'Please input your username!' },
                                        { min: 5, message: 'Please enter at least 5 characters' }
                                    ]}
                                >
                                    <Input placeholder="Your username..." size="large" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-6"
                                    label={<span className="text-sm font-medium text-slate-800">E-mail</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input your e-mail!' },
                                    ]}
                                >
                                    <Input placeholder="Your e-mail..." size="large" type="email" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-6"
                                    label={<span className="text-sm font-medium text-slate-800">First name</span>}
                                    name="firstName"
                                    rules={[{ required: true, message: 'Please input your first name!' }]}
                                >
                                    <Input placeholder="Your first name..." size="large" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-6"
                                    label={<span className="text-sm font-medium text-slate-800">Last name</span>}
                                    name="lastName"
                                    rules={[{ required: true, message: 'Please input your lastname!' }]}
                                >
                                    <Input placeholder="Your last name..." size="large" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-10"
                                    label={<span className="text-sm font-medium text-slate-800">Password</span>}
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please input your password!' },
                                        { min: 6, message: 'Please enter at least 6 characters!' },
                                        { max: 100, message: 'Please enter at most 100 characters!' }
                                    ]}
                                >
                                    <Input placeholder="Your password" type="password" size="large" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-10"
                                    label={<span className="text-sm font-medium text-slate-800">Password again</span>}
                                    name="passwordAgain"
                                    dependencies={['password']}
                                    rules={[{ required: true, message: 'Please input your password again!', min: 6, max: 100, },
                                    { min: 6, message: 'Please enter at least 6 characters!' },
                                    { max: 100, message: 'Please enter at most 100 characters!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password that you entered do not match!'));
                                        },
                                    })]}
                                >
                                    <Input placeholder="Your password again..." type="password" size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button className="w-full" size="large" type="primary" htmlType="submit" >
                                        Registration
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Divider>or</Divider>
                            <Button className="w-full" size="large" type="default" onClick={() => navigate("/login")}>Log in</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}