"use client";
import { useRouter, usePathname } from "next/navigation";
import { createOrGetPrivateChat } from "@/api/chat/chat";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { searchUserByName } from "@/api/user/user";
import Search from "./SearchField";
import { Menu, X } from "lucide-react";
import { sideBarLinks } from "@/config/sideMenuLinks";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function SideMenu() {
    const [searchUser, setSearchUser] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const debounceSearchUser = useDebounce(searchUser, 1000);
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const user = useUserStore((state) => state.user);

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
            router.push(`/chats/private/${chat.chatId}`);
        } catch (err) {
            console.error("Failed to start chat:", err);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="fixed top-4 left-4 z-50 p-2 bg-violet-800 text-white rounded-lg shadow-md hover:bg-violet-700 transition"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside
                className={`fixed top-0 left-0 h-screen bg-neutral-950 text-white flex flex-col shadow-lg z-40 transition-all duration-300 ease-in-out rounded-2xl ${open ? "w-64" : "w-16"
                    }`}
            >
                <div className="p-4 flex items-center justify-center">
                    <span
                        className={`font-semibold text-2xl text-white transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {user?.name}
                    </span>
                </div>

                {open && (
                    <div className="p-2">
                        <Search
                            searchValue={searchUser}
                            onChange={setSearchUser}
                            placeholder="Search user..."
                        >
                            {results.length > 0 && (
                                <div className="absolute w-full bg-neutral-700 mt-1 rounded shadow">
                                    {results.map((user) => (
                                        <div
                                            key={user.id}
                                            className="p-2 flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="font-semibold">{user.name}</div>
                                                <div className="text-sm">{user.email}</div>
                                            </div>
                                            <button
                                                onClick={() => handleWrite(user.id)}
                                                className="bg-violet-900 text-white px-3 py-1 rounded hover:bg-blue-800"
                                            >
                                                Write
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {results.length === 0 && debounceSearchUser && (
                                <p className="m-2">No results</p>
                            )}
                        </Search>
                    </div>
                )}

                <div className="p-4 border-t border-indigo-400 flex flex-col gap-3">
                    {sideBarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                href={link.href}
                                key={link.name}
                                className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors
                  ${isActive
                                        ? "text-violet-400 border-l-4 border-violet-600 bg-neutral-800"
                                        : "text-indigo-200 hover:text-white hover:bg-neutral-800"
                                    }
                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span
                                    className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 hidden"
                                        }`}
                                >
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}
