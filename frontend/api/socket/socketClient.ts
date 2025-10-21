import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    const token = useAuthStore.getState().accessToken;
    if (!socket) {
        socket = io("http://localhost:4000", {
            transports: ["websocket"],
            auth: { token },
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
