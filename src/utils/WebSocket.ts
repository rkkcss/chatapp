import SockJS from 'sockjs-client';
import { over, Client, Message } from 'webstomp-client';
import { User } from '../redux/userSlice';
import { setUsers } from '../redux/webSocketSlice';
import { Dispatch } from '@reduxjs/toolkit';


let stompClient: Client | null = null;

const subscriptions: { [roomId: string]: any } = {};

/**
 * Establishes a WebSocket connection to the specified server and subscribes to a user list topic.
 *
 * @param dispatch - The Redux dispatch function to update the Redux store with the received user list.
 *
 * @returns {Promise<Client>} - A Promise that resolves with the connected Stomp client when the connection is established.
 *
 * @throws {Error} - Throws an error if the WebSocket is already connected.
 *
 * @remarks
 * This function initializes a new Stomp client using the provided `dispatch` function. It connects to the WebSocket server at
 * "http://localhost:8080/ws/connect" and subscribes to the "/topic/users" topic to receive a list of users.
 *
 * If the connection is successful, the function resolves with the connected Stomp client. If an error occurs during the connection,
 * the function rejects with the error.
 *
 * The function logs the WebSocket connection status and received user list to the console.
 */
export function connect(dispatch: Dispatch, userId: number): Promise<Client> {
  if (stompClient && stompClient.connected) {
    return Promise.resolve(stompClient);
  }

  return new Promise((resolve, reject) => {
    const socket = new SockJS("http://localhost:8080/ws/connect");
    stompClient = over(socket);

    stompClient.connect({}, (frame) => {
      console.log("WebSocket connected:", frame);
      resolve(stompClient!);

      getAllActiveUsers(dispatch);

      stompClient!.send("/ws/getusers");

      // Subscribe to the user's notifications
      subscribeToNotifications(userId);
    }, (error) => {
      console.log("WebSocket error:", error);
      reject(error);
    });
  });
}

export function subscribeToRoom(roomId: string, messageHandler: (message: Message) => void) {
  if (stompClient && stompClient.connected) {
    const subscription = stompClient.subscribe(`/topic/${roomId}`, messageHandler);
    subscriptions[roomId] = subscription;
    console.log(`Subscribed to room asd ${roomId}`);
  }
}

export function unsubscribeFromRoom(roomId: number) {
  if (subscriptions[roomId]) {
    subscriptions[roomId].unsubscribe();
    delete subscriptions[roomId];
    console.log(`Unsubscribed from room ${roomId}`);
  }
}

export function sendMessage(roomId: number, message: any) {
  if (!stompClient || !stompClient.connected) {
    throw new Error("WebSocket not connected");
  }
  stompClient.send(`/app/chat.sendMessage/${roomId}`, JSON.stringify(message));
}


export function getAllActiveUsers(dispatch: Dispatch) {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe("/topic/users", (message: Message) => {
      const users: User[] = JSON.parse(message.body);
      dispatch(setUsers(users))
    });
  }
}

/**
 * Disconnects the WebSocket connection if it is currently connected.
 *
 * This function checks if the `stompClient` is defined and connected. If so, it calls the `disconnect` method on the client,
 * logs a message indicating the disconnection, and sets the `stompClient` to `null`. If the WebSocket is not connected,
 * it logs a message indicating that the WebSocket is not currently connected.
 *
 * @returns {void}
 */
export function disconnect() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log("WebSocket disconnected");
    });
    stompClient = null;
  } else {
    console.log("WebSocket is not connected");
  }
}

export function subscribeToNotifications(userId: number) {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: Message) => {
      const notification = message.body;
      console.log("itt vagyunk????");
      // Handle notification (e.g., show toast or browser notification)
      console.log(`Notification for user ${userId}: ${notification}`);
    });
  }
}