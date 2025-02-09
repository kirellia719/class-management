import { create } from "zustand";
import { devtools } from 'zustand/middleware';

const tokenName = 'token';


const useAuthStore = create(
    devtools(
        (set) => ({
            token: localStorage.getItem(tokenName) || null,
            user: null,
            setToken: token => {
                if (token) {
                    localStorage.setItem(tokenName, token);
                    set(state => ({
                        ...state,
                        token: token
                    }))
                }
            },
            setUser: user => set(state => ({
                ...state,
                user: user
            })),
            setAvatar: avatar => set(state => ({
                ...state,
                user: {
                    ...state.user,
                    avatar: avatar,
                }
            })),
            logout: () => {
                localStorage.removeItem(tokenName);
                set(() => ({
                    token: null,
                    user: null
                }))
            }
        }),
        { name: 'authStore' }
    )
)

export default useAuthStore;