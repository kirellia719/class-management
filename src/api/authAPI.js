import api from "./"

const authAPI = {
    login: (user) => api.post(`/auth/login`, user),
    getMe: () => api.get(`/auth/me`),
}

export default authAPI;