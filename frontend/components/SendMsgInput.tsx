"use client";

import { useState } from "react";
import { emitChatMessage } from "@/api/socket/chatEmitters";
import toast from "react-hot-toast";
import { Image, Send, Paperclip } from "lucide-react";

export default function SendMsgInput({
    value,
    onChange,
    onSend,
    disabled,
    chatId,
}: {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled: boolean;
    chatId: string;
}) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isVideo = file.type.startsWith("video");
        const fileType = isVideo ? "video" : "image";

        setUploading(true);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                emitChatMessage(chatId, undefined, base64data, fileType);
                toast.success(`${isVideo ? "Video" : "Image"} sent successfully!`);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Failed to send file.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };


    return (
        <div className="flex mt-4 gap-2 items-center">
            <label
                htmlFor="fileInput"
                className={`p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                <Paperclip className="text-white w-5 h-5" />
            </label>
            <input
                id="fileInput"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
            />

            <input
                type="text"
                className="flex-1 p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                value={value}
                placeholder="Type a message..."
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                disabled={uploading}
            />

            <button
                onClick={onSend}
                disabled={disabled || uploading}
                className="bg-violet-600 text-white px-5 py-3 rounded-lg hover:bg-violet-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <Send className="w-4 h-4" />
                Send
            </button>
        </div>
    );
}
