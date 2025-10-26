"use client"

import { User } from "lucide-react"
import { createOrGetPrivateChat } from "@/api/chat/chat"
import { useRouter } from "next/navigation"

interface UserCardProps {
    avatarLink?: string
    name: string
    userId: number
}

export default function UserCard({ chatId, avatarLink, name, userId }: UserCardProps) {
    const router = useRouter()

    const handleWrite = async (userId: number) => {
        try {
            const chat = await createOrGetPrivateChat(userId);
            router.push(`/chats/private/${chatId}`);
        } catch (err) {
            console.error("Failed to start chat", err);
        }
    };
    return (
        <div
            className="flex items-center justify-between gap-4 bg-neutral-900 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 rounded-xl border border-violet-400 cursor-pointer hover:bg-neutral-700"
        >
            {avatarLink ? (
                <img
                    src={avatarLink}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
            ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-violet-600 rounded-full">
                    <User className="w-6 h-6" />
                </div>
            )}

            <div>
                <h2 className=" font-medium text-lg">
                    {name}
                </h2>
            </div>
            <button
                onClick={() => handleWrite(userId)}
                className="bg-violet-900 text-white px-3 py-1 rounded hover:bg-blue-800"
            >
                Write
            </button>
        </div>
    )
}