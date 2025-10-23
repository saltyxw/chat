export default function SendMsgInput({
    value,
    onChange,
    onSend,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled: boolean;
}) {
    return (
        <div className="flex mt-4 gap-2">
            <input
                type="text"
                className="flex-1 p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={value}
                placeholder="Type a message..."
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
            />
            <button
                onClick={onSend}
                disabled={disabled}
                className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                Send
            </button>
        </div>
    );
}
