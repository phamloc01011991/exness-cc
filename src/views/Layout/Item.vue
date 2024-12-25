<script setup>
import { onMounted,ref,reactive,onUnmounted, computed} from 'vue'
import { defineProps } from 'vue'
import request from '../../utils/request'

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
async function getListSympol(symbol){
    await request.get('coinList/live-exchange', {
        params: {
            "symbols": symbol
        }
    }).then(res => {
        price.usdt = parseFloat(res.data.data[0].data.value).toFixed(5)
        price.percent = res.data.data[0].data.change2
    })
}
const price = reactive({})
const idInterval = ref('')
const idIntervalRandom = ref('')
function reloadPrice(){
    // console.log(props.vitri)
    idIntervalRandom.value = setInterval(()=>{
        // Tạo hàm random ''
        var price = props.data.value
        var percent = props.data.change2
        // console.log("check percent: ", percent);
        // array.value.data.change2 = 1
        var per = parseFloat(randomPercentageOffset(percent)).toFixed(2)
        array.value.data.change2 = per > 0 ? "+"+per:per
        array.value.data.value = parseFloat(randomPercentageOffset(price))
        // console.log(array.value.data.value)
    },3000)
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


onMounted(()=>{
    reloadPrice();
})
onUnmounted(()=>{
    clearInterval(idInterval.value)
    clearInterval(idIntervalRandom.value)
})


</script>
<template>
    <RouterLink :to="{ name: 'buy', params: { id: array.name } }" class="list-item list-data__title flex">
        <div class="name" style="width:35%"><div>{{ convertString(array.name) == 'AUD/USD' ? 'USD/VND' : convertString(array.name) }}</div>
            <div class="orther">Security data</div>
        </div>
        <div class="price" style="width:33%;">
            <div :class="[array.data.change2 > 0 ? 'pdown' : 'pup']">{{ parseFloat(array.data.value).toFixed(5) }}</div>
            <div class="usd-change">{{ parseFloat(array.data.value).toFixed(5) }}$</div>
        </div>
        <div class="percent" style="width:32%"><button :class="[array.data.change2 > 0 ? 'btns btn-success' : 'btns btn-error']">{{ array.data.change2 }}%</button></div>
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