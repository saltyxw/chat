"use client";

import { getChatPartners } from "@/api/chat/chat";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import UserCard from "@/components/UserCard";

export default function Page() {
    const accessToken = useAuthStore((state) => state.accessToken);

    const { data, isLoading, error } = useQuery({
        queryKey: ["chat_partners"],
        queryFn: getChatPartners,
        enabled: !!accessToken,
    });
    console.log(data)

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                <p className="ml-3 text-blue-600 font-medium">Loading contacts...</p>
            </div>
        );

    if (error)
        return (
            <p>Error loading contacts</p>

        );

    return (
        <main className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4 ">Your contacts</h1>

            {data && data.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((contact: any) => (
                        <UserCard key={contact.partner.id} userId={contact.partner.id} avatarLink={contact.partner.avatarLink} name={contact.partner?.name}></UserCard>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-12 text-lg">
                    No contacts yet
                </p>
            )}
        </main>


    );
}