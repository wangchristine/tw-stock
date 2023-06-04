import { defineStore } from "pinia";
import { apiGetTodayHistory, apiGetJIT } from "@/apis";

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    todayHistory: [],
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
        // if id workday and before 9 o'clock
        if (!(new Date().getDay() === 6 || new Date().getDay() === 0) && new Date().getHours() < 9) {
          console.log('not yet(10)');
        }

        // over 13:30
        if (new Date() > new Date(new Date().toDateString() + ", 13:30:00")) {
          if(localStorage.getItem(`todayHistory${code}`)) {
            this.todayHistory = JSON.parse(localStorage.getItem(`todayHistory${code}`));
          } else {
            const res = await apiGetTodayHistory(code);
            localStorage.setItem(`todayHistory${code}`, JSON.stringify(res.data));
            this.todayHistory = res.data;
          }
        } else {
          // workday
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
          // if is not workday or not in 9:00 ~ 13:30
          if((new Date().getDay() === 6 || new Date().getDay() === 0) || 
            !(new Date() >= new Date(new Date().toDateString() + ", 09:00:00") && new Date() <= new Date(new Date().toDateString() + ", 13:30:00"))) {
            console.log('not yet(11)');
          }

          const res = await apiGetJIT(code);
          this.jit = res.data;
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
  },
});
