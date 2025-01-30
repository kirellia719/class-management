import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useCourseStore = create(
   devtools(
      (set) => ({
         course: null,
         setCourse: (course) => set((state) => ({ course })),
      }),
      { name: "courseStore" }
   )
);

export default useCourseStore;
