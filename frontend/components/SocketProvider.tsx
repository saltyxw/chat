"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { MessageType } from "@/types/message";
import toast from "react-hot-toast";

interface SocketProviderProps {
    children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useGlobalSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUserId = useUserStore((state) => state.currentUserId);

    useEffect(() => {
        if (!accessToken) return;

        const s = io("http://localhost:4000", {
            transports: ["websocket"],
            auth: { token: accessToken },
        });

        setSocket(s);

        s.on("connect", () => console.log("Global socket connected:", s.id));
        s.on("disconnect", (reason) => console.log("Global socket disconnected:", reason));
        s.on("error", (err) => console.error("Socket error:", err));

        s.on("chatMessage", (msg: MessageType) => {
            if (msg.sender.id !== currentUserId) {
                toast(`${msg.sender.name}: ${msg.text}`, { icon: "💬" });
            }
        });

        return () => {
            s.disconnect();
            setSocket(null);
        };
    }, [accessToken, currentUserId]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
