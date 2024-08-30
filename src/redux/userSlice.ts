import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../utils/API";
import { APILogin } from "../utils/APILogin";


export type User = {
    id?: number;
    login?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string | "";
    activated?: boolean;
    langKey?: string;
    createdDate?: Date;
    authorities?: [string];
};

export type State = {
    user: User | null;
    loading: boolean;
    error: boolean;
    msg: string | null;
    theme: string;
};

const initialState: State = {
    user: null,
    loading: false,
    error: false,
    msg: "",
    theme: "light",
};

export const getAccountInfo = createAsyncThunk<User>(
    "getAccountInfo",
    async () => {
        const response = await API.get<User>("/api/account");
        return response.data;
    }
);

export const loginUser = createAsyncThunk<User, User>(
    'loginUser',
    async (user: User, { dispatch }) => {
        // Az API hívás a felhasználó bejelentkezéséhez
        await APILogin.post('/api/authentication', user);

        // Dispatch a további akciókat
        dispatch(getAccountInfo());

        // Visszaadja a felhasználói adatokat
        return user;
    }
);

export const logoutUser = createAsyncThunk("logoutUser", async () => {
    await API.post("/api/logout");
});

export const updateUserApi = createAsyncThunk<User, User>(
    "updateUser",
    async (user: User) => {
        await API.post("/api/account", user);
        return user;
    }
);

const loginSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        loadingTrue(state) {
            state.loading = true;
        },
        loadingFalse(state) {
            state.loading = false;
        },
        toggleTheme(state, action: PayloadAction<string>) {
            state.theme = action.payload;
        },
        setImageUrl(state, action: PayloadAction<string>) {
            state.user = ({ ...state.user, imageUrl: action.payload })
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
                state.msg = "";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.msg = String(action.error.message);
            })
            .addCase(getAccountInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccountInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getAccountInfo.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state: State) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(updateUserApi.rejected, (state: State) => {
                console.log("updateerror", state);
            });
    },
});

export const { loadingTrue, loadingFalse, toggleTheme, setImageUrl } = loginSlice.actions;

export default loginSlice.reducer;