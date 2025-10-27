import { getSocket } from "./socketClient";

export const emitChatMessage = (
    chatId: string,
    text?: string,
    base64Data?: string,
    fileType?: "image" | "video"
) => {
    const socket = getSocket();

    const payload: any = { chatId };
    if (text) payload.text = text;

    if (base64Data && fileType) {
        payload.media = {
            data: base64Data,
            type: fileType,
        };
    }

    socket.emit("chatMessage", payload);
};



export const emitLoadMoreMessages = (chatId: string, cursor: number) => {
    const socket = getSocket();
    socket.emit("loadMoreMessages", { chatId, cursor });
};


export const emitEditMessage = (messageId: number, newText: string) => {
    const socket = getSocket();
    socket.emit('editMessage', { messageId, newText });
};

export const emitDeleteMessage = (messageId: number) => {
    const socket = getSocket();
    socket.emit('deleteMessage', { messageId });
};