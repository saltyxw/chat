"use client";

import { useInitAuth } from "@/hooks/useInitAuth";

export default function InitAuthLayout({ children }: { children: React.ReactNode }) {
    useInitAuth();
    return <>{children}</>;
}
