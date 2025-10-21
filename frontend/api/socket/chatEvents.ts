import { Socket } from "socket.io-client";
import { MessageType } from "@/types/message";

export const registerChatHandlers = (
    socket: Socket,
    chatId: string,
    setMessages: (updater: (prev: MessageType[]) => MessageType[]) => void
) => {
    socket.on("connect", () => {
        console.log("Connected to chat server, socket id:", socket.id);
        socket.emit("joinChat", { chatId });
    });

    socket.on("joinedChat", (id) => console.log("Joined chat:", id));

    socket.on("chatHistory", (msgs: MessageType[]) => {
        console.log("Received chat history:", msgs);
        setMessages(() => msgs);
    });

    socket.on("chatMessage", (msg: MessageType) => {
        console.log("Received new message:", msg);
        setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
        });
    });

    socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    socket.on("error", (err) => console.error("Socket error:", err));
};
