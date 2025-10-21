"use client";

import { useEffect, useState } from "react";
import { MessageType } from "@/types/message";
import { getSocket, disconnectSocket } from "@/api/socket/socketClient";
import { registerChatHandlers } from "@/api/socket/chatEvents";
import { initAuth } from "@/hooks/useInitAuth";

export const useChatSocket = (chatId: string) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        const connect = async () => {
            await initAuth();
            const socket = getSocket();
            registerChatHandlers(socket, chatId, setMessages);
            setSocketReady(true);
        };

        connect();

        return () => disconnectSocket();
    }, [chatId]);

    return { messages, setMessages, socketReady };
};
