"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { getUserChats } from "@/api/chat/chat";
import { Suspense } from "react";

const ChatPageWrapper = dynamic(
    () => import("./private/[chatId]/page"),
    { ssr: false }
);


function ChatsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedChatId = searchParams.get("chatId");
    const partnerName = searchParams.get("partnerName");
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUserId = useUserStore((state) => state.currentUserId);

    const { data: chats, isPending, error } = useQuery({
        queryKey: ["user-chats"],
        queryFn: getUserChats,
        enabled: !!accessToken,
    });

    if (!accessToken) return null;
    if (isPending) return <p>Loading chats...</p>;
    if (error) return <p>Failed to load chats</p>;

    const getChatPartnerName = (chat: any) => {
        if (!chat.users || !currentUserId) return "Unknown User";
        const partner = chat.users.find((u: any) => u.userId !== currentUserId);
        return partner?.user?.name || "Unknown User";
    };

    const getLastMessage = (chat: any) => {
        if (!chat.messages?.length) return "No messages yet";
        return chat.messages[chat.messages.length - 1]?.text || "No messages yet";
    };

    return (
        <main className="flex min-h-screen bg-gray-900 text-white">
            <aside className="w-1/3 bg-indigo-950 border-r border-gray-800">
                <h2 className="text-3xl text-center py-5 font-semibold">Your chats</h2>
                {chats?.length ? (
                    chats.map((chat: any) => {
                        const partnerName = getChatPartnerName(chat);
                        const lastMessage = getLastMessage(chat);
                        const isActive = selectedChatId === chat.chatId;

                        return (
                            <div
                                key={chat.id}
                                onClick={() =>
                                    router.push(
                                        `/chats?chatId=${chat.chatId}&partnerName=${encodeURIComponent(partnerName)}`
                                    )
                                }
                                className={`px-4 py-3 border-b border-gray-800 cursor-pointer transition ${isActive ? "bg-indigo-700" : "hover:bg-indigo-800"
                                    }`}
                            >
                                <p className="font-semibold">{partnerName}</p>
                                <p className="text-gray-400 text-sm truncate">{lastMessage}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-400 mt-4">No chats</p>
                )}
            </aside>

            <section className="flex-1">
                {selectedChatId ? (
                    <ChatPageWrapper chatId={selectedChatId} initialPartnerName={partnerName || ""} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </section>
        </main>
    );
}

export default function ChatsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>}>
            <ChatsContent />
        </Suspense>
    );
}