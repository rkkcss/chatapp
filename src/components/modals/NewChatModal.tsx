import { Alert, Divider, Modal, notification, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { ChatRoom } from '../../types/globalTypes'
import { API } from '../../utils/API'
import { User } from '../../redux/userSlice'
import img from "../../assets/test.jpg"
import { IoIosWarning } from 'react-icons/io'
import { Link } from 'react-router-dom'

type NewChatProps = {
    isOpen: boolean,
    onClose: () => void,
}

export const NewChatModal = ({ isOpen, onClose }: NewChatProps) => {
    const [findUsers, setFindUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const [roomAlreadyExists, setRoomAlreadyExists] = useState<ChatRoom | null>(null)

    const findUsersHandler = (value: string) => {
        setFindUsers([]);
        if (value === "") return
        setTimeout(() => {
            API.get(`/api/find-users?query=${value}`).then(res => {
                console.log(res.data);
                setFindUsers(res.data);
            })
        }, 1000);
    }

    const onChangeHandler = (e: number[]) => {
        setSelectedUsers(e);
    }

    const handleCreateRoom = () => {
        console.log("create room");
        if (selectedUsers.length === 0) {
            notification.warning({ message: "Select at least one user.", placement: "bottom" })
            return
        }
        API.post("/api/chat-rooms/create", selectedUsers).then(res => {
            console.log(res);
        }).catch(err => {
            if (err.response.status === 302) {
                setRoomAlreadyExists(err.response.data);
            }
        });
    }

    useEffect(() => {
        if (!isOpen) {
            setFindUsers([]);
            setSelectedUsers([]);
            setRoomAlreadyExists(null);
        }
    }, [isOpen]);

    return (
        <Modal onCancel={onClose} open={isOpen} width="50vw" title="Create chat" onOk={handleCreateRoom} okText="Create room">
            <Alert
                message="You can search and create new chat rooms."
                type="info"
                showIcon
                className="mb-6"
            />

            <Select
                onSearch={findUsersHandler}
                mode="multiple"
                className="w-full"
                filterOption={false}
                onChange={e => onChangeHandler(e)}
                options={findUsers}
                value={selectedUsers}
                fieldNames={{ label: "firstName", value: "id" }}
            />
            {
                roomAlreadyExists &&
                <>
                    <Divider />
                    <div>
                        <Alert
                            message="We found a chat room with these parameters."
                            type="warning"
                            showIcon
                            icon={<IoIosWarning size={20} />}
                            className="my-4"
                        />
                        <Link to={`/chat/${roomAlreadyExists?.id}`} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer">
                            <img src={img} className="w-12 h-12 rounded-md" />
                            <div>
                                <p>Kis</p>
                            </div>
                            <div className="mr-0 ml-auto">
                                <p className="font-bold text-slate-800">{roomAlreadyExists?.participants?.length} members</p>
                            </div>
                        </Link>
                    </div>
                </>
            }

        </Modal>
    )
}