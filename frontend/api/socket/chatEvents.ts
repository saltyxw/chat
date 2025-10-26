import { Socket } from "socket.io-client";
import { MessageType } from "@/types/message";
import toast from "react-hot-toast";

export const registerChatHandlers = (
    socket: Socket,
    chatId: string,
    setMessages: (updater: (prev: MessageType[]) => MessageType[]) => void,
    currentUserId: number
) => {
    socket.on("connect", () => {
        console.log("Connected to chat server, socket id:", socket.id);
        socket.emit("joinChat", { chatId });
    });

    socket.on("joinedChat", (id) => console.log("Joined chat:", id));

    socket.on("chatHistory", (msgs: MessageType[]) => {
        setMessages(() => msgs);
    });


    socket.on("chatMessage", (msg: MessageType) => {
        setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
        });

        if (msg.sender.id !== currentUserId) {
            toast(`${msg.sender.name}: ${msg.text}`, { icon: '💬' });
        }
    });

    socket.on("moreMessages", (olderMsgs: MessageType[]) => {
        setMessages((prev) => [...olderMsgs, ...prev]);
    });

    socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    socket.on("error", (err) => console.error("Socket error:", err));
};
