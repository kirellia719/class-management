import { create } from "zustand";
import { devtools } from 'zustand/middleware';

const useCourseStore = create(
    devtools(
        (set) => ({
            courses: [],
            setCourses: (courses) => set(state => ({
                ...state,
                courses
            })),
            addCourse: (course) => set(state => ({
                courses: [...state.courses, course]
            }))
        }),
        { name: 'courseStore' }
    )
)

export default useCourseStore;