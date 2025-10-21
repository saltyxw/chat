"use client";

import { useEffect } from "react";
import { initAuth } from "@/hooks/useInitAuth";

export default function InitAuthLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initAuth();
    }, []);

    return <>{children}</>;
}
