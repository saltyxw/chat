"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { getProfile, searchUserByName } from "@/api/user/user";
import { createOrGetPrivateChat } from "@/api/chat/chat";
import { logout } from "@/api/auth/auth";

export default function Home() {
  const router = useRouter();
  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const debounceSearchUser = useDebounce(searchUser, 1000);

  useEffect(() => {
    if (debounceSearchUser) handleSearch(debounceSearchUser);
    else setResults([]);
  }, [debounceSearchUser]);

  const handleSearch = async (query: string) => {
    try {
      const data = await searchUserByName(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWrite = async (userId: number) => {
    try {
      const chat = await createOrGetPrivateChat(userId);
      console.log("Chat created or found:", chat);

      router.push(`/chat/${chat.chatId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  return (
    <div className="p-5">
      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-3 py-2 rounded">CALL</button>
        <button
          onClick={getProfile}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Profile
        </button>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="relative max-w-xs mt-4">
        <input
          className="p-2 bg-violet-700 text-white w-full rounded"
          type="search"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Пошук користувача..."
        />

        {results.length > 0 && (
          <div className="absolute w-full bg-amber-300 mt-1 rounded shadow">
            {results.map((user) => (
              <div
                key={user.id}
                className="p-2 border-b border-black flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-700">{user.email}</div>
                </div>
                <button
                  onClick={() => handleWrite(user.id)}
                  className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                >
                  Написати
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
