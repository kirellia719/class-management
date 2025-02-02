import a from "axios";
import env from "env";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
};

const BE_URL = env.BE_URL;
const axios = a.create({
    baseURL: `${BE_URL}/student`, // URL cơ sở cho API
    timeout: 3000, // Thời gian chờ tối đa là 3 giây (3000 ms)
});

const updateHeader = () => {
    const token = localStorage.getItem("token") || null;
    if (token) {
        headers["authorization"] = "Bearer " + token;
    }
}

const api = {
    get: async (url) => {
        updateHeader();
        const { data } = await axios.get(url, { headers });
        return data;
    },
    post: async (url, body) => {
        updateHeader();
        const { data } = await axios.post(url, body, { headers });
        return (data);
    },
    put: async (url, body) => {
        updateHeader();
        const { data } = await axios.put(url, body, { headers });
        return (data);
    },
    delete: async (url) => {
        updateHeader();
        const { data } = await axios.delete(url, { headers });
        return (data);
    },
};

const studentAPI = {
    //COURSE
    getAllCourses: () => api.get("/course/all"),
    getAllExamsInCourse: (courseId) => api.get(`/course/${courseId}/all-exams`),
    checkExam: (examId) => api.get(`/exam/${examId}`),
    joinExam: (examId) => api.post(`/exam/${examId}/join`),
    getExamForSubmission: (submissionId) => api.get(`/exam/submit/${submissionId}`),
    submitExam: (answers, submissionId) => api.post(`/exam/submit/${submissionId}`, { answers }),
}

export default studentAPI;