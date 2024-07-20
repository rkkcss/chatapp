import { createSlice } from '@reduxjs/toolkit';

const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState: {
        activeUsers: [],
        connected: false,
    },
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
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
    }
});

export const { setUsers, addUser, removeUser, setConnected } = webSocketSlice.actions;
export default webSocketSlice.reducer;