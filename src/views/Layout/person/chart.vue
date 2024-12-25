<script setup>
import { ref } from 'vue'

import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

const props = defineProps({
  listAnnalys: Array
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const theme = ref(localStorage.getItem('theme') || 'dark');
// Define data and options as reactive properties
const chartData = ref({});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
});

// Initialize chart data
chartData.value = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    borderColor: '#faa600',
    pointBackgroundColor: 'white',
    borderWidth: 1.5,
    pointBorderColor: false,
    data: props.listAnnalys
  }]
};
</script>

<template>
     <div class="chart" :data-theme="theme">
        <Line :data="chartData" :options="chartOptions" />
      </div>
</template>

<style scoped>
    
</style>
