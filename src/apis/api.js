import axios from "axios";

const stockApi = axios.create({
    baseURL: "https://tw-stock-lumen.vercel.app",
});

export const getTodayHistory = (code) => stockApi.get("/history?code=" + code);
export const getJIT = (code) => stockApi.get("/jit?code=" + code);
export const getStockExchanges = () => stockApi.get("/stock-exchanges");
export const getOverCounters = () => stockApi.get("/over-counters");
