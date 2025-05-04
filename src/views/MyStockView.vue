<script setup>
import { computed, onMounted, ref, watch } from "vue";
import JITStockCanvas from "@/components/JITStockCanvas.vue";
import MyStockSidebar from "@/components/MyStockSidebar.vue";
import { useStockStore } from "@/stores/stock";

const jitStockCanvas = ref(null);
const jitStock = ref(null);

const stockStore = useStockStore();

onMounted(async () => {
  if (favorites.value && favorites.value.length > 0) {
    stockStore.setSelectedStock(favorites.value[0]);
  }
  if (selectedStock.value.length > 0) {
    await stockStore.fetchJITApi(selectedStock.value.code, selectedStock.value.type);
  }
});

const jit = computed(() => stockStore.getJIT);
const favorites = computed(() => stockStore.getFavorites);
const selectedStock = computed(() => stockStore.getSelectedStock);
const isPrepareTodayHistory = computed(() => stockStore.getIsPrepareTodayHistory);
const isPrepareJIT = computed(() => stockStore.getIsPrepareJIT);

const fiveSubTotal = computed(() => {
  let sell = 0;
  let buy = 0;

  stockStore.getJIT.five.sellVolume.map((volume) => {
    sell += volume ? parseInt(volume) : 0;
  });

  stockStore.getJIT.five.buyVolume.map((volume) => {
    buy += volume ? parseInt(volume) : 0;
  });

  return { sell: sell, buy: buy };
});

watch(selectedStock, (stock) => {
  stockStore.fetchJITApi(stock.code, stock.type);
});

const togglePip = () => {
  jitStock.value.requestPictureInPicture();
};

const renderFinished = () => {
  if (jitStock.value.srcObject === null) {
    const canvas = jitStockCanvas.value.$el.querySelector("canvas");
    jitStock.value.srcObject = canvas.captureStream();
  }
};

const isTodayHigher = (compareValue) => {
  if (compareValue - jit.value.daily.yesterday > 0) {
    return 1;
  } else if (compareValue - jit.value.daily.yesterday === 0) {
    return 0;
  } else {
    return -1;
  }
};
</script>

