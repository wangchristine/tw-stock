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
  MarkLineComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed } from "vue";
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
stockStore.fetchTodayHistoryApi(2330);

const stock = computed(() => stockStore.getTodayHistory.stock);
const tradingVolume = computed(() => stockStore.getTodayHistory.volume);
const jit = computed(() => stockStore.getJIT);

const chart = ref(null);
const option = ref({
  backgroundColor: "#1e1432",
  title: {
    text: "Dynamic Data",
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
      top: "12%",
      bottom: "50%",
      left: "6%",
      right: "5%",
      containLabel: false,
    },
    {
      top: "60%",
      left: "6%",
      right: "5%",
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
      name: "成交價",
      nameTextStyle: {
        fontSize: 16
      },
      max: jit.value.daily.max,
      min: jit.value.daily.min,
    },
    {
      gridIndex: 1,
      type: "value",
      name: "成交量",
      nameTextStyle: {
        fontSize: 16
      },
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
      markLine: {
        symbol: "none",
        data: [{
          name: 'Closed Price',
          yAxis: jit.value.daily.yesterday,
          lineStyle: { color: "#e18a53" }
        }],
      },
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

const timer = setInterval(() => {
  stockStore.updateTodayHistory(
    {
      stock: [...jit.value.jit.stock],
      volume: [...jit.value.jit.volume],
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
