"use client";

import { useUserStore } from "@/store/useUserStore";
import { User } from "lucide-react";
import { logout } from "@/api/auth/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChangeCredentialsContent from "@/components/ChangeCredentialsContent";
import Modal from "@/components/Modal";

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) {
        return <h1 className="text-2xl font-semibold mb-2">Profile not found</h1>;
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
        setAccessToken("");
        router.replace("/auth");
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="flex flex-col items-center">
                    {user.avatarLink ? (
                        <img
                            src={user.avatarLink}
                            alt={user.name}
                            className="w-40 h-40 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-40 h-40 flex items-center justify-center bg-blue-100 text-violet-600 rounded-full">
                            <User className="w-20 h-20" />
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mt-3">{user.name}</h1>
                    <p className="text-gray-400">{user.email}</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 w-full bg-violet-600 hover:bg-violet-700 transition-colors py-2 rounded-lg font-semibold"
                >
                    Change credentials
                </button>

                <button
                    onClick={handleLogout}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 transition-colors py-2 rounded-lg font-semibold"
                >
                    Logout
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ChangeCredentialsContent />
            </Modal>
        </main>
    );
}
