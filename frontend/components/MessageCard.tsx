"use client";
import { useState, useEffect } from "react";
import { MessageType } from "@/types/message";
import { Edit2, Trash2, Check, X, XCircle } from "lucide-react";
import { emitEditMessage, emitDeleteMessage } from "@/api/socket/chatEmitters";

export default function MessageCard({
    messageData,
    isMyMessage,
}: {
    messageData: MessageType;
    isMyMessage: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(messageData.text || "");
    const [fullScreenMedia, setFullScreenMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

    const handleEditSave = () => {
        if (editText.trim() && editText !== messageData.text) {
            emitEditMessage(messageData.id, editText);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFullScreenMedia(null);
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, []);

    const openFullScreen = (url: string, type: "image" | "video") => {
        setFullScreenMedia(url);
        setMediaType(type);
    };

    const closeFullScreen = () => {
        setFullScreenMedia(null);
        setMediaType(null);
    };

    return (
        <>
            <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                <div
                    className={`relative p-3 rounded-2xl max-w-[80%] break-words ${isMyMessage
                        ? "bg-violet-600 text-white rounded-br-none"
                        : "bg-gray-600 text-white rounded-bl-none"
                        }`}
                >
                    {isMyMessage && !isEditing && (
                        <div className="flex flex-row-reverse gap-2 opacity-70 hover:opacity-100  ">
                            <Edit2
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            />
                            <Trash2
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => emitDeleteMessage(messageData.id)}
                            />
                        </div>
                    )}

                    {!isMyMessage && (
                        <div className="font-semibold text-blue-300 mb-1 text-sm">
                            {messageData.sender.name}
                        </div>
                    )}

                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                className="bg-gray-700 text-white rounded px-2 py-1 flex-1 outline-none"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                            <Check
                                onClick={handleEditSave}
                                className="cursor-pointer w-5 h-5 text-green-400"
                            />
                            <X
                                onClick={() => setIsEditing(false)}
                                className="cursor-pointer w-5 h-5 text-red-400"
                            />
                        </div>
                    ) : (
                        <>
                            {messageData.text && <p>{messageData.text}</p>}
                            {messageData.image && (
                                <img
                                    src={messageData.image}
                                    alt="sent"
                                    className="rounded mt-2 max-h-60 cursor-pointer hover:opacity-80 transition"
                                    onClick={() => openFullScreen(messageData.image!, "image")}
                                />
                            )}
                            {messageData.video && (
                                <video
                                    controls
                                    src={messageData.video}
                                    className="rounded mt-2 max-h-60 cursor-pointer hover:opacity-80 transition"
                                    onClick={() => openFullScreen(messageData.video!, "video")}
                                />
                            )}
                        </>
                    )}

                    <div
                        className={`text-xs mt-1 ${isMyMessage ? "text-blue-200" : "text-gray-400"
                            } text-right`}
                    >
                        {new Date(messageData.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>

            {fullScreenMedia && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                    onClick={closeFullScreen}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gray-300"
                        onClick={closeFullScreen}
                    >
                        <XCircle className="w-8 h-8" />
                    </button>

                    {mediaType === "image" ? (
                        <img
                            src={fullScreenMedia}
                            alt="fullscreen"
                            className="max-h-[90%] max-w-[90%] rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <video
                            src={fullScreenMedia}
                            controls
                            autoPlay
                            className="max-h-[90%] max-w-[90%] rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}
        </>
    );


}