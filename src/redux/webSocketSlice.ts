import { createSlice } from '@reduxjs/toolkit';

const webSocketSlice = createSlice({
    name: 'activeUsers',
    initialState: {
        activeUsers: [],
        socket: {}
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
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    }
});

export const { setUsers, addUser, removeUser, setSocket } = webSocketSlice.actions;
export default webSocketSlice.reducer;