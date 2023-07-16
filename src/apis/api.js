import axios from "axios";

const stockApi = axios.create({
    baseURL: "https://tw-stock-lumen.vercel.app",
});

export const getTodayHistory = (code) => stockApi.get("/history?code=" + code);
export const getJIT = (code, type) => stockApi.get("/jit?code=" + code + "&type=" + type);
export const getStockExchanges = () => stockApi.get("/stock-exchanges");
export const getOverCounters = () => stockApi.get("/over-counters");
