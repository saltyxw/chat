"use client";

import { useState } from "react";
import { changePassword } from "@/api/auth/auth";
import { changeUsername } from "@/api/user/user";

export default function ChangeCredentialsContent() {
    const [mode, setMode] = useState<"name" | "password">("name");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        newName: "",
        currentPassword: "",
        newPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (mode === "name") {
                await changeUsername(form.newName);
                setMessage(" Name successfully updated");
            } else {
                await changePassword(form.currentPassword, form.newPassword);
                setMessage(" Password successfully updated");
            }
        } catch (err: any) {
            setMessage(err.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Change Credentials</h2>

            <div className="flex justify-center mb-4 space-x-3">
                <button
                    className={`px-4 py-2 rounded-lg ${mode === "name" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                    onClick={() => setMode("name")}
                >
                    Change Name
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${mode === "password" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                    onClick={() => setMode("password")}
                >
                    Change Password
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {mode === "name" ? (
                    <input
                        type="text"
                        placeholder="Enter new name"
                        className="p-2 rounded bg-gray-700 focus:outline-none"
                        value={form.newName}
                        onChange={(e) => setForm({ ...form, newName: e.target.value })}
                        required
                    />
                ) : (
                    <>
                        <input
                            type="password"
                            placeholder="Current password"
                            className="p-2 rounded bg-gray-700 focus:outline-none"
                            value={form.currentPassword}
                            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            className="p-2 rounded bg-gray-700 focus:outline-none"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            required
                        />
                    </>
                )}

                <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 py-2 rounded-lg font-semibold"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {message && (
                <p className="mt-3 text-center text-sm text-gray-300">{message}</p>
            )}
        </div>
    );
}
