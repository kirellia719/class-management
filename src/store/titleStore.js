import { create } from "zustand";
import { devtools } from 'zustand/middleware';


const useTitleStore = create(
    devtools(
        (set) => ({
            title: "",
            backButton: "",
            setTitle: (title) => set(() => ({ title })),
            setBackButton: (link) => set(() => ({ backButton: link }))
        }),
        { name: 'titleStore' }
    )
)

export default useTitleStore;