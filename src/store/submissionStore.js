import { create } from "zustand";
import { devtools } from 'zustand/middleware';

const submissionKey = 'submission';


const useSubmissionStore = create(
    devtools(
        (set) => ({
            submission: localStorage.getItem(submissionKey) || null,
            setSubmission: (submission) => set({
                submission
            })
        }),
        { name: 'submissionStore' }
    )
)

export default useSubmissionStore;