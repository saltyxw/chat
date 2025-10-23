import { MessageType } from "@/types/message";




export default function MessageCard({
    messageData,
    isMyMessage,
}: {
    messageData: MessageType;
    isMyMessage: boolean;
}) {
    return (
        <div
            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`p-3 rounded-2xl max-w-[80%] break-words ${isMyMessage
                    ? "bg-violet-600 text-white rounded-br-none"
                    : "bg-gray-600 text-white rounded-bl-none"
                    }`}
            >
                {!isMyMessage && (
                    <div className="font-semibold text-blue-300 mb-1 text-sm">
                        {messageData.sender.name}
                    </div>
                )}
                <div className="text-white">{messageData.text}</div>
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
    )
}