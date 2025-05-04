import Cookies from "js-cookie";
import { defineStore } from "pinia";
import { ref } from "vue";
import { apiPostValidateToken } from "@/apis";

export const useCommonStore = defineStore("common", () => {
  const isPass = ref(false);
  const isLoading = ref(false);

  const postValidateToken = (token) => {
    return apiPostValidateToken(token).then((res) => {
      isPass.value = true;
      const nextDateStart = new Date().setHours(24, 0, 0, 0);
      const expireIn = new Date(new Date().getTime() + (nextDateStart - new Date().getTime()));
      Cookies.set("token", token, {
        expires: expireIn,
      });
    });
  };

  return {
    isPass,
    isLoading,

    postValidateToken,
  };
});
