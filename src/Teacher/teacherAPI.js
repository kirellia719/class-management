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
   baseURL: `${BE_URL}/teacher`, // URL cơ sở cho API
   timeout: 3000, // Thời gian chờ tối đa là 3 giây (3000 ms)
});

const updateHeader = () => {
   const token = localStorage.getItem("token") || null;
   if (token) {
      headers["authorization"] = "Bearer " + token;
   }
};

const api = {
   get: async (url) => {
      updateHeader();
      const { data } = await axios.get(url, { headers });
      return data;
   },
   post: async (url, body) => {
      updateHeader();
      const { data } = await axios.post(url, body, { headers });
      return data;
   },
   put: async (url, body) => {
      updateHeader();
      const { data } = await axios.put(url, body, { headers });
      return data;
   },
   delete: async (url) => {
      updateHeader();
      const { data } = await axios.delete(url, { headers });
      return data;
   },
};

const teacherAPI = {
   //COURSE
   getAllCourses: () => api.get("/course/all"),
   deleteCourse: (courseId) => api.delete(`/course/${courseId}`),
   createCourse: (data) => api.post("/course", data),
   updateCourse: (courseId, data) => api.put(`/course/${courseId}`, data),

   //STUDENT
   addStudent: (courseId, data) => api.post(`/student/${courseId}`, data),
   getStudentsInCourse: (courseId) => api.get(`/student/${courseId}`),
   changePasswordStudent: (studentId, data) => api.put(`/student/password/${studentId}/`, data),
   updateStudent: (studentId, data) => api.put(`/student/${studentId}`, data),
   deleteStudent: (studentId) => api.delete(`/student/${studentId}`),

   //EXAM
   createExam: (exam) => api.post("/exam", exam),
   getAllExams: () => api.get("/exam/all"),
   getExam: (examId) => api.get(`exam/${examId}`),
   updateExam: (examId, data) => api.put(`/exam/${examId}`, data),
   deleteExam: (examId) => api.delete(`/exam/${examId}`),
};

export default teacherAPI;
