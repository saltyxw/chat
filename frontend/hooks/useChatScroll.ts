import { useState, useRef, useCallback, useEffect } from "react";
import { MessageType } from "@/types/message";
import { emitLoadMoreMessages } from "@/api/socket/chatEmitters";
import { getSocket } from "@/api/socket/socketClient";

export const useChatScroll = (
    chatId: string,
    messages: MessageType[],
    setMessages: (messages: MessageType[] | ((prev: MessageType[]) => MessageType[])) => void,
    socketReady: boolean
) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const previousScrollHeight = useRef<number>(0);
    const initialLoadDone = useRef(false);

    const scrollToBottom = useCallback(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    const isNearBottom = useCallback((container: HTMLDivElement, threshold = 100) => {
        return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
    }, []);

    const handleScroll = useCallback(() => {
        const container = messageContainerRef.current;
        if (!container || loadingMore || !hasMore || !socketReady) return;

        if (container.scrollTop === 0) {
            const oldestMessage = messages[0];
            if (oldestMessage?.id) {
                setLoadingMore(true);
                previousScrollHeight.current = container.scrollHeight;
                emitLoadMoreMessages(chatId, oldestMessage.id);
            }
        }
    }, [messages, loadingMore, hasMore, chatId, socketReady]);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!socketReady) return;

        const socket = getSocket();

        const handleMoreMessages = (olderMsgs: MessageType[]) => {
            setLoadingMore(false);

            if (olderMsgs.length === 0) {
                setHasMore(false);
                return;
            }

            setMessages((prev) => {
                // Фільтруємо дублікати
                const existingIds = new Set(prev.map(msg => msg.id));
                const newMessages = olderMsgs.filter(msg => !existingIds.has(msg.id));
                return [...newMessages, ...prev];
            });

            setTimeout(() => {
                const container = messageContainerRef.current;
                if (container) {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight.current;
                }
            }, 0);
        };

        socket.on("moreMessages", handleMoreMessages);

        return () => {
            socket.off("moreMessages", handleMoreMessages);
        };
    }, [socketReady, setMessages]);

    useEffect(() => {
        if (messages.length > 0 && !initialLoadDone.current) {
            setTimeout(() => {
                scrollToBottom();
                initialLoadDone.current = true;
            }, 200);
        }
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            if (initialLoadDone.current && isNearBottom(container, 50)) {
                scrollToBottom();
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [scrollToBottom, isNearBottom]);

    const resetScrollState = useCallback(() => {
        setLoadingMore(false);
        setHasMore(true);
        initialLoadDone.current = false;
        previousScrollHeight.current = 0;
    }, []);

    return {
        messageContainerRef,
        loadingMore,
        hasMore,
        scrollToBottom,
        resetScrollState
    };
};