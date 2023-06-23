import { defineStore } from "pinia";
import { apiGetTodayHistory, apiGetJIT } from "@/apis";
import { isWorkday, isBeforeNine, isOverThirteenHalf } from "@/commons/datetime";

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    todayHistory: {},
    jit: [],
  }),
  getters: {
    getTodayHistory: (state) => {
      return state.todayHistory;
    },
    getJIT: (state) => {
      return state.jit;
    },
  },
  actions: {
    async fetchTodayHistoryApi(code) {
      try {
        // if is workday and before 9 o'clock
        if (isWorkday() && isBeforeNine()) {
          return;
        }

        // if is not workday or over 13:30
        if (!isWorkday() || isOverThirteenHalf()) {
          if(localStorage.getItem(`todayHistory${code}`)) {
            this.todayHistory = JSON.parse(localStorage.getItem(`todayHistory${code}`));
          } else {
            const res = await apiGetTodayHistory(code);
            localStorage.setItem(`todayHistory${code}`, JSON.stringify(res.data));
            this.todayHistory = res.data;
          }
        } else {
          // stock open
          localStorage.removeItem(`todayHistory${code}`);
          const res = await apiGetTodayHistory(code);
          this.todayHistory = res.data;
        }
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
    updateTodayHistory(data) {
      this.todayHistory.stock.push(data.stock);
      this.todayHistory.volume.push(data.volume);
    },
    async fetchJITApi(code) {
      try {
          const res = await apiGetJIT(code);
          this.jit = res.data;
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
  },
});
