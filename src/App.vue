<script setup>
</script>

<template>
  <header>
    <RouterLink class="brand-title" :to="{ name: 'home' }">TW Stock</RouterLink>

    <nav class="tool-link" ref="toolLink">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'my-stock' }">JIT</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  font-size: 16px;
  width: 100%;
  height: 60px;
  padding: 15px;
  /* max-height: 100vh; */
  background-color: #51344D;
  border-bottom: solid 1px #cfcfcf;
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
  background-color: #6F5060;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: #c4bdc3;
  text-decoration: none;
}

@media (max-width: 768px) {
  nav.tool-link {
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
