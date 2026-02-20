import axios from "axios";

const API_URL = "https://localhost:7029/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getCompetitions = async () => {
    const response = await api.get("/competitions");
    return response.data;
};

export default api;
