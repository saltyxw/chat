"use client";

import { useParams } from "next/navigation";
import { useChatSocket } from "@/api/socket/useChatSocket";
import { getSocket } from "@/api/socket/socketClient";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
    const { chatId } = useParams();
    const { messages, socketReady } = useChatSocket(chatId as string);
    const [newMessage, setNewMessage] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!socketReady || !newMessage.trim()) return;
        getSocket().emit("chatMessage", { chatId, text: newMessage });
        setNewMessage("");
    };

    useEffect(() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    return (
        <div className="flex flex-col h-screen p-5 bg-gray-800">
            <h1 className="text-2xl font-bold mb-4">Chat: {chatId}</h1>

            <div className="flex-1 overflow-y-auto bg-gray-600 p-4 rounded shadow">
                {messages.map((msg, idx) => (
                    <div key={`${msg.id}-${idx}`} className="mb-2 flex gap-2 items-start">
                        <div className="font-semibold">{msg.sender.name}:</div>
                        <div>{msg.text}</div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <div className="flex mt-4 gap-2">
                <input
                    type="text"
                    className="flex-1 p-2 rounded border border-gray-300"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send
                </button>
            </div>
        </div>
    );
}
