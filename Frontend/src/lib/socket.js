import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

// Connect and join user room
export function connectSocket(userId) {
    if (!socket.connected) {
        socket.connect();
    }
    if (userId) {
        socket.emit("join", userId);
    }
}

// Disconnect socket
export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export default socket;
