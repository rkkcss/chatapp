import { createSlice } from '@reduxjs/toolkit';
import { User } from './userSlice';

export type WebSocketState = {
    activeUsers: User[];
};

const initialState: WebSocketState = {
    activeUsers: [],
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
    }
});

export const { setUsers, addUser, removeUser } = webSocketSlice.actions;
export default webSocketSlice.reducer;
