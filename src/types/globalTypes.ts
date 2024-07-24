
export type PublicUser = {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
}

export type ChatMessage = {
    id?: number;
    user?: PublicUser,
    text?: string,
    createdAt?: string,
    chatRoom?: ChatRoom
}

export type ChatRoom = {
    id: number;
    lastMessage?: ChatMessage
    participants?: PublicUser[]
}