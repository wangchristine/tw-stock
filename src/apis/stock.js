import axios from "axios";
import Cookies from "js-cookie";

const useApi = axios.create({
  baseURL: "https://tw-stock-lumen.vercel.app",
});

useApi.interceptors.request.use((config) => {
  if (Cookies.get("token") != null) {
    config.headers["token"] = Cookies.get("token");
  }
  return config;
});

const stockApi = {
  postValidateToken(token) {
    return useApi.post("/validate-token", { token: token });
  },
  getTodayHistory(code) {
    return useApi.get("/history?code=" + code);
  },
  getJIT(code, type) {
    return useApi.get("/jit?code=" + code + "&type=" + type);
  },
  getStockExchanges() {
    return useApi.get("/stock-exchanges");
  },
  getOverCounters() {
    return useApi.get("/over-counters");
  },
};

export default stockApi;
