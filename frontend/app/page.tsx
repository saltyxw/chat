"use client"
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000');

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("chatHistory", (msgs) => {
      setMessages(msgs);
    });

    socket.on("chatMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("chatHistory");
      socket.off("chatMessage");
      socket.off("disconnect");
    };
  }, []);

  const sendMsg = () => {
    if (message.trim() === "") return;
    socket.emit("chatMessage", { user: "Tester", text: message });
    setMessage('');
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h2 className="text-center text-4xl mb-4">Messages</h2>
      <div className="bg-amber-100 w-full max-w-3xl flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-4 w-full max-w-3xl gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMsg() }}
        />
        <button
          onClick={sendMsg}
          className="px-4 bg-red-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
