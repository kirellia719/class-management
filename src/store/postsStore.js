import { create } from "zustand";

const usePostStore = create(set => ({
    posts: [],
    setPosts: posts => set(state => ({
        posts
    }))
}))

export default usePostStore;