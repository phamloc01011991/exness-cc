<template>
    <div class="item-slider">
        <h4>{{ convertString(name) == 'AUD/USD' ? 'USD/VND' : convertString(name) }}</h4>
        <p :class="[array.data.change2 > 0 ? 'price-success' : 'price-error']">
            <i :class="[array.data.change2 > 0 ? 'bx bxs-up-arrow ' : 'bx bxs-down-arrow']"></i><span>${{
            parseFloat(array.data.value).toFixed(5) }} </span>
        </p>
        <p :class="[array.data.change2 > 0 ? 'price-success' : 'price-error']">
            {{ array.data.change2 }}%
        </p>
    </div>
</template>
<script setup>
import request from '../../utils/request'
import { defineProps, onMounted, reactive, onUnmounted, ref, computed } from 'vue'
const props = defineProps({
    name: String,
    data: Object,
    vitri: Number
})
const array = computed(() => {
    return props
})
function convertString(inputString) {
    var arr = inputString.split('')
    var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
    return outputString
}
const price = reactive({})
async function getListSympol(symbol) {
    await request
        .get('coinList/live-exchange', {
            params: {
                symbols: symbol
            }
        })
        .then((res) => {
            price.usdt = parseFloat(res.data.data[0].data.value).toFixed(5)
            price.percent = res.data.data[0].data.change2
            // console.log(res.data)
        })
}
const idInterval = ref('')
function reloadPrice() {
    // setTimeout(()=>{
    //     idInterval.value = setInterval(()=>{
    //         getListSympol(props.name)
    //     },10000)
    // },props.vitri * 3000)
}
onMounted(() => {
    reloadPrice()
})
onUnmounted(() => {
    // clearInterval(idInterval.value)
})
</script>
<style scoped>
h4 {
    text-align: center;
}

.item-slider {
    width: calc((100%) / 3 - 5px);
    color: #dfdfdf;
    background: #002201;
    /* background: linear-gradient(to right, #bbc9bb, #1c1c1e); */
    padding: 10px 10px;
    box-shadow: 0px 0px 8px 0px #09320a;
    border: 1px solid #09320a;
    border-radius: 5px;
}

p {
    font-size: 13px;
    margin-left: 5px;
    margin-top: 3px;
    text-align: center;
}

p i {
    font-size: 8px;
    margin-right: 3px;
}

.price-success {
    color: #00be06;
}

.price-error {
    color: #ff463a;
}
</style>
