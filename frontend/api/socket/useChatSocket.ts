"use client";

import { useEffect, useState } from "react";
import { MessageType } from "@/types/message";
import { getSocket, disconnectSocket } from "@/api/socket/socketClient";
import { registerChatHandlers } from "@/api/socket/chatEvents";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";


export const useChatSocket = (chatId: string) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socketReady, setSocketReady] = useState(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUserId = useUserStore((state) => state.currentUserId);

    useEffect(() => {
        if (!accessToken) return

        const connect = async () => {

            const socket = getSocket();
            registerChatHandlers(socket, chatId, setMessages, currentUserId);
            setSocketReady(true);
        };

        connect();

        return () => disconnectSocket();
    }, [chatId, accessToken]);

    return { messages, setMessages, socketReady };
};
