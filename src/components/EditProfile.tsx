import { Form, Input } from "antd"
import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import { User } from "../redux/userSlice";
import { useState } from "react";

type EditProfileProps = {
    userProps: User | null,
}

export const EditProfile = ({ userProps }: EditProfileProps) => {
    const [user, setUser] = useState<User | null>(userProps);

    const handleFields = (e) => {
        console.log(e.target.value);
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    return (
        <Form layout="vertical">
            <Form.Item label="First name">
                <Input placeholder="First Name" name="firstName" value={user?.firstName} onChange={handleFields} />
            </Form.Item>

            <Form.Item label="Last name">
                <Input placeholder="Last Name" name="lastName" value={user?.lastName} onChange={handleFields} />
            </Form.Item>

            <Form.Item label="Felhasználónév">
                <Input placeholder="User name" name="login" value={user?.login} onChange={handleFields} />
            </Form.Item>

            <Form.Item label="E-mail">
                <Input placeholder="E-mail" name="email" value={user?.email} onChange={handleFields} />
            </Form.Item>
        </Form>
    )
}