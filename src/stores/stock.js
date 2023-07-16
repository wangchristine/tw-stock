import { defineStore } from "pinia";
import { apiGetTodayHistory, apiGetJIT, apiGetStockExchanges, apiGetOverCounters } from "@/apis";
import { isWorkday, isBeforeNine, isOverThirteenHalf } from "@/commons/datetime";

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    todayHistory: {},
    jit: [],
    favorites: [],
    stockExchanges: [],
    overCounters: [],
    selectedStock: {},
    isPrepareTodayHistory: false,
    isPrepareJIT: false,
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
    getOverCounters: (state) => (keyword) => {
      let overCounters = state.overCounters;
      if (keyword) {
        return overCounters.filter((overCounter) => {
          return overCounter.code.includes(keyword) || overCounter.name.includes(keyword)
        });
      }
      return [];
    },
    getFavorites: (state) => {
      return state.favorites;
    },
    getSelectedStock: (state) => {
      return state.selectedStock;
    },
    getIsPrepareTodayHistory: (state) => {
      return state.isPrepareTodayHistory;
    },
    getIsPrepareJIT: (state) => {
      return state.isPrepareJIT;
    },
  },
  actions: {
    async fetchTodayHistoryApi(code) {
      this.isPrepareTodayHistory = true;
      try {
        // if is workday and before 9 o'clock
        if (isWorkday() && isBeforeNine()) {
          this.isPrepareTodayHistory = false;
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
        this.isPrepareTodayHistory = false;
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
      this.jit = [];
      this.isPrepareJIT = true;
      try {
          const res = await apiGetJIT(code);
          this.jit = res.data;
          this.isPrepareJIT = false;
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
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
      if(data.type === 'tse') {
        this.setStockExchangesFavorite(data.code, isFavorite);
      } else {
        // otc
        this.setOverCountersFavorite(data.code, isFavorite);
      }
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
    setOverCountersFavorite(code, isFavorite) {
      this.overCounters.map((overCounter) => {
        if(overCounter.code === code) {
          return overCounter.isFavorite = isFavorite;
        }
      });
    },
    async fetchOverCountersApi() {
      try {
          const res = await apiGetOverCounters();
          this.overCounters = res.data.map((overCounter) => {
            if(this.favorites.find(favorite => favorite.code === overCounter.code)) {
              overCounter.isFavorite = true;
            } else {
              overCounter.isFavorite = false;
            }
            return overCounter;
          });
      } catch (err) {
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
    setSelectedStock(stock) {
      this.selectedStock = stock;
    }
  },
});
