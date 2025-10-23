import { getSocket } from "./socketClient";

export const emitChatMessage = (chatId: string, text: string) => {
    const socket = getSocket();
    socket.emit("chatMessage", { chatId, text });
};

export const emitLoadMoreMessages = (chatId: string, cursor: number) => {
    const socket = getSocket();
    socket.emit("loadMoreMessages", { chatId, cursor });
};
