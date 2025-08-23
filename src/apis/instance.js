// src/apis/instance.js
import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // .env에서 가져오기
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키 필요할 때만
});

export default instance;
