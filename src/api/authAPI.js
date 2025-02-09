import a from "axios";
import env from "env";
const BE_URL = env.BE_URL;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
};

const axios = a.create({
    baseURL: BE_URL, // URL cơ sở cho API
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

const authAPI = {
    login: (user) => api.post(`/auth/login`, user),
    getMe: () => api.get(`/auth/me`),
    getAvatars: () => api.get(`/auth/avatar`),
    updateAvatar: (avatar) => api.put(`/auth/change-avatar`, { avatar }),
}

export default authAPI;