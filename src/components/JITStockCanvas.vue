<script setup>
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref, provide, computed, onMounted, onUnmounted } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { isWorkday, isBeforeNine, isOverThirteenHalf } from "@/commons/datetime";
import { useStockStore } from "@/stores/stock";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
]);

provide(THEME_KEY, "dark");

const stockStore = useStockStore();

onMounted(async () => {
  await stockStore.fetchTodayHistoryApi(selectedStock.value.code);
});

const stock = computed(() => stockStore.getTodayHistory.stock);
const tradingVolume = computed(() => stockStore.getTodayHistory.volume);
const jit = computed(() => stockStore.getJIT);
const selectedStock = computed(() => stockStore.getSelectedStock);

const chart = ref(null);
const option = ref({
  backgroundColor: "#2b1e2e",
  title: {
    text: selectedStock.value.code + " " + selectedStock.value.name,
    textStyle: {
      fontSize: 20,
    },
    padding: 10,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#283b56",
      },
    },
    formatter: function (params) {
      params.sort((a, b) => {
        return a.seriesIndex > b.seriesIndex ? 1 : -1;
      });

      let tooltipContent =
        new Date(parseInt(params[0].name)).getHours().toString().padStart(2, "0") +
        ":" +
        new Date(parseInt(params[0].name)).getMinutes().toString().padStart(2, "0");
      params.forEach((item, idx) => {
        tooltipContent += "<br/>";
        if (idx === 0 && typeof item.data[1] === "number") {
          tooltipContent += `${item.marker}${item.seriesName} ${item.data[1].toFixed(2)}`;
        } else {
          tooltipContent += `${item.marker}${item.seriesName} ${parseInt(item.data[1]).toLocaleString()}`;
        }
      });
      return tooltipContent;
    },
  },
  axisPointer: {
    link: { xAxisIndex: "all" },
  },
  legend: {
    show: false,
  },
  grid: [
    {
      top: "12%",
      bottom: "50%",
      left: "7%",
      right: "7%",
      containLabel: false,
    },
    {
      top: "61%",
      bottom: "10%",
      left: "7%",
      right: "7%",
      containLabel: false,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: {
        formatter: function (value) {
          return (
            new Date(parseInt(value)).getHours().toString().padStart(2, "0") +
            ":" +
            new Date(parseInt(value)).getMinutes().toString().padStart(2, "0")
          );
        },
      },
      axisPointer: {
        label: { show: false },
      },
    },
    {
      gridIndex: 1,
      type: "category",
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: {
        formatter: function (value) {
          return (
            new Date(parseInt(value)).getHours().toString().padStart(2, "0") +
            ":" +
            new Date(parseInt(value)).getMinutes().toString().padStart(2, "0")
          );
        },
      },
      axisPointer: {
        label: { show: false },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "成交價",
      nameTextStyle: {
        fontSize: 16,
      },
      max: jit.value.daily.max,
      min: jit.value.daily.min,
      axisLabel: {
        formatter: function (value) {
          return value.toFixed(2);
        },
      },
    },
    {
      gridIndex: 1,
      type: "value",
      name: "成交量",
      nameTextStyle: {
        fontSize: 16,
      },
      // max: 50,    // 註解讓它自動往上動態延展
      min: 0,
      axisPointer: { label: { precision: 0 } },
    },
  ],
  series: [
    {
      name: "價格",
      type: "line",
      data: stock,
      itemStyle: { color: "#d46a6a" },
      connectNulls: true,
      markLine: {
        symbol: "none",
        data: [
          {
            name: "Closed Price",
            yAxis: jit.value.daily.yesterday,
            lineStyle: { color: "#ffc069" },
          },
        ],
        label: {
          formatter: function (value) {
            return value.value;
          },
        },
        emphasis: {
          disabled: true,
        },
      },
    },
    {
      name: "量",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: tradingVolume,
      itemStyle: { color: "#597ea8" },
    },
  ],
});

const timer = setInterval(async () => {
  // if is not workday or not in 9:00 ~ 13:30
  if (!isWorkday() || isBeforeNine() || isOverThirteenHalf()) {
    clearInterval(timer);
  } else {
    await stockStore.fetchJITApi(selectedStock.value.code, selectedStock.value.type);

    stockStore.updateTodayHistory({
      stock: [...jit.value.jit.stock],
      volume: [...jit.value.jit.volume],
    });

    chart.value.setOption({
      series: [
        {
          data: stock.value,
        },
        {
          data: tradingVolume.value,
        },
      ],
    });
  }
}, 5000);

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <v-chart class="chart" :option="option" autoresize ref="chart" />
</template>

<style scoped>
.chart {
  max-height: calc(100vh - 120px);
  min-height: 500px;
}
</style>
