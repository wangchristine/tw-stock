import { defineStore } from "pinia";
import { apiPostValidateToken } from "@/apis";
import Cookies from "js-cookie";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    isPass: false,
  }),
  getters: {
    getIsPass: (state) => {
      return state.isPass;
    },
  },
  actions: {
    async postValidateToken(token) {
      try {
          await apiPostValidateToken(token);
          this.isPass = true;

          const nextDateStart = (new Date()).setHours(24,0,0,0);
          const expireIn = new Date(new Date().getTime() + (nextDateStart - new Date().getTime()));

          Cookies.set('token', token, {
              expires: expireIn
          });
      } catch (err) {
        this.isPass = false;
        Cookies.remove('token');
        console.log("err: ", err.response.data.message + "(" + err.response.status + ")");
        // return e.response.data;
      }
    },
    setIsPass(isPass) {
      this.isPass = isPass;
    }
  },
});
