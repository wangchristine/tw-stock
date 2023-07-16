<script setup>
import { computed, onMounted, ref, watch } from "vue";
import JITStockCanvas from "@/components/JITStockCanvas.vue";
import MyStockSidebar from "@/components/MyStockSidebar.vue";
import { useStockStore } from "@/stores/stock";
import { storeToRefs } from "pinia";

const jitStockCanvas = ref(null);
const jitStock = ref(null);

const stockStore = useStockStore();

onMounted(async () => {
  if(favorites.value && favorites.value.length > 0) {
    stockStore.setSelectedStock(favorites.value[0]);
  }
  if(selectedStock.value.length > 0) {
    await stockStore.fetchJITApi(selectedStock.value.code);
  }
});

const jit = computed(() => stockStore.getJIT);
const favorites = computed(() => stockStore.getFavorites);
const selectedStock = computed(() => stockStore.getSelectedStock);
const isPrepareTodayHistory = computed(() => stockStore.getIsPrepareTodayHistory);
const isPrepareJIT = computed(() => stockStore.getIsPrepareJIT);

watch(selectedStock, (stock) => {
  stockStore.fetchJITApi(stock.code);
});

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
    <MyStockSidebar />
    
    <div class="container">
      <!-- 🤍💗🧡-->
      <div class="draw-block" v-if="jit.length !== 0">
        <JITStockCanvas ref="jitStockCanvas" @finished="renderFinished" />
        <video ref="jitStock" muted autoplay></video>
        <button @click="togglePip">toggle</button>
      </div>
      <div class="draw-block-empty" v-else-if="isPrepareTodayHistory || isPrepareJIT">
        正在努力讀取資料，請稍後...
      </div>
      <div class="draw-block-empty" v-else>
        請先選擇一檔股票後查看...
      </div>
      <div class="detail-block">
        <p class="info">{{ selectedStock.fullName }} <span>{{ selectedStock.industry }}</span></p>
        <p>資料時間：
          <span v-if="jit.length !== 0">{{ new Date(jit.jit.stock[0]).toISOString().split('T')[0] + " " + new Date(jit.jit.stock[0]).toTimeString().split(' ')[0] }}</span>
          <span v-else>-</span>
        </p>
        <div class="price">
          <div class="item">成交
            <span v-if="jit.length !== 0" :class="[{ 'red': isTodayHigher(jit.jit.stock[1]) === 1 }, { 'green': isTodayHigher(jit.jit.stock[1]) === -1 }]">
              {{ jit.jit.stock[1] }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="item">昨收 
            <span v-if="jit.length !== 0">{{ jit.daily.yesterday }}</span>
            <span v-else>-</span>
          </div>
          <div class="item">開盤
            <span v-if="jit.length !== 0" :class="[{ 'red': isTodayHigher(jit.daily.start) === 1 }, { 'green': isTodayHigher(jit.daily.start) === -1 }]">
              {{ jit.daily.start }}
            </span>
            <span v-else>-</span>
          </div>

          <div class="item">漲跌幅
            <span v-if="jit.length !== 0" :class="[{ 'red-with-symbol': (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) > 0 }, { 'green-with-symbol': (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) < 0 }]">
              {{ (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) }}%
            </span>
            <span v-else>-</span>
          </div>
          <div class="item">最高
            <span v-if="jit.length !== 0" :class="[{ 'red': isTodayHigher(jit.jit.highest) === 1 }, { 'green': isTodayHigher(jit.jit.highest) === -1 }]">
              {{ jit.jit.highest }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="item">漲跌
            <span v-if="jit.length !== 0" :class="[{ 'red-with-symbol': isTodayHigher(jit.jit.stock[1]) === 1 }, { 'green-with-symbol': isTodayHigher(jit.jit.stock[1]) === -1 }]">
              {{ (jit.jit.stock[1] - jit.daily.yesterday).toFixed(2) }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="item">最低
            <span v-if="jit.length !== 0" :class="[{ 'red': isTodayHigher(jit.jit.lowest) === 1 }, { 'green': isTodayHigher(jit.jit.lowest) === -1 }]">
              {{ jit.jit.lowest }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="item">總量 
            <span v-if="jit.length !== 0">{{ jit.jit.totalVolume }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <hr>
        <table class="five">
          <tr class="title">
            <td>量</td>
            <td>委買價</td>
            <td>委賣價</td>
            <td>量</td>
          </tr>
          <template v-if="jit.five">
            <tr v-for="(buyVolume, key) in jit.five.buyVolume" :key="key">
              <td>{{ buyVolume }}</td>
              <td :class="[{ 'red': isTodayHigher(jit.five.buyStock[key]) === 1 }, { 'green': isTodayHigher(jit.five.buyStock[key]) === -1 }]">{{ jit.five.buyStock[key] }}</td>
              <td :class="[{ 'red': isTodayHigher(jit.five.sellStock[key]) === 1 }, { 'green': isTodayHigher(jit.five.sellStock[key]) === -1 }]">{{ jit.five.sellStock[key] }}</td>
              <td>{{ jit.five.sellVolume[key] }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in 5" :key="item">
              <td v-for="item in 4" :key="item">-</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-basis: 80%;
  margin: 30px 20px;
}

.draw-block {
  flex-basis: 60%;
}

.draw-block-empty {
  flex-basis: 60%;
  background-color: #201330;
  text-align: center;
}

.detail-block {
  flex-basis: 40%;
  background-color: #9b8383;
  padding: 20px;
}

.detail-block .info {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.detail-block .info span {
  font-size: 16px;
  background-color: #734e5e;
  padding: 1px 2px;
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
