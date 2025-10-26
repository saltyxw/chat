"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/api/auth/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestPasswordReset(email);
            toast.success("The letter was sent");
            setEmail("");
        } catch {
            toast.error("Сталася помилка, спробуй ще раз");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-6 rounded-xl shadow w-80">
                <h2 className="text-xl mb-4 font-semibold text-center">Resset password</h2>
                <input
                    type="email"
                    placeholder="johndoe@mIL.COM"
                    className="w-full border px-3 py-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    disabled={loading}
                    className="w-full bg-violet-500 text-white py-2 rounded hover:bg-violet-600 disabled:opacity-50"
                >
                    {loading ? "Sending" : "Send letter"}
                </button>
            </form>
        </div>
    );
}
