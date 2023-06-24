import { createRouter, createWebHistory } from "vue-router";
import MyStockView from "../views/MyStockView.vue";
import AuthorView from "../views/AuthorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MyStockView,
    },
    {
      path: "/author",
      name: "author",
      component: AuthorView,
    },
  ],
});

export default router;
