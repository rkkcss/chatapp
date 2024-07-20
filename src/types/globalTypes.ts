
export type PublicUser = {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
}

export type Message = {
    id?: number;
    user?: PublicUser,
    text?: string,
    createdAt?: string
}

export type ChatRoom = {
    id: number;
    lastMessage?: Message
    participants?: PublicUser[]
}