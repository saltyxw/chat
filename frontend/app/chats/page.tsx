"use client"
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserChats } from "@/api/chat/chat";


export default function Page() {
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);
    const { data: chats, isPending, error } = useQuery({
        queryKey: ["user-chats"],
        queryFn: getUserChats,
        enabled: !!accessToken,
    });

    if (isPending) return <p>Loading chats...</p>;
    if (error) return <p>Failed to load chats</p>;

    return (
        <main className="relative">
            <aside className="fixed min-h-screen bg-indigo-950 z-100 max-w-2/9 w-full">
                <h2 className="text-4xl text-center p-5">Your chats</h2>

                {chats?.length ? (
                    chats.map((chat: any) => {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const otherUser = chat.users.find(
                            (u: any) => u.userId !== chat.currentUserId
                        )?.user;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => router.push(`/chats/private/${chat.chatId}`)}
                                className="bg-indigo-800 border-b border-black py-3 hover:bg-indigo-600 px-4 cursor-pointer transition"
                            >
                                <p className="font-semibold">{chat.name ?? otherUser?.name ?? "Direct Chat"}</p>
                                <p className="text-gray-400 text-sm">
                                    {lastMessage?.text ?? "No messages yet"}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-400 mt-4">No chats yet</p>
                )}

            </aside>
        </main>
    );
}
