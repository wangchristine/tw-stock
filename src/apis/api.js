import axios from "axios";

const todayHistoryApi = axios.create({
    baseURL: "https://tw-stock-lumen.vercel.app",
});

export const getTodayHistory = (code) => todayHistoryApi.get("/history?code=" + code);
