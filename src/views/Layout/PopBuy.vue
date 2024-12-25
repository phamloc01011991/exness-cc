<script setup>
import { onMounted, ref, reactive, defineProps, watch, onUpdated } from 'vue'
import LangPopup from './LangPopup.vue'
import PopCircle from './PopCircle.vue'
import PopResult from './effect/result.vue'
import request from '../../utils/request'
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money'
import Depoint from '../Layout/person/depoit.vue';
import { languagePack } from '../../languages'

const networkErr = ref(true)
const showPopCircle = ref(false)
const showResult = ref(false)
const setTimeThread = ref(60)
const setMassDolar = ref(100)
const priceInitUSD = ref(0)
const setPercent = ref(70)
const setInfo = ref('')
const setOrder = ref('')
const balanceVND = ref(0)
const typeCommand = ref('long')
const showDepoit = ref(false)
const errCommon = ref('');
const err_time = ref('')
const err_balance = ref('')
watch(
  () => showPopCircle.value,
  (val) => {
    loadCheck()
  }
)
const theme = ref(localStorage.getItem('theme') || 'dark');
let resultData = reactive({})
async function setResultData() {
  try {
    let res = await request.get(
      'order_history/transaction_result?order_id=' + setOrder.value.newOrder.id
    )
    res = res.data
    if (res.success == true) {
      //set kết quả
      var result = res.dataNow
      resultData.percent = result.profit_percentage
      resultData.type = result.order_type
      resultData.product = props.name
      let win = result.order_result.trim() == 'win' ? true : false
      resultData.win = win
      resultData.percent_money = result.profit
      resultData.amount = result.amount
      return true
    }
  } catch (error) {
    networkErr.value = false

  }
}
// const emit = defineEmits(['close-popup', 'refreshListHistory'])
const closePopup = () => {
  emit('close-popup')
}

function setTime(session) {
  err_time.value = ''
  setTimeThread.value = session

  if (balanceVND.value  < 100000000 && session == 90) {
    err_time.value = languagePack.popbuy_err1
    setTimeThread.value = 60
    setTimeout(() => {
      err_time.value = ''
    }, 2000);
  } else if (balanceVND.value  < 1000000000 && session == 180) {
    err_time.value = languagePack.popbuy_err2
    setTimeThread.value = 60
    setTimeout(() => {
      err_time.value = ''
    }, 2000);
  } else if (balanceVND.value  < 1000000000 && session == 300) {
    err_time.value = languagePack.popbuy_err3
    setTimeThread.value = 60
    setTimeout(() => {
      err_time.value = ''
    }, 2000);
  } 
}

