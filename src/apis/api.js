import axios from "axios";
import Cookies from "js-cookie";

const stockApi = axios.create({
  baseURL: "https://tw-stock-lumen.vercel.app",
});

stockApi.interceptors.request.use((config) => {
  if (Cookies.get("token") != null) {
    config.headers["token"] = Cookies.get("token");
  }
  return config;
});

export const postValidateToken = (token) => stockApi.post("/validate-token", { token: token });
export const getTodayHistory = (code) => stockApi.get("/history?code=" + code);
export const getJIT = (code, type) => stockApi.get("/jit?code=" + code + "&type=" + type);
export const getStockExchanges = () => stockApi.get("/stock-exchanges");
export const getOverCounters = () => stockApi.get("/over-counters");
