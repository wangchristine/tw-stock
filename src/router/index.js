import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import AuthorView from "../views/AuthorView.vue";
import MyStockView from "../views/MyStockView.vue";
import ValidateTokenView from "../views/ValidateTokenView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MyStockView,
      meta: {
        auth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: ValidateTokenView,
      meta: {
        auth: false,
      },
    },
    {
      path: "/author",
      name: "author",
      component: AuthorView,
      meta: {
        auth: false,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  let token = Cookies.get("token");
  const authStore = useAuthStore();

  if (to.meta.auth) {
    if (token != null) {
      await authStore.postValidateToken(token);
      if (!authStore.getIsPass) {
        return { name: "login" };
      }
    } else {
      return { name: "login" };
    }
  } else {
    if (token != null) {
      await authStore.postValidateToken(token);
      if (to.name === "login" && authStore.getIsPass) {
        return { name: "home" };
      }
    }
  }
});

export default router;
