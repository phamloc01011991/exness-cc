<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import Depoint from '../../Layout/person/depoit.vue';
import { formatUsdt } from '../../../utils/money'
const theme = ref(localStorage.getItem('theme') || 'dark');;
const usdDefault = ref(0)
const percentDefault = ref(0)
const bonusDefault = ref(0)
const timeDefault = ref(30)
const showDepoit = ref(false)
const USDprice = ref(0)
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
const checkStatusUserDepoit = () => {
  showDepoit.value = true
}
const props = defineProps({
  config: Object
})

async function RateVND() {
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT');
    var data =await reponse.json();
    return USDprice.value = data.rates.VND;
}


function caculate() {
    for(let i=props.config.length-1; i>=0; i--) {
        if(usdDefault.value > props.config[i].value/USDprice.value) {
            bonusDefault.value = usdDefault.value*props.config[i].percent/100*timeDefault.value
            percentDefault.value = props.config[i].percent*30
            return
        } else {
            bonusDefault.value = 0
            percentDefault.value = 0
        }
    }
}

onMounted(async () => {
    await RateVND();
    caculate()
})
</script>
<template>
    <div class="popbuy" :data-theme="theme">
        <div class="popbuy-content">
          <div class="top">
            <div class="ct">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <h4>{{ languagePack.invest_caculate_title }}</h4>
            </div>
          </div>
          <div class="wr">
            <div class="caculator">
            <span class="l">{{ languagePack.invest_caculate_profit }} {{ timeDefault }} {{ languagePack.invest_caculate_profit_date }}</span>
            <span class="tt">+{{ formatUsdt(parseFloat(bonusDefault).toFixed(2)) }} USD</span>
            <span class="ttl">({{percentDefault}}%/{{ languagePack.invest_caculate_profit_month }})</span>
            <div class="imgab">
                <img class="img1" src="../../../assets/dollar-symbol2.png" alt="">
                <img class="img2" src="../../../assets/dollar-symbol.png" alt="">
            </div>
          </div>
          <div class="caculate">
            <div class="form-control" style="margin-bottom: 20px;">
                <label for="v">{{ languagePack.invest_caculate_amount_invest }}</label>
                <div class="form-input">
                    <input type="number" id="v" v-model="usdDefault" @input="caculate">
                    <span>USD</span>
                </div>
            </div>
            <div class="form-control">
                <label for="t">{{ languagePack.invest_caculate_time }}</label>
                <div class="form-input">
                    <input type="number" id="t" v-model="timeDefault" @input="caculate">
                    <span>{{ languagePack.invest_caculate_time_date }}</span>
                </div>
            </div>
          </div>
          <div class="detail">
            <div class="vol fl">
                <span class="sp1">{{ languagePack.invest_caculate_volume }}</span>
                <span class="sp2">{{ formatUsdt(parseFloat(usdDefault).toFixed(2)) }} USD</span>
            </div>
            <div class="apy fl">
                <span class="sp1">MPY</span>
                <span class="sp2">{{ percentDefault }}%/tháng</span>
            </div>
            <div class="time fl">
                <span class="sp1">{{ languagePack.invest_caculate_time }}</span>
                <span class="sp2">{{ timeDefault }} ngày</span>
            </div>
          </div>
          <div class="bottom">
            <button class="btn-login" @click="closePopup">Đóng</button>
            <button class="btn-register" @click="checkStatusUserDepoit()">{{ languagePack.invest_caculate_buy }} USD</button>
          </div>
        </div>
          </div>
        <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
    </div>
</template>
<style scoped>
.img {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}
.wr {
    padding-inline: 12px;
}
.popbuy {
    position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  z-index: 999999999;
  overflow-y: scroll;
  padding-bottom: 100px !important;
  background: var(--background-overall);
}
.popbuy-content .top {
    background: var(--background-sub);
  padding: 45px 12px 5px 12px;
  margin-bottom: 50px;
}
.popbuy-content .top .ct{
  display: flex;
}
.popbuy-content .top .back {
  font-size: 23px;
}
.popbuy-content .top h4 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
  font-size: 17px;
}
.caculator {
    padding: 15px;
    background-color: var(--background-color);
    border-radius: 5px;
    position: relative;
}
.caculator span {
    display: block;
    
}
.caculator .l {
    font-size: 13px;
    color: var(--text-sub-color);
    font-weight: 500;
}
.caculator .tt {
    font-size: 23px;
    font-weight: bold;
    letter-spacing: 0.3px;
    color: #24af6c;
    margin-block: 10px;
}
.caculator .ttl {
    font-size: 13px;
    color: #24af6c;
    font-weight: 500;
    letter-spacing: 0.3px;
}
.imgab {
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
}
.imgab img {
    width: 40px;
}
.imgab .img1 {
    top: 10px;
}
.caculate {
    margin-top: 20px;
}
.caculate .form-control label {
    font-size: 13px;
    color: var(--text-sub-color);
    font-weight: 500;
    text-transform: uppercase;
}
.caculate .form-control .form-input {
    position: relative;
    border-bottom: 1px solid rgba(128, 128, 128, 0.244);
    padding-block: 6px;
}
.caculate .form-control .form-input input {
    display: block;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    outline: none;
    color: var(--text-color);
    font-size: 21px;
    font-weight: 500;
}
.caculate .form-control .form-input span {
    display: inline-block;
    color: var(--text-sub-color);
    font-size: 18px;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 500;
}
.detail {
    margin-top: 30px;
    padding: 15px;
    background-color: var(--background-color);
    border-radius: 5px;
    position: relative;
}

.detail .fl {
    display: flex;
    justify-content: space-between;
    
}
.detail .fl span {
    font-weight: 500;
}
.detail .fl .sp1 {
    color: var(--text-sub-color);
}
.detail .fl:not(:last-child) {
    margin-bottom: 5px;
}
.bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
.bottom button {
    display: block;
    height: 35px;
    width: calc(50% - 10px);
    border-radius: 5px;
    font-weight: 600;
}
.btn-register {
  background-color: #faa600;
  color: #001a00;
  border: none;
}
.btn-login {
    background: none;
  color: var(--text-color);
  border: 1px solid var(--text-sub-color);
}

</style>
