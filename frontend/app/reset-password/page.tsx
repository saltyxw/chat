"use client";

import { useState, useEffect } from "react";
import { requestPasswordReset } from "@/api/auth/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        setLoading(true);
        try {
            await requestPasswordReset(email);
            toast.success("The letter was sent");
            setEmail("");
            setCooldown(60);
        } catch {
            toast.error("Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-6 rounded-xl shadow w-80">
                <h2 className="text-xl mb-4 font-semibold text-center">Resetting password</h2>
                <input
                    type="email"
                    placeholder="Твій email"
                    className="w-full border px-3 py-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    disabled={loading || cooldown > 0}
                    className="w-full bg-violet-500 text-white py-2 rounded hover:bg-violet-600 disabled:opacity-50"
                >
                    {loading
                        ? "sENDING..."
                        : cooldown > 0
                            ? `Wait  ${cooldown}s`
                            : "Send the letter"}
                </button>
            </form>
        </div>
    );
}
