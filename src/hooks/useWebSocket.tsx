import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over, Client, Message, Subscription } from 'webstomp-client';
import { ChatMessage } from '../types/globalTypes';
import { UserStore } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../redux/webSocketSlice';

const useWebSocket = () => {
    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const { user } = useSelector((state: UserStore) => state.userStore);
    const dispatch = useDispatch();
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws/connect');
        const client: Client = over(socket);


        client.connect({}, frame => {
            console.log('WebSocket connected:', frame);
            setStompClient(client);
            setConnected(true);

            client.send('/app/ws/getusers');

            client.subscribe('/topic/users', (message: Message) => {
                const users = JSON.parse(message.body);
                dispatch(setUsers(users));
                console.log("Users updated:", users);
            });

            client.subscribe(`/user/${user?.id}/queue/notifications`, (message: Message) => {
                console.log(`Notification for user ${user?.id}: ${message.body}`);
                // Értesítések kezelése itt
            });
        }, error => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (stompClient?.connected) {
                stompClient.disconnect(() => {
                    console.log('WebSocket disconnected');
                    setConnected(false);
                });
            }
        };
    }, [dispatch]);

    const subscribeToRoom = (roomId: number, messageHandler: (message: Message) => void) => {
        if (subscription) {
            unsubscribeFromRoom();
        }
        if (connected) {
            const roomSub = stompClient?.subscribe(`/topic/${roomId}`, messageHandler);
            if (roomSub) {
                setSubscription(roomSub);
            }
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const sendMessage = (roomId: number, message: ChatMessage) => {
        if (stompClient?.connected) {
            stompClient.send(`/app/chat.sendMessage/${roomId}`, JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const unsubscribeFromRoom = () => {
        if (subscription) {
            subscription.unsubscribe();
            setSubscription(null);
            console.log(`Unsubscribed from room: ${subscription.id}`);
        }
    };

    return { sendMessage, connected, subscribeToRoom, unsubscribeFromRoom };
};

export default useWebSocket;
