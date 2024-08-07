import { createContext, useCallback, useEffect, useState, ReactNode, useRef } from 'react';
import SockJS from 'sockjs-client';
import { over, Client, Message, Subscription } from 'webstomp-client';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../redux/webSocketSlice';
import { ChatMessage } from '../types/globalTypes';
import { UserStore } from '../store/store';
import { getAccountInfo } from '../redux/userSlice';

interface WebSocketContextType {
    sendMessage: (roomId: number, message: ChatMessage) => void;
    connected: boolean;
    subscribeToRoom: (roomId: number, messageHandler: (message: Message) => void) => void;
    unsubscribeFromRoom: (roomId: number) => void;
}

const defaultValue: WebSocketContextType = {
    sendMessage: () => { },
    connected: false,
    subscribeToRoom: () => { },
    unsubscribeFromRoom: () => { },
};

const WebSocketContext = createContext<WebSocketContextType>(defaultValue);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [connected, setConnected] = useState(false);
    const subscription = useRef<Subscription | null>(null);
    const client = useRef<Client | null>(null);
    const { user } = useSelector((state: UserStore) => state.userStore);
    const dispatch = useDispatch();

    const connect = useCallback(() => {
        if (connected) return;

        const socket = new SockJS("http://localhost:8080/ws/connect");
        const stompClient = over(socket);

        stompClient.connect({ "accept-version": "1.1,1.2" }, frame => {
            client.current = stompClient;
            console.log('WebSocket connected:', frame);

            stompClient.send('/app/ws/getusers');

            stompClient.subscribe('/topic/users', (message: Message) => {
                const users = JSON.parse(message.body);
                dispatch(setUsers(users));
                console.log("Users updated:", users);
            });

            stompClient.subscribe(`/user/${user?.id}/queue/notifications`, (message: Message) => {
                console.log(`Notification for user ${user?.id}: ${message.body}`);
                // Értesítések kezelése itt
            });
            setConnected(true)
        }, error => {
            console.error('WebSocket connection error:', error);
            setConnected(false);
            dispatch(getAccountInfo())
            // setInterval(() => {
            //     connect();
            // }, 5000)

        });

    }, [dispatch, user?.id]);


    useEffect(() => {
        connect();

        return () => {
            if (client.current?.connected) {
                client.current.disconnect(() => {
                    console.log('WebSocket disconnected');
                    setConnected(false);
                });
            }
        };
    }, []);

    const subscribeToRoom = useCallback((roomId: number, messageHandler: (message: Message) => void) => {
        if (subscription.current) {
            unsubscribeFromRoom();
        }
        if (connected) {
            const roomSub = client.current?.subscribe(`/topic/${roomId}`, messageHandler);
            if (roomSub) {
                subscription.current = roomSub;
            }
        } else {
            console.error('WebSocket is not connected');
        }
    }, [subscription, connected]);

    const unsubscribeFromRoom = useCallback(() => {
        if (subscription.current) {
            subscription.current.unsubscribe();
            console.log(`Unsubscribed from room: ${subscription.current?.id}`);
            subscription.current = null;
        }
    }, [subscription]);

    const sendMessage = useCallback((roomId: number, message: ChatMessage) => {
        if (client.current?.connected) {
            client.current.send(`/app/chat.sendMessage/${roomId}`, JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    return (
        <WebSocketContext.Provider value={{ sendMessage, connected, subscribeToRoom, unsubscribeFromRoom }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketContext };
