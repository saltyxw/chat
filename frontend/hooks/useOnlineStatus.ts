import { useEffect, useState } from "react";
import { getSocket } from "@/api/socket/socketClient";

export const useOnlineStatus = (messages: any[], currentUserId: number, socketReady: boolean) => {
    const [isPartnerOnline, setIsPartnerOnline] = useState<boolean | null>(null);
    const [partnerName, setPartnerName] = useState<string | null>(null);

    useEffect(() => {
        if (!socketReady) return;

        const socket = getSocket();

        const partner = messages.find(msg => msg.sender.id !== currentUserId);
        if (!partner) return;

        setPartnerName(partner.sender.name);

        const handleOnlineUsers = (users: { id: number; name: string }[]) => {
            const online = users.some(u => u.id === partner.sender.id);
            setIsPartnerOnline(online);
        };

        socket.on("onlineUsers", handleOnlineUsers);
        socket.emit("getOnlineUsers");

        return () => {
            socket.off("onlineUsers", handleOnlineUsers);
        };
    }, [messages, currentUserId, socketReady]);

    return { isPartnerOnline, partnerName };
};
