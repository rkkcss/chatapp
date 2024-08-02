import { createSlice } from '@reduxjs/toolkit';

export type GeneralState = {
    chatRigthSideOpen: boolean;
};

const initialState: GeneralState = {
    chatRigthSideOpen: false,
};

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        toggleChatRightSide: (state, action) => {
            state.chatRigthSideOpen = action.payload;
        },
    }
});

export const { toggleChatRightSide } = generalSlice.actions;
export default generalSlice.reducer;
