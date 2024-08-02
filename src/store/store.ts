import { configureStore } from '@reduxjs/toolkit';
import loginSliceReducer from '../redux/userSlice';
import webSocketSliceReducer from '../redux/webSocketSlice';
import generalSliceReducer from '../redux/generalSlice';
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

const generalPersistConfig = {
    key: 'general',
    storage,
    blacklist: ['error'],
};

const persistedLoginReducer = persistReducer(loginPersistConfig, loginSliceReducer);
const persistedWebSocketReducer = persistReducer(webSocketPersistConfig, webSocketSliceReducer);
const persistedGeneralReducer = persistReducer(generalPersistConfig, generalSliceReducer);

const store = configureStore({
    reducer: {
        userStore: persistedLoginReducer,
        webSocketStore: persistedWebSocketReducer,
        generalStore: persistedGeneralReducer
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
export type GeneralStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
