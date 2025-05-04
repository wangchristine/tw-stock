<script setup>
import { computed, onMounted, ref } from "vue";
import { useStockStore } from "@/stores/stock";

const stockStore = useStockStore();

const keyword = ref(null);
const resultList = ref([]);

onMounted(async () => {
  await stockStore.setFavorites();
  await stockStore.fetchStockExchangesApi();
  await stockStore.fetchOverCountersApi();
});

const selectedType = ref("tse");
const favorites = computed(() => stockStore.getFavorites);
const selectedStock = computed(() => stockStore.getSelectedStock);

const searchByKeyword = () => {
  if (selectedType.value === "tse") {
    resultList.value = stockStore.getStockExchanges(keyword.value);
  } else {
    // otc
    resultList.value = stockStore.getOverCounters(keyword.value);
  }
};

const addFavorite = (isFavorite, data) => {
  stockStore.setFavorite(isFavorite, {
    type: selectedType.value,
    code: data.code,
    fullName: data.fullName,
    name: data.name,
    industry: data.industry,
  });
};

const selectStock = (stock) => {
  stock.type = selectedType.value;
  stockStore.setSelectedStock(stock);
};

const changeType = () => {
  keyword.value = null;
};
</script>

<template>
  <div class="sidebar">
    <div class="search-block">
      <h3>搜尋公司</h3>
      <div class="type-block">
        <input type="radio" name="type" id="tse" value="tse" v-model="selectedType" @change="changeType()" checked />
        <label class="text" for="tse">上市</label>
        <input type="radio" name="type" id="otc" value="otc" v-model="selectedType" @change="changeType()" />
        <label class="text" for="otc">上櫃</label>
      </div>
      <div class="code-block">
        <input
          type="text"
          class="code"
          maxlength="6"
          placeholder="輸入股票代號..."
          v-model.trim="keyword"
          @input="searchByKeyword()"
        />
        <div class="code-list" v-show="keyword">
          <ul>
            <li
              v-for="(result, key) in resultList"
              :key="key"
              @click="selectStock(result)"
              :class="[{ selected: selectedStock.code === result.code }]"
            >
              {{ result.code }} {{ result.name }}
              <span v-if="result.isFavorite" @click.stop="addFavorite(false, result)">💗</span>
              <span v-else @click.stop="addFavorite(true, result)">🤍</span>
            </li>
            <li v-if="resultList.length === 0">查無資料</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="favorite-block">
      <h3>自選股</h3>
      <div v-if="favorites.length === 0">No Data</div>
      <ul>
        <li
          v-for="(item, key) in favorites"
          :key="key"
          @click="selectStock(item)"
          :class="[{ selected: selectedStock.code === item.code }]"
        >
          <span class="type">{{ item.type === "tse" ? "上市" : "上櫃" }}</span>
          {{ item.code }} {{ item.name }}
          <span class="icon" @click.stop="addFavorite(false, item)">💗</span>
        </li>
      </ul>
    </div>
  </div>
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

.search-block .type-block {
  width: 100%;
  display: inline-block;
}

.search-block .type-block input[type="radio"] {
  display: none;
  opacity: 0;
  height: 0;
  width: 0;
}

.search-block .type-block .text {
  display: inline-block;
  cursor: pointer;
  background-color: #b5b5b5;
  width: 50%;
  padding: 5px;
  text-align: center;
}

.search-block .type-block input[type="radio"]:checked + .text {
  background-color: #714f5f;
  color: #fff;
}

.search-block .code-block {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}

.search-block .code-block .code {
  width: 100%;
  border-radius: 10px;
  border: 0;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #eee;
}

.search-block .code-block .code-list {
  background-color: #d9c9c9;
  border: #999 1px solid;
  height: 200px;
  overflow-y: auto;
  color: #000;
  margin-top: 10px;
  border-radius: 0 0 10px 10px;
}

.search-block .code-block .code-list ul {
  padding: 0;
}

.search-block .code-block .code-list ul li {
  list-style: none;
  padding: 5px 10px;
  border-bottom: #999 1px solid;
  cursor: default;
}

.search-block .code-block .code-list ul li:last-of-type {
  border: 0;
}

.search-block .code-block .code-list ul li.selected {
  background-color: #53334c;
  color: #fff;
}

.search-block .code-block .code-list ul li span {
  float: right;
  cursor: pointer;
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
  cursor: default;
}

.favorite-block ul li.selected {
  background-color: #53334c;
  color: #fff;
}

.favorite-block ul li:last-child {
  border-bottom: none;
}

.favorite-block ul li .type {
  background-color: #714f5f;
  color: #fff;
  padding: 1px 3px;
}

.favorite-block ul li .icon {
  float: right;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .sidebar {
    flex-basis: 30%;
  }
}

@media (max-width: 768px) {
  .sidebar {
    flex-basis: 100%;
  }
}
</style>
