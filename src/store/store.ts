// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import loginSliceReducer from '../redux/userSlice';
import webSocketSliceReducer from '../redux/webSocketSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const loginPersistConfig = {
    key: 'login',
    storage,
    blacklist: ['error'],
};

const webSocketPersistConfig = {
    key: 'webSocket',
    storage,
    blacklist: ['error'],
};

const persistedLoginReducer = persistReducer(loginPersistConfig, loginSliceReducer);
const persistedWebSocketReducer = persistReducer(webSocketPersistConfig, webSocketSliceReducer);

const store = configureStore({
    reducer: {
        userStore: persistedLoginReducer,
        webSocketStore: persistedWebSocketReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { persistor };
export default store;

export type UserStore = ReturnType<typeof store.getState>;
export type WebSocketStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
