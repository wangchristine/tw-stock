<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, onMounted, computed } from "vue";
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
]);

provide(THEME_KEY, "dark");

const stockStore = useStockStore();

onMounted(() => {
  stockStore.fetchTodayHistoryApi(2330);
});

const stock = computed(() => stockStore.getTodayHistory.stock);
const tradingVolume = computed(() => stockStore.getTodayHistory.volume);

const chart = ref(null);

const option = ref({
  title: {
    text: "Dynamic Data",
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

      let tooltipContent = new Date(parseInt(params[0].name))
        .toTimeString()
        .split(" ")[0];
      params.forEach((item, idx) => {
        tooltipContent += "<br/>";
        tooltipContent += `${item.marker}${item.seriesName}: ${item.data[1]}`;
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
      bottom: "60%",
      containLabel: false,
    },
    {
      top: "60%",
      containLabel: false,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: {
        formatter: function (params) {
          return new Date(parseInt(params)).toTimeString().split(" ")[0];
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
        formatter: function (params) {
          return new Date(parseInt(params)).toTimeString().split(" ")[0];
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
      name: "Price",
      max: 30,
      max: 542.85,
      min: 444.15,
    },
    {
      gridIndex: 1,
      type: "value",
      name: "Amount",
      // max: 50,    // 註解讓它自動往上動態延展
      min: 0,
      axisPointer: { label: { precision: 0 } },
    },
  ],
  series: [
    {
      name: "Stock",
      type: "line",
      data: stock,
      itemStyle: { color: "#4CD964" },
      connectNulls: true,
    },
    {
      name: "Trading Volume",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: tradingVolume,
      itemStyle: { color: "#6997ab" },
    },
  ],
});

setInterval(function () {
  stockStore.updateTodayHistory(
    {
      stock: [(new Date()).valueOf(), (Math.random() * 500).toFixed(2)],
      volume: [(new Date()).valueOf(), Math.round(Math.random() * 10 + 150)],
    }
  );

  chart.value.setOption({
    series: [
      {
        data: stock.value
      },
      {
        data: tradingVolume.value
      }
    ]
  });
}, 5000);
</script>

<template>
  <v-chart class="chart" :option="option" autoresize ref="chart" />
</template>

<style scoped>
.chart {
  height: 100vh;
  /* temp */
  /* visibility: hidden; */
}
</style>
