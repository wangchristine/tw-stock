<script setup>
import { ref } from "vue";
import JITStockCanvas from "@/components/JITStockCanvas.vue";
import { useStockStore } from "@/stores/stock";
import { storeToRefs } from "pinia";

const jitStockCanvas = ref(null);
const jitStock = ref(null);

const stockStore = useStockStore();
stockStore.fetchJITApi(2330);

const { getJIT: jit } = storeToRefs(stockStore);

const togglePip = () => {
  jitStock.value.requestPictureInPicture();
};

const renderFinished = () => {
  if (jitStock.value.srcObject === null) {
    jitStock.value.srcObject =
      jitStockCanvas.value.$refs.chart.root.children[0].children[0].captureStream();
  }
};

const isTodayHigher = (compareValue) => {
  if((compareValue - jit.value.daily.yesterday) > 0) {
    return 1;
  } else if ((compareValue - jit.value.daily.yesterday) === 0) {
    return 0;
  } else {
    return -1;
  }
}

setInterval(() => {
  stockStore.fetchJITApi(2330);
}, 5000)
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
      <!-- 🤍💗🧡-->
      <div class="draw-block">
        <JITStockCanvas ref="jitStockCanvas" @finished="renderFinished" />
        <video ref="jitStock" muted autoplay></video>
        <button @click="togglePip">toggle</button>
      </div>
      <div class="detail-block">
        <p>資料時間：<span>{{ new Date(jit.jit.stock[0]) }}</span></p>
        <div class="price">
          <div class="item">成交
            <span :class="[{ 'red': isTodayHigher(jit.jit.stock[1]) === 1 }, { 'green': isTodayHigher(jit.jit.stock[1]) === -1 }]">
              {{ jit.jit.stock[1] }}
            </span>
          </div>
          <div class="item">昨收 <span>{{ jit.daily.yesterday }}</span></div>
          <div class="item">開盤
            <span :class="[{ 'red': isTodayHigher(jit.daily.start) === 1 }, { 'green': isTodayHigher(jit.daily.start) === -1 }]">
              {{ jit.daily.start }}
            </span>
          </div>

          <div class="item">漲跌幅
            <span :class="[{ 'red-with-symbol': (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) > 0 }, { 'green-with-symbol': (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) < 0 }]">
              {{ (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) }}%
            </span>
          </div>
          <div class="item">最高
            <span :class="[{ 'red': isTodayHigher(jit.jit.highest) === 1 }, { 'green': isTodayHigher(jit.jit.highest) === -1 }]">
              {{ jit.jit.highest }}
            </span>
          </div>
          <div class="item">漲跌
            <span :class="[{ 'red-with-symbol': isTodayHigher(jit.jit.stock[1]) === 1 }, { 'green-with-symbol': isTodayHigher(jit.jit.stock[1]) === -1 }]">
              {{ jit.jit.stock[1] - jit.daily.yesterday }}
            </span>
          </div>
          <div class="item">最低
            <span :class="[{ 'red': isTodayHigher(jit.jit.lowest) === 1 }, { 'green': isTodayHigher(jit.jit.lowest) === -1 }]">
              {{ jit.jit.lowest }}
            </span>
          </div>
          <div class="item">總量 <span>{{ jit.jit.totalVolume }}</span></div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sidebar {
  flex-basis: 20%;
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
  display: flex;
  flex-basis: 80%;
  margin: 30px 20px;
}

.draw-block {
  flex-basis: 60%;
}

.detail-block {
  flex-basis: 40%;
  background-color: #977f7f;
  padding: 20px;
  color: #ffffff;
}

.detail-block .price {
  display: flex;
  flex-wrap: wrap;
  padding-top: 12px;
}

.detail-block .price .item {
  flex-basis: 50%;
  padding: 0 16px;
}

.detail-block .price .item span {
  float: right;
  font-weight: bold;
}

.red {
  color: #c31d23;
}

.red-with-symbol {
  color: #c31d23;
}

.red-with-symbol::before {
  content: '▲';
}

.green {
  color: #017843;
}

.green-with-symbol {
  color: #017843;
}

.green-with-symbol::before {
  content: '▼';
}

/* temp */
.container canvas {
  background-color: #977f7f;
}
</style>
