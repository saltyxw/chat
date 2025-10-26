"use client";

import { useParams, useRouter } from "next/navigation";
import { useChatSocket } from "@/api/socket/useChatSocket";
import { getSocket } from "@/api/socket/socketClient";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MessageType } from "@/types/message";
import { useUserStore } from "@/store/useUserStore";
import { ArrowLeft } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import SendMsgInput from "@/components/SendMsgInput";
import { emitChatMessage } from "@/api/socket/chatEmitters";
import { useChatScroll } from "@/hooks/useChatScroll";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function ChatPage() {
    const { chatId } = useParams();
    const router = useRouter();
    const { messages, setMessages, socketReady } = useChatSocket(chatId as string);
    const [newMessage, setNewMessage] = useState("");
    const { currentUserId } = useUserStore();
    const { isPartnerOnline, partnerName: onlinePartnerName } = useOnlineStatus(messages, currentUserId, socketReady);
    const {
        messageContainerRef,
        loadingMore,
        hasMore,
        scrollToBottom,
        resetScrollState
    } = useChatScroll(chatId as string, messages, setMessages, socketReady);

    const handleSend = () => {
        if (!socketReady || !newMessage.trim()) return;
        emitChatMessage(chatId as string, newMessage);
        setNewMessage("");
    };

    const isMyMessage = useCallback(
        (message: MessageType) => message.sender.id === currentUserId,
        [currentUserId]
    );

    useEffect(() => {
        if (!socketReady) return;

        const socket = getSocket();

        const handleChatMessage = (msg: MessageType) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });

            setTimeout(() => {
                const container = messageContainerRef.current;
                if (container) {
                    const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
                    if (isNearBottom) {
                        scrollToBottom();
                    }
                }
            }, 100);
        };

        const handleChatHistory = (msgs: MessageType[]) => {
            resetScrollState();
            setMessages(msgs);

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        };

        socket.on("chatMessage", handleChatMessage);
        socket.on("chatHistory", handleChatHistory);

        return () => {
            socket.off("chatMessage", handleChatMessage);
            socket.off("chatHistory", handleChatHistory);
        };
    }, [socketReady, setMessages, scrollToBottom, messageContainerRef, resetScrollState]);

    const chatPartnerName = useMemo(() => {
        if (messages.length === 0) return null;
        const firstMsg = messages.find((msg) => msg.sender.id !== currentUserId);
        return firstMsg?.sender.name || "Chat";
    }, [messages, currentUserId]);

    return (
        <div className="flex flex-col h-screen p-5 bg-gray-900">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => router.push("/chats")}
                    className="p-2 rounded-full hover:bg-gray-800 transition"
                >
                    <ArrowLeft className="text-white w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {onlinePartnerName || "Loading chat..."}
                    {isPartnerOnline !== null && (
                        <span
                            className={`w-3 h-3 rounded-full ${isPartnerOnline ? "bg-violet-700" : "bg-gray-500"
                                }`}
                        ></span>
                    )}
                </h1>
            </div>

            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto bg-gray-800 p-4 rounded shadow flex flex-col gap-3"
            >
                {loadingMore && (
                    <div className="text-center text-gray-300 py-2">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading older messages...
                    </div>
                )}

                {!hasMore && messages.length > 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        Beginning of chat history
                    </div>
                )}

                {messages.length === 0 && !loadingMore && (
                    <div className="text-center text-gray-400 py-4">
                        No messages yet
                    </div>
                )}

                {messages.map((msg) => {
                    const myMessage = isMyMessage(msg);
                    return (
                        <MessageCard key={msg.id} messageData={msg} isMyMessage={myMessage} />
                    );
                })}
            </div>

            <SendMsgInput
                value={newMessage}
                onChange={setNewMessage}
                onSend={handleSend}
                disabled={!socketReady || !newMessage.trim()}
            />

            {!socketReady && (
                <div className="text-center text-yellow-400 mt-2">Connecting to chat...</div>
            )}
        </div>
    );
}