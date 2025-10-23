import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserType } from '@/types/user';

interface UserState {
    user: UserType | null;
    currentUserId: number | null;
    setUser: (user: UserType | null) => void;
    clearUser: () => void;
    getUser: () => UserType | null;
    getUserId: () => number | null;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            currentUserId: null,

            setUser: (user) => set({
                user,
                currentUserId: user?.id || user?.sub || null
            }),

            clearUser: () => set({ user: null, currentUserId: null }),

            getUser: () => get().user,

            getUserId: () => get().currentUserId,
        }),
        {
            name: 'user-storage',
        }
    )
);