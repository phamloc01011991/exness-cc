<template>
    <div class="item-slider">
        <h4>{{ convertString(name) == 'AUD/USD' ? 'USD/VND' : convertString(name) }}</h4>
        <p><i :class="[dataSS.changeSS > 0  > 0 ? 'bx bxs-up-arrow' : 'bx bxs-down-arrow']"></i><span>${{ parseFloat(dataSS.valueSS).toFixed(5) }} </span></p>
        <p :class="[dataSS.changeSS > 0 ? 'price-success' : 'price-error']">
            {{ dataSS.changeSS }}%
        </p>
    </div>
</template>
<script setup>
import request from '../../utils/request'
import { defineProps,onMounted,reactive,onUnmounted,ref,computed } from 'vue'
const props = defineProps({
  name: String,
  data: Object,
  vitri:Number
});
const array = computed(()=> {return props} )
//zhangwei
const idIntervalRandomSS = ref('');
const initialValue = props.data.lastdaily;
const initialChange = props.data.change2;
const dataSS = reactive({
    changeSS: initialChange,
    valueSS: initialValue
});
;

function randomPercentageOffset(value) {
  var percentage = Math.random() * (0.08 - 0.04) + 0.01;  // Random từ 1% đến 5%
  var offset = value * percentage;
  var randomSign = Math.random() < 0.5 ? -1 : 1;  // Random dấu cộng hoặc trừ
  var randomNumber = randomSign * offset;
  var result = value + randomNumber;
  return result;
}

function reloadPriceSS() {
    idIntervalRandomSS.value = setInterval(()=>{
        var price = initialValue * (1 + ((Math.random() * 0.5 + 0.1) / 100) * (Math.random() < 0.5 ? -1 : 1));
        // var percent = ((price - initialValue)/initialValue)*100;
        var percent = parseFloat(initialChange) + (Math.random() * (0.05 - 0.01) + 0.01) * (Math.random() < 0.5 ? -1 : 1);
        var per = parseFloat(randomPercentageOffset(percent)).toFixed(2);
        dataSS.changeSS = per > 0 ? "+"+per:per;
        dataSS.valueSS = parseFloat(randomPercentageOffset(price));
    },3000);
}



function convertString(inputString) {
  var arr = inputString.split("");
  var outputString = arr[0] + arr[1] + arr[2] + "/" + arr[3] + arr[4] + arr[5];
  return outputString;
}
const price = reactive({})
async function getListSympol(symbol){
    await request.get('coinList/live-exchange', {
        params: {
            "symbols": symbol
        }
    }).then(res => {
        price.usdt = parseFloat(res.data.data[0].data.value).toFixed(5)
        price.percent = res.data.data[0].data.change2
        // console.log(res.data)
    })
}
const idInterval = ref('')
function reloadPrice(){
    // setTimeout(()=>{
    //     idInterval.value = setInterval(()=>{
    //         getListSympol(props.name)
    //     },10000)
    // },props.vitri * 3000)
}
onMounted(()=>{
    reloadPrice()
    reloadPriceSS();
})
onUnmounted(()=>{
    // clearInterval(idInterval.value)
})
</script>
<style scoped>
h4 {
    text-align: center;
}
    .item-slider{
        width:calc((100%)/3 - 5px);
        color:#dfdfdf;
        background: #002201;
        /* background: linear-gradient(to right, #bbc9bb, #1c1c1e); */
        padding:10px 10px;
        border: 1px solid #09320a;
        box-shadow: 0px 0px 8px 0px #09320a;
        border-radius:5px;
    }
    p{
        font-size:13px;
        margin-left:5px;
        margin-top:3px;
        text-align: center;
    }
    p i{
        font-size:8px;
        margin-right:3px;
    }
    .price-success{
        color:#00e100;
    }
    .price-error{
        color:red;
    }
</style>