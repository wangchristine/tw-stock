import { defineStore } from "pinia";
import { apiGetTodayHistory } from "@/apis";

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    todayHistory: [],
  }),
  getters: {
    getTodayHistory: (state) => {
      return state.todayHistory;
    },
  },
  actions: {
    async fetchTodayHistoryApi(code) {
      try {
        // if id workday and before 9 o'clock
        if (!(new Date().getDay() === 6 || new Date().getDay() === 0) && new Date().getHours() < 9) {
          console.log('not yet');
        }

        // over 13:30
        if (new Date() > new Date(new Date().toDateString() + ", 13:30:00")) {
          if(localStorage.getItem('todayHistory')) {
            this.todayHistory = JSON.parse(localStorage.getItem('todayHistory'));
          } else {
            const res = await apiGetTodayHistory(code);
            localStorage.setItem('todayHistory', JSON.stringify(res.data));
            this.todayHistory = res.data;
          }
        } else {
          // workday
          localStorage.removeItem('todayHistory');
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
  },
});
