<script setup>
import { ref } from "vue";
import JITStockCanvas from "@/components/JITStockCanvas.vue";

const jitStockCanvas = ref(null);
const jitStock = ref(null);

const togglePip = () => {
  jitStock.value.requestPictureInPicture();
};

const renderFinished = () => {
  if (jitStock.value.srcObject === null) {
    jitStock.value.srcObject =
      jitStockCanvas.value.$refs.chart.root.children[0].children[0].captureStream();
  }
};
</script>

<template>
  <main>
    <div class="sidebar">
      <div class="search-block">
        <h3>Search</h3>
        <input type="text" name="search" maxlength="6" />
      </div>
      <div class="favorite-block">
        <h3>Favorite</h3>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </div>
    <div class="container">
      <!-- ๐ค๐๐งก-->
      <JITStockCanvas ref="jitStockCanvas" @finished="renderFinished" />
      <video ref="jitStock" muted autoplay></video>
      <button @click="togglePip">toggle</button>
    </div>
  </main>
</template>

<style scoped>
.sidebar {
  flex-basis: 30%;
  margin: 30px 20px;
}

.sidebar > div > h3 {
  text-align: center;
  margin-bottom: 5px;
}

.sidebar .search-block {
  background-color: #977f7f;
  margin-bottom: 15px;
  padding: 15px 20px 20px 20px;
}

.search-block input {
  width: 100%;
  border-radius: 10px;
  border: 0;
  padding: 10px 15px;
  font-size: 16px;
  margin: 0 auto;
  background-color: #eee;
}

.sidebar .favorite-block {
  background-color: #977f7f;
  padding: 15px 20px 20px 20px;
}

.favorite-block ul {
  list-style: none;
  padding: 0;
  background-color: #d8c9c9;
  border-radius: 5px;
  color: #000;
}

.favorite-block ul li {
  padding: 10px 20px;
  border-bottom: solid 1px #977f7f;
}

.favorite-block ul li:last-child {
  border-bottom: none;
}

.container {
  flex-basis: 70%;
  margin: 30px 20px;
}

/* temp */
.container canvas {
  background-color: #977f7f;
}
</style>