<template>
  <main>
    <MyStockSidebar />
    <div class="container">
      <!-- 🤍💗🧡-->
      <div class="draw-block" v-if="jit.length !== 0">
        <JITStockCanvas ref="jitStockCanvas" @finished="renderFinished" />
        <video ref="jitStock" muted autoplay></video>
      </div>
      <div class="draw-block-empty" v-else-if="isPrepareTodayHistory || isPrepareJIT">正在努力讀取資料，請稍後...</div>
      <div class="draw-block-empty" v-else>請先選擇一檔股票後查看...</div>
      <div class="detail-block">
        <p class="info" v-if="jit.length !== 0">
          {{ selectedStock.fullName }}
          <span>{{ selectedStock.industry }}</span>
          <button class="secretly" @click="togglePip">防老闆 😎</button>
        </p>
        <p>
          資料時間：
          <span v-if="jit.length !== 0">{{
            new Date(jit.jit.stock[0]).toISOString().split("T")[0] +
            " " +
            new Date(jit.jit.stock[0]).toTimeString().split(" ")[0]
          }}</span>
          <span v-else>-</span>
        </p>
        <div class="price">
          <div class="item">
            <span class="title">成交</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                { red: isTodayHigher(jit.jit.stock[1]) === 1 },
                { green: isTodayHigher(jit.jit.stock[1]) === -1 },
              ]"
            >
              {{ jit.jit.stock[1] }}
            </span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">昨收</span>
            <span class="value" v-if="jit.length !== 0">{{ jit.daily.yesterday }}</span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">開盤</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                { red: isTodayHigher(jit.daily.start) === 1 },
                { green: isTodayHigher(jit.daily.start) === -1 },
              ]"
            >
              {{ jit.daily.start }}
            </span>
            <span class="value" v-else>-</span>
          </div>

          <div class="item">
            <span class="title">漲跌幅</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                {
                  'red-with-symbol':
                    (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) > 0,
                },
                {
                  'green-with-symbol':
                    (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) < 0,
                },
              ]"
            >
              {{ (((jit.jit.stock[1] - jit.daily.yesterday) / jit.daily.yesterday) * 100).toFixed(2) }}%
            </span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">最高</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                { red: isTodayHigher(jit.jit.highest) === 1 },
                { green: isTodayHigher(jit.jit.highest) === -1 },
              ]"
            >
              {{ jit.jit.highest }}
            </span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">漲跌</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                { 'red-with-symbol': isTodayHigher(jit.jit.stock[1]) === 1 },
                { 'green-with-symbol': isTodayHigher(jit.jit.stock[1]) === -1 },
              ]"
            >
              {{ (jit.jit.stock[1] - jit.daily.yesterday).toFixed(2) }}
            </span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">最低</span>
            <span
              v-if="jit.length !== 0"
              :class="[
                'value',
                { red: isTodayHigher(jit.jit.lowest) === 1 },
                { green: isTodayHigher(jit.jit.lowest) === -1 },
              ]"
            >
              {{ jit.jit.lowest }}
            </span>
            <span class="value" v-else>-</span>
          </div>
          <div class="item">
            <span class="title">總量</span>
            <span class="value" v-if="jit.length !== 0">{{ jit.jit.totalVolume.toLocaleString() }}</span>
            <span class="value" v-else>-</span>
          </div>
        </div>
        <hr />
        <table class="five">
          <tr class="title">
            <td>量</td>
            <td>委買價</td>
            <td>委賣價</td>
            <td>量</td>
          </tr>
          <template v-if="jit.five">
            <tr v-for="(buyVolume, key) in jit.five.buyVolume" :key="key">
              <td>{{ parseInt(buyVolume).toLocaleString() }}</td>
              <td
                :class="[
                  { red: isTodayHigher(jit.five.buyStock[key]) === 1 },
                  { green: isTodayHigher(jit.five.buyStock[key]) === -1 },
                ]"
              >
                {{ jit.five.buyStock[key] }}
              </td>
              <td
                :class="[
                  { red: isTodayHigher(jit.five.sellStock[key]) === 1 },
                  { green: isTodayHigher(jit.five.sellStock[key]) === -1 },
                ]"
              >
                {{ jit.five.sellStock[key] }}
              </td>
              <td>{{ parseInt(jit.five.sellVolume[key]).toLocaleString() }}</td>
            </tr>
            <tr class="sub-total">
              <td>{{ fiveSubTotal.buy.toLocaleString() }}</td>
              <td>小計</td>
              <td>小計</td>
              <td>{{ fiveSubTotal.sell.toLocaleString() }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in 5" :key="item">
              <td v-for="item in 4" :key="item">-</td>
            </tr>
            <tr class="sub-total">
              <td>-</td>
              <td>小計</td>
              <td>小計</td>
              <td>-</td>
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
  background-color: #2b1e2e;
  text-align: center;
}

.detail-block {
  flex-basis: 40%;
  background-color: #9b8383;
  padding: 20px;
  font-size: 18px;
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

.detail-block .info .secretly {
  float: right;
  border: 1px dashed #fff;
  border-radius: 5px;
  padding: 2px 5px;
  background-color: #53334c;
  color: #fff;
  cursor: pointer;
}

.detail-block .price {
  display: flex;
  flex-wrap: wrap;
  padding-top: 12px;
  color: #201330;
}

.detail-block .price .item {
  flex-basis: 50%;
  padding: 0 16px;
}

.detail-block .price .item .value {
  float: right;
  font-weight: bold;
}

.detail-block .five {
  width: 100%;
  text-align: center;
  color: #201330;
}

.detail-block .five td {
  font-weight: bold;
}

.detail-block .five .title td {
  font-weight: normal;
}

.red {
  color: #c31d23 !important;
}

.red-with-symbol {
  color: #c31d23 !important;
}

.red-with-symbol::before {
  content: "▲";
}

.green {
  color: #196a3e !important;
}

.green-with-symbol {
  color: #196a3e !important;
}

.green-with-symbol::before {
  content: "▼";
}

hr {
  margin: 5px auto;
}

video {
  /* visibility: hidden; */
  width: 0;
  height: 0;
  display: block;
}

@media (max-width: 1024px) {
  .container {
    flex-basis: 70%;
    flex-wrap: wrap;
  }

  .draw-block {
    flex-basis: 100%;
  }

  .draw-block-empty[data-v-2f3b16c5] {
    flex-basis: 100%;
    height: 100%;
  }

  .detail-block {
    flex-basis: 100%;
  }
}

@media (max-width: 768px) {
  .container {
    flex-basis: 100%;
  }
}
</style>
