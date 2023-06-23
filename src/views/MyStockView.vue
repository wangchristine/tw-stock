<script setup>
import { computed, onMounted, ref } from "vue";
import JITStockCanvas from "@/components/JITStockCanvas.vue";
import { useStockStore } from "@/stores/stock";
import { storeToRefs } from "pinia";

const jitStockCanvas = ref(null);
const jitStock = ref(null);

const stockStore = useStockStore();

onMounted(async () => {
  await stockStore.fetchJITApi(2330);
});

const jit = computed(() => stockStore.getJIT);

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
        <JITStockCanvas ref="jitStockCanvas" v-if="jit.length !== 0" @finished="renderFinished" />
        <video ref="jitStock" muted autoplay></video>
        <button @click="togglePip">toggle</button>
      </div>
      <div class="detail-block" v-if="jit.length !== 0">
        <p>資料時間：<span>{{ new Date(jit.jit.stock[0]).toISOString().split('T')[0] + " " + new Date(jit.jit.stock[0]).toTimeString().split(' ')[0] }}</span></p>
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
        <hr>
        <table class="five">
          <tr class="title">
            <td>量</td>
            <td>委買價</td>
            <td>委賣價</td>
            <td>量</td>
          </tr>
          <tr v-for="(buyVolume, key) in jit.five.buyVolume" :key="key">
            <td>{{ buyVolume }}</td>
            <td :class="[{ 'red': isTodayHigher(jit.five.buyStock[key]) === 1 }, { 'green': isTodayHigher(jit.five.buyStock[key]) === -1 }]">{{ jit.five.buyStock[key] }}</td>
            <td :class="[{ 'red': isTodayHigher(jit.five.sellStock[key]) === 1 }, { 'green': isTodayHigher(jit.five.sellStock[key]) === -1 }]">{{ jit.five.sellStock[key] }}</td>
            <td>{{ jit.five.sellVolume[key] }}</td>
          </tr>
        </table>
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
  background-color: #9b8383;
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
  background-color: #9b8383;
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
  border-bottom: solid 1px #9b8383;
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
  background-color: #9b8383;
  padding: 20px;
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

.detail-block .five {
  width: 100%;
  text-align: center;
}

.detail-block .five td {
  font-weight: bold;
}

.detail-block .five .title td {
  font-weight: normal;
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
  color: #196a3e;
}

.green-with-symbol {
  color: #196a3e;
}

.green-with-symbol::before {
  content: '▼';
}

hr {
  margin: 5px auto;
}

/* temp */
.container canvas {
  background-color: #977f7f;
}
</style>
