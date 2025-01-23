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
    baseURL: BE_URL, // URL cơ sở cho API
    timeout: 3000, // Thời gian chờ tối đa là 3 giây (3000 ms)
});

const api = {
    get: async (url) => {
        const token = localStorage.getItem("token") || null;
        if (token) {
            headers["authorization"] = "Bearer " + token;
        }
        const { data } = await axios.get(BE_URL + url, { headers });
        return data;
    },
    post: async (url, body) => {
        const token = localStorage.getItem("token") || null;
        if (token) {
            headers["authorization"] = "Bearer " + token;
        }
        const { data } = await axios.post(BE_URL + url, body, { headers });
        return (data);
    },
    put: async (url, body) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers["authorization"] = "Bearer " + token;
        }
        const { data } = await axios.put(BE_URL + url, body, { headers });
        return (data);
    },
    delete: async (url) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers["authorization"] = "Bearer " + token;
        }
        const { data } = await axios.delete(BE_URL + url, { headers });
        return (data);
    },
};

export default api;
