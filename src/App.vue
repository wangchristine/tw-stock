<script setup>
import { storeToRefs } from "pinia";
import ScreenLoading from "./components/ScreenLoading.vue";
import { useCommonStore } from "@/stores/common";

const commonStore = useCommonStore();
const { isLoading } = storeToRefs(commonStore);
</script>

<template>
  <ScreenLoading v-if="isLoading" />
  <header>
    <RouterLink class="brand-title" :to="{ name: 'home' }">TW Stock</RouterLink>

    <nav class="tool-link" ref="toolLink">
      <RouterLink :to="{ name: 'home' }">My Stock</RouterLink>
    </nav>
    <RouterLink :to="{ name: 'author' }" class="right">Author</RouterLink>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  font-size: 16px;
  width: 100%;
  height: 60px;
  padding: 10px;
  /* max-height: 100vh; */
  background-color: #51344d;
  border-bottom: solid 1px #cfcfcf;
}

header a {
  display: inline-block;
  padding: 6px 1rem;
  color: #c4bdc3;
  text-decoration: none;
}

header .right {
  float: right;
}

header .right.router-link-exact-active {
  background-color: #6f5060;
}

.brand-title {
  margin: 0 20px;
  color: #d8c4d6;
  font-weight: bold;
  font-size: 18px;
  text-decoration: none;
}

nav.tool-link {
  display: inline-block;
}

nav a.router-link-exact-active {
  background-color: #6f5060;
}

@media (max-width: 768px) {
  header .tool-link {
    display: none;
    position: absolute;
    top: 62px;
    left: 0;
    width: 100%;
    padding: 20px;
    z-index: 999;
    box-shadow: 0px 2px 10px 2px rgb(0 0 0 / 30%);
  }
}
</style>
