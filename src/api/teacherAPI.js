import api from "./";

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

    //EXAM
    createExam: (exam) => api.post("/exam", exam),
    getAllExams: () => api.get("/exam/all"),
}

export default teacherAPI;