function convertString(inputString) {
  var arr = inputString.split('')
  var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
  return outputString
}
function formatNumber(num) {
  num = num.toString()
  while (num.charAt(0) === '0' && num.length > 1) {
    num = num.substr(1)
  }
  return num
}
function setMass(mass) {
  setMassDolar.value = formatNumber(mass)
}
async function getPriceInitUSD() {
  try {
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
    var data = await reponse.json()
    priceInitUSD.value = data.rates.VND
  } catch (error) {
    console.log('Lỗi đường truyền vui lòng thử lại sau ít phút', error)
  }
}
async function buyForex() {
  document.getElementsByClassName('buycf')[0].setAttribute('disabled', '')

  errCommon.value = ''

  if(setInfo.value.status == 5) {
    errCommon.value = languagePack.popbuy_err4
    return
  }


  await request
    .get('order_history/check_duplicate')
    .then(() => {
      console.log('ok')
    })
    .catch(() => {
      errCommon.value = languagePack.popbuy_err5
      document.getElementsByClassName('buycf')[0].removeAttribute('disabled', '')
      throw new Error('duplicate')
    })

  if (setTimeThread.value == 0) {
    return
  }

  resultData = {}
  //post data
  var res = await order()
  //end
 
  if(res) {
    showPopCircle.value = true
    setTimeout(async() => {
      await setResultData()
      if (networkErr.value == false) {
        showPopCircle.value = false
        console.log('Lỗi đường truyền, vui lòng thử lại !!!');
        return
      }else {
        setTimeout(() => {
          showPopCircle.value = false
          showResult.value = true
          console.log(showResult.value);
          // if (resultData.percent != undefined) {
          //   ////
          // }
        }, 5000)
      }
    }, setTimeThread.value * 1000)
  }

  // emit('refreshListHistory', setTimeThread.value)
}
function btnShowPopBuy(command) {
  // if (userLogined.value.status == 5) {
  //   notify({
  //     title: `Thất bại`,
  //     text: `Tài khoản của bạn đã bị khoá. Vui lòng liên hệ CSKH`,
  //     type: 'error'
  //   })
  // } else {
    
  // }
  typeCommand.value = command
  console.log(typeCommand.value);
}
async function order() {
  networkErr.value = true
  if (setMassDolar.value < 1) {
    errCommon.value = languagePack.popbuy_err6
    document.getElementsByClassName('buycf')[0].removeAttribute('disabled', '')
    return
  }

  if (setMassDolar.value > 1000000) {
    errCommon.value = languagePack.popbuy_err7
    document.getElementsByClassName('buycf')[0].removeAttribute('disabled', '')
    return
  }

  var res = await request.post('order_history/order', {
    product_name: props.name == 'AUDUSD' ? 'USDVND' : props.name,
    order_type: typeCommand.value,
    amount: parseFloat(setMassDolar.value).toFixed(2),
    order_duration: setTimeThread.value + 's'
  })

  if (res.data.success == true) {
    loadCheck()
    setPercent.value = res.data.newOrder.profit_percentage
    setOrder.value = res.data
    document.getElementsByClassName('buycf')[0].removeAttribute('disabled', '')
    return true
  } else {
    errCommon.value = res.data.message
    document.getElementsByClassName('buycf')[0].removeAttribute('disabled', '')
    return false
  }
}
async function loadCheck() {
  try {
    let user = localStorage.getItem('user')
    if (typeof user == 'string') {
      user = JSON.parse(user)
      await request
        .get('user/getUser', {
          params: {
            id: user.id
          }
        })
        .then((res) => {
          if (res.data.success === true) {
            setInfo.value = res.data
          }
        })
    } else {
      loadding.value = true
    }
  } catch (error) {
    console.log('Lỗi đường truyền vui lòng thử lại sau ít phút');
  }
}
const checkStatusUserDepoit = () => {
  // if (userLogined.value.status == 5) {
  //   notify({
  //     title: `Thất bại`,
  //     text: `Tài khoản của bạn đã bị khoá. Vui lòng liên hệ CSKH`,
  //     type: 'error'
  //   })
  // } else {
  //   showDepoit.value = true
  // }
  showDepoit.value = true
}

const props = defineProps({
  name: String,
  info: Object,
})

async function convertVND() {
  balanceVND.value = await usdToVnd(setInfo.value.balance)
}

