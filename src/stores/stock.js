import { defineStore } from "pinia";
import { apiGetTodayHistory, apiGetJIT, apiGetStockExchanges } from "@/apis";
import { isWorkday, isBeforeNine, isOverThirteenHalf } from "@/commons/datetime";

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    todayHistory: {},
    jit: [],
    favorites: [],
    stockExchanges: [],
  }),
  getters: {
    getTodayHistory: (state) => {
      return state.todayHistory;
    },
    getJIT: (state) => {
      return state.jit;
    },
    getStockExchanges: (state) => (keyword) => {
      let stockExchanges = state.stockExchanges;
      if (keyword) {
        return stockExchanges.filter((stockExchange) => {
          return stockExchange.code.includes(keyword) || stockExchange.name.includes(keyword)
        });
      }
      return [];
    },
    getFavorites: (state) => {
      return state.favorites;
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
    setFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    },
    setFavorite(isFavorite, data) {
      let favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];

      if(isFavorite) {
        favorites.push(data);
      } else {
        favorites = favorites.filter((favorite) => {
          return favorite.code !== data.code;
        });
      }
      this.setStockExchangesFavorite(data.code, isFavorite);
      this.favorites = favorites;
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    setStockExchangesFavorite(code, isFavorite) {
      this.stockExchanges.map((stockExchange) => {
        if(stockExchange.code === code) {
          return stockExchange.isFavorite = isFavorite;
        }
      });
    },
    async fetchStockExchangesApi() {
      try {
          const res = await apiGetStockExchanges();
          this.stockExchanges = res.data.map((stockExchange) => {
            if(this.favorites.find(favorite => favorite.code === stockExchange.code)) {
              stockExchange.isFavorite = true;
            } else {
              stockExchange.isFavorite = false;
            }
            return stockExchange;
          });
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
  },
});
