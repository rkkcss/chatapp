import { createSlice } from '@reduxjs/toolkit';
import { User } from './userSlice';
import { ChatRoom } from '../types/globalTypes';

export type WebSocketState = {
    activeUsers: User[];
    selectedRoom: ChatRoom | null
};

const initialState: WebSocketState = {
    activeUsers: [],
    selectedRoom: null,
};

const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.activeUsers = action.payload;
        },
        addUser: (state, action) => {
            state.activeUsers.push(action.payload);
        },
        removeUser: (state, action) => {
            state.activeUsers = state.activeUsers.filter(user => user !== action.payload);
        },
        setRoom: (state, action) => {
            state.selectedRoom = action.payload;
        }
    }
});

export const { setUsers, addUser, removeUser, setRoom } = webSocketSlice.actions;
export default webSocketSlice.reducer;
