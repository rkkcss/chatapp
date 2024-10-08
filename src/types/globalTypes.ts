
export type PublicUser = {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    imageUrl: string;
}

export type ChatMessage = {
    id?: number;
    user?: PublicUser,
    text?: string,
    mediaUrl?: string;
    createdAt?: string,
    chatRoom?: ChatRoom
}

export type ChatRoom = {
    id: number;
    lastMessage?: ChatMessage
    participants?: PublicUser[]
}

export type DefaultAvatarImage = {
    id: number,
    url: string,
    name: string,
    createdDate: string
}