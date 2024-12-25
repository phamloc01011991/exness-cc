<script setup>
import { onMounted,ref,reactive,onUnmounted, computed} from 'vue'
import { defineProps } from 'vue'
const props = defineProps({
  name: String,
  data: Object,
  vitri:Number
});
const array = computed(()=> { return props} )
function convertString(inputString) {
  var arr = inputString.split("");
  var outputString = arr[0] + arr[1] + arr[2] + "/" + arr[3] + arr[4] + arr[5];
  return outputString;
}

// random nội dung bài 

function randomPercentageOffset(value) {
  var percentage = Math.random() * (0.08 - 0.04) + 0.01;  // Random từ 1% đến 5%
  var offset = value * percentage;
  var randomSign = Math.random() < 0.5 ? -1 : 1;  // Random dấu cộng hoặc trừ
  var randomNumber = randomSign * offset;
  var result = value + randomNumber;
  return result;
}


// zhangweiii
const idIntervalRandomSS = ref('');
const initialValue = props.data.lastdaily;

const initialChange = props.data.change2;

const dataSS = reactive({
    changeSS: initialChange,
    valueSS: initialValue
});

function reloadPriceSS() {
    idIntervalRandomSS.value = setInterval(()=>{
        var price = initialValue * (1 + ((Math.random() * 0.5 + 0.1) / 100) * (Math.random() < 0.5 ? -1 : 1));
        var percent = parseFloat(initialChange) + (Math.random() * (0.05 - 0.01) + 0.01) * (Math.random() < 0.5 ? -1 : 1);
        var per = parseFloat(randomPercentageOffset(percent)).toFixed(2);
        dataSS.changeSS = per > 0 ? "+"+per:per;
        dataSS.valueSS = parseFloat(randomPercentageOffset(price));
    },3000);
}
//
onMounted(()=>{
    reloadPriceSS();
})
onUnmounted(()=>{
    clearInterval(idIntervalRandomSS.value)
})


</script>
<template>
    <RouterLink :to="{ name: 'buy', params: { id: array.name } }" class="list-item list-data__title flex">
        <div class="name" style="width:35%"><div>{{ convertString(array.name) == 'AUD/USD' ? 'USD/VND' : convertString(array.name) }}</div>
            <div class="orther">Security data</div>
        </div>
        <div class="price" style="width:33%">
            <div>{{ parseFloat(dataSS.valueSS).toFixed(5) }}</div>
            <div class="usd-change">{{ parseFloat(dataSS.valueSS).toFixed(5) }}</div>
        </div>
        <div class="percent" style="width:32%"><a :class="[dataSS.changeSS > 0 ? 'btns btn-success' : 'btns btn-error']">{{ dataSS.changeSS }}%</a></div>
    </RouterLink>
</template>
<style scoped>
.list-item{
    color: var(--text-color);
    margin-bottom:15px;
    align-items: center;
}
.list-item .price{
    text-align:right;
}
.list-item .orther{
    font-size:11px;
    color: var(--text-sub-color);
}
.list-item .usd-change{
    color: var(--text-sub-color);
    font-size:11px;
}
.list-item .percent{
    text-align: end;
}
.list-item .btns{
    display: inline-block;
    border:none;
    height:32px;
    border-radius:5px;
    width:100px;
    line-height: 30px;
    text-align: center;
    color: #fff;
}
.list-item .btn-success{
    background:#24af6c;
}
.list-item .btn-error{
    background:#f14545;
}

</style>