onMounted(async () => {
  await getPriceInitUSD()
  await loadCheck()
  await convertVND()
})
</script>
<template>
  <div class="popbuy" :data-theme="theme">
    <div class="popbuy-content">
      <div class="wallet">
        <span class="kd">{{ languagePack.popbuy_avail }}</span>
         <span class="sd">{{ formatUsdt(setInfo.balance) }} USD</span>
         <span class="more"><i @click="checkStatusUserDepoit()" class='bx bx-plus-circle'></i></span>
      </div>
      
      <div class="btn-active">
        <span class="btns long" :class="typeCommand == 'long' ? 'l' : ''" @click="btnShowPopBuy('long')">{{ languagePack.popbuy_buy }}</span>
        <span class="btns short" :class="typeCommand == 'long' ? '' : 's'" @click="btnShowPopBuy('short')">{{ languagePack.popbuy_sell }}</span>
      </div>
      <div class="popbuy-center">
        <!-- <h3 style="font-size: 15px">
          {{ formLang.confirm }}
          {{ props.name == 'AUDUSD' ? 'USD/VND' : convertString(props.name) }}
        </h3> -->
        <div class="center-time">
          <div class="center-time__title">
            <h4>{{ languagePack.popbuy_section }}</h4>
          </div>
          <div class="center-time__body">
            <div
              :class="[
                setTimeThread == 60 ? 'center-time__object select' : 'center-time__object',
                setInfo.balance   >= 1 ? '' : 'order_command_disable'
              ]"
              @click="setTime(60)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              60 <span>{{ languagePack.popbuy_second }}</span> {{}}
            </div>
            <div
              :class="[
                setTimeThread == 90 ? 'center-time__object select' : 'center-time__object',
                balanceVND  >= 100000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(90)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              90 <span>{{ languagePack.popbuy_second }}</span>
            </div>
            <div
              :class="[
                setTimeThread == 180 ? 'center-time__object select' : 'center-time__object',
                balanceVND  >= 1000000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(180)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              180 <span>{{ languagePack.popbuy_second }}</span>
            </div>
            <div
              :class="[
                setTimeThread == 300 ? 'center-time__object select' : 'center-time__object',
                balanceVND  >= 3000000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(300)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              300 <span>{{ languagePack.popbuy_second }}</span>
            </div>
            <p class="err_time">
              {{ err_time }}
            </p>
          </div>
        </div>
        <div class="center-mass">
          <div class="center-mass__title">
            <h4>{{ languagePack.popbuy_volumn }}</h4>
          </div>
          <div class="center-mass__body">
            <div
              :class="[setMassDolar == 100 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(100)"
            >
              $100
            </div>
            <div
              :class="[setMassDolar == 500 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(500)"
            >
              $500
            </div>
            <div
              :class="[setMassDolar == 1000 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(1000)"
            >
              $1.000
            </div>
            <div
              :class="[
                setMassDolar != 100 && setMassDolar != 500 && setMassDolar != 1000
                  ? 'center-mass__object select'
                  : 'center-mass__object'
              ]"
              @click="setMass('')"
            >
             {{ languagePack.popbuy_more }}
            </div>
          </div>
          <div class="center-mass__body">
            <input
              @change="setMass(setMassDolar)"
              :placeholder="languagePack.popbuy_volumn_input"
              v-model="setMassDolar"
              type="number"
              class="center-mass__input"
              max="10000000"
            />
          </div>
          <p class="err_balance">
            {{ err_balance }}
          </p>
        </div>
        <p class="errCommon">{{ errCommon }}</p>
        <div class="center-confirm">
          <button class="buycf" :class = "typeCommand == 'long' ? 'long' : 'short'" @click="buyForex()">
            {{ languagePack.popbuy_order }} {{ typeCommand == 'long' ? languagePack.popbuy_buy1 : languagePack.popbuy_sell1 }}
          </button>
        </div>
      </div>
    </div>
    <div class="popbuy-top" v-if="showPopCircle">
        <div class="ct">
          <PopCircle :second="setTimeThread" :name="props.name" />
          <div class="info">
            <div class="info-title">
              {{ languagePack.popbuy_info_title }}
            </div>
            <div class="info-content flex">
              <div class="info-content__item">
                <div class="info-content__item__title">
                  {{ languagePack.popbuy_info_title1 }}
                </div>
                <div class="info-content__item__data" :class="typeCommand == 'long' ? `success` : `error`">
                  {{ typeCommand == 'long' ? `Mua` : `Bán` }}
                </div>
              </div>
              <div class="info-content__item">
                <div class="info-content__item__title">
                  {{ languagePack.popbuy_info_title2 }}
                </div>
                <div class="info-content__item__data">{{ setMassDolar }} USD</div>
              </div>
              <div class="info-content__item">
                <div class="info-content__item__title">Earnings</div>
                <div
                  :class="[
                    setPercent > 0
                      ? 'info-content__item__data success'
                      : 'info-content__item__data error'
                  ]"
                >
                  {{ setPercent }}%
                </div>
              </div>
            </div>
            <div class="info-mass flex">
              <div class="info-mass__name">
                {{ languagePack.popbuy_info_title3 }}:
                {{ props.name == 'AUDUSD' ? 'USD/VND' : convertString(props.name) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopResult :data="resultData" v-if="showResult" @close-popup="showResult = false" />
      <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
  </div>
</template>
<style scoped>
.err_time {
  font-size: 12px;
  color: #f14545;
}
.more {
  display: inline-block;
  margin-left: 5px;
}
.more i {
  font-size: 17px;
  display: block;
  font-weight: 700;
  color: #faa600;
}
.popbuy-content {
  padding-inline: 12px;
}
.wallet {
  padding: 5px 0;
  display: flex;
  align-items: center;
}
.wallet span {
  font-weight: 600;
}
.wallet .kd{
  color: var(--text-sub-color);
  font-size: 13px;
}
.wallet .sd {
  display: inline-block;
  margin-left: 7px;
}
.btns {
  display: inline-block;
  width: 35%;
  text-align: center;
  height: 33px;
  border-radius: 16.5px;
  line-height: 33px;
  background-color: var(--background-input);
  color: var(--text-sub-color);
  font-weight: 700;
}
.btn-active {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.btn-active .long {
  margin-right: 30px;
}
.btn-active .l{
  color: #fff;
  background-color: #24af6c;
}
.btn-active .s {
  color: #fff;
  background-color: #f14545;
  
}
.errCommon {
  color: #f14545;
  font-size: 12px;
  display: block;
  text-align: center;
  
}
.center-time__title h4{
  color: var(--text-sub-color);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
}
.center-mass__title h4 {
  font-size: 13px;
  color: var(--text-sub-color);
  font-weight: 600;
  margin-bottom: 5px;
}
.center-confirm {
  margin-top: 15px;
  text-align: center;
  
}
.center-confirm button {
  border-radius: 5px;
  color: #fff;
  border: none;
  height: 35px;
  line-height: 35px;
  font-weight: 700;
  width: 40%;
  border-radius: 16.5px;
  font-size: 14px;
}
.center-confirm .long {
background: #24af6c;
}
.center-confirm .short {
  background-color: #f14545;
}
/*  */
.popbuy-center {
  min-height: 150px;
  font-size: 14px;
}
.info {
  color: var(--text-color);
}
.flex {
  display: flex;
}
.center-time {
  text-align: start;
  margin-top: 5px;
}
.center-time__body {
  display: flex;
  flex-wrap: wrap;
}
.center-time__object {
  border: 1px solid var(--background-input);
  height: 33px;
  line-height: 33px;
  width: 80px;
  border-radius: 16.5px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: center;
}

.select {
  background: var(--background-input);
}
.center-mass {
  text-align: start;
  margin-top: 10px;
}
.center-mass__body {
  display: flex;
  margin-top: 10px;
  margin-bottom: 5px;
}
.center-mass__body input {
  width: 100%;
  height: 37px;
  border-radius: 18.5px;
  background-color: var(--background-input);
  font-size: 15px;
  font-weight: 600;
  padding-inline: 15px;
  color: var(--text-color);
}
.center-mass__title {
  margin-bottom: 5px;
}
.center-mass__object {
  padding: 5px 15px;
  border: 1px solid var(--background-input);
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-weight: 600;
  border-radius: 16.5px;
}

.center-mass__input {
  border: none;
  padding: 5px 10px;
  background: #414954;
  width: 70%;
  outline: none;
  color: #dfdfdf;
}
.center-balence {
  text-align: start;
  margin: 15px 0px;
}

.popbuy-bottom {
  font-size: 13px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.popbuy-bottom__label {
  width: 50%;
  text-align: center;
}
.info {
  margin-top: 20px;
}
.info-content {
  margin-top: 20px;
}
.info-content__item {
  width: 33%;
  text-align: center;

}
.info-content__item div {
  line-height: 30px;
  font-weight: 500;
}
.info-mass {
  justify-content: center;
}
.info-mass__name {
  display: block;
  font-weight: 500;
  margin-top: 10px;
  text-align: center;
}
.success {
  color: #16ba0c;
}
.error {
  color: #da2828;
}
.center-time__object i {
  display: none;
}
.order_command_disable {
  border-color: gray;
  background-color: gray;
  opacity: 0.5;
  position: relative;
}
.order_command_disable i {
  display: block;
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 9;
}
.popbuy-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999999;
}
.popbuy-top .ct {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 400px;
  width: 90%;
  background: var(--background-color);
  border-radius: 10px;
  padding: 30px 20px;
  color: var(--text-color);
  box-shadow: 0 0 1px 1px var(--background-color);
}
.info-title {
  text-align: center;
  font-weight: 500;
}
.popbuy-top > i {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
