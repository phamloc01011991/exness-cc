<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import request from '../../../utils/request'
import { formatUsdt, usdToVnd, formatVnd, vndToUsd } from '../../../utils/money'
import SupportDepoint from './SupportDepoint.vue';
import { languagePack } from '../../../languages';
let resultData = reactive({})
const priceUSD = ref()
const amount = ref(0)
const noty = ref('0')
const emit = defineEmits(['close-popup'])
const bankData = ref('')
const amountUsd = ref()
const err_depoint = ref('')
const err_depoint1_check = ref(false)
const err_depoint1 = ref('Bạn có lệnh mua USD đang chờ duyệt.')
const theme = ref(localStorage.getItem('theme') || 'dark');
const showSupportDepoint = ref(false);
async function getPriceUSD() {
  var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
  var data = await reponse.json()
  priceUSD.value = data.rates.VND
}

const code = ref('')
const datetime = ref('')
async function depointAmount() {
  document.getElementsByClassName('btn button')[0].disabled = true;
  err_depoint.value = ''
  err_depoint1_check.value = false
  if (amount.value < 1000000) {
    err_depoint.value = languagePack.person_depoint_err1
    document.getElementsByClassName('btn button')[0].disabled = '';
    return
  }
  if (amount.value > 10000000000) {
    err_depoint.value = languagePack.person_depoint_err2
    document.getElementsByClassName('btn button')[0].disabled = '';
    return
  }
  const list = await request.get('user/get_trans_history', {
    params: {
      typeTransaction: 'toup'
    }
  })
  if (list.data.data.length > 0 && list.data.data[0].status == 'pending') {
    err_depoint1_check.value = true
    document.getElementsByClassName('btn button')[0].disabled = '';
    return
  }
  var res = await request.post('user/topup-trans', {
    amount: amount.value
  })
  var result = res.data
  amountUsd.value = (await vndToUsd(amount.value)).toFixed(3)
  noty.value = result
  code.value = result.transaction.code
  datetime.value = result.transaction.createdAt
}

function changeDate(inputDateTime = "") {
        // Tạo đối tượng Date từ chuỗi đầu vào
    const dateObj = new Date(inputDateTime);
    // Cộng thêm 7 giờ
    dateObj.setUTCHours(dateObj.getUTCHours() + 7);
    // Lấy thông tin giờ, phút và giây
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getUTCSeconds();
    // Lấy ngày, tháng và năm
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
    const year = dateObj.getUTCFullYear();
    // Tạo chuỗi kết quả
    const outputDateTime = `${day
        .toString()
        .padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year} ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} `;
    // console.log(outputDateTime); // Kết quả: 07:22:58 24-05-2023
    return outputDateTime;
}

const closePopup = () => {
  emit('close-popup')
}


onMounted(() => {
  //get bank
  getPriceUSD()
  // document.getElementsByClassName("btn-login")[0].setAttribute('disabled', false);
})
</script>
<template>
  <div class="popbuy" :data-theme="theme">
    <div :class="[noty == 0 ? 'popbuy-content' : 'popbuy-content result-content']">
      <div class="top">
        <div class="ct">
          <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
          <h4>{{ languagePack.person_depoint_title }}</h4>
        </div>
      </div>
      <div class="popbuy-center">
        <div class="center-time">
          <div class="form-input">
            <div class="form-control">
              <input placeholder="VND"  type="number" v-model="amount"/>
            </div>
          </div>
          <p class="sub"><span>{{ languagePack.person_depoint_sub_recieve }}≈</span>{{ formatUsdt(amount / priceUSD) }} USD</p>
        </div>
      </div>
      <p class="form-err">{{ err_depoint }}</p>
      <p class="form-err" v-if="err_depoint1_check">{{ err_depoint1 }}</p>
      <div class="price">1 USD ≈ {{ formatUsdt(priceUSD) }} <i @click="showSupportDepoint = true" class='bx bx-help-circle' ></i></div>
      <div class="note">
        <div>{{ languagePack.person_depoint_fee }}: 0 VND</div>
        <div>{{ languagePack.person_depoint_min }}</div>
        <div>{{ languagePack.person_depoint_max }}</div>
      </div>
      <div class="center-confirm">
        <button class="btn button" @click="depointAmount()">
          {{ languagePack.person_depoint_btndepoint }}
      </button>
      </div>
      <div class="notifi-done" v-if="noty != 0">
        <div class="noti-sc">
          <i class='bx bx-check-circle' ></i>
          <p class="noty">{{ languagePack.person_depoint_done_noti1 }}. <br>{{ languagePack.person_depoint_done_noti2 }} ! </p>
          <div class="detail">
            <div class="item">
              <span class="left">{{ languagePack.person_depoint_done_time }}</span>
              <span class="right">{{ changeDate(datetime) }} </span>
            </div>
            <div class="item">
              <span class="left">{{ languagePack.person_depoint_done_code }}</span>
              <span class="right">{{ code }}</span>
            </div>
          </div>
          <div class="money">
            <button class="" @click="closePopup()">
              {{ languagePack.person_depoint_done_close }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <SupportDepoint v-if="showSupportDepoint" @close-popup="showSupportDepoint = false"/>
  </div>
</template>
<style scoped>
.detail {
  margin-bottom: 20px;
  margin-top: 30px;
}
.detail .item {
  display: flex;
  justify-content: space-between;
  margin-block: 10px;
}
.detail .item .left {
color: var(--text-sub-color);
}
.img {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}

/* noti */
.notifi-done {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.noti-sc {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  text-align: center;
  background-color: var(--background-sub);
  min-height: 325px;
  border-radius: 5px 5px 0 0;
  padding: 25px 12px 45px 12px;
  z-index: 999999999;
}



.money button {
  display: block;
  color: var(--text-color);
  border: 1px solid var(--text-sub-color);
  height: 36px;
  line-height: 36px;
  width: 100%;
  text-align: center;
  border-radius: 5px;
  background: none;
  font-weight: 600;
}

.noty {
  line-height: 25px;
}

/*  */
.popbuy {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding-bottom: 75px;
  z-index: 99999;
  overflow-y: scroll;
  background: var(--background-color);
  overflow-x: hidden;
  color: var(--text-color);
}

.popbuy-content {

  position: relative;
}

.popbuy-content .top {
  padding: 40px 12px 5px 12px;
  background: var(--background-sub);
}

.popbuy-content .top .ct {
  position: relative;
}

.popbuy-content .top .ct h4 {
  font-weight: 600;
  font-size: 17px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.popbuy-content .top .back {
  font-size: 25px;
}



.popbuy-center {
  margin-top: 40px;
  border-radius: 5px;
  padding: 40px 10px;
  background: var(--background-input);
  margin-inline: 12px;
}


.center-confirm .center-balence__btn {
  padding: 7px 30px;
  border: none;
}

h4 {
  padding: 0px 20px;
}



.form-input {
  position: relative;
  margin-bottom: 5px;
  border-radius: 3px;
  text-align: center;
}


.form-control {
  display: inline-block;
  position: relative;
  width: 100%;
}
input {
  background: none;
  border: none;
  outline: none;
  font-size: 45px;
  font-weight: 800;
  color: var(--text-color);
  display: inline-block;
  width: 100%;
  text-align: center;
  max-width: 100%;
}
.form-control span {
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 100%;
  font-weight: 600;
  font-size: 13px;
}
.price {
  color: var(--text-sub-color);
  margin-inline: 12px;
  margin-top: 40px;
  display: flex;
  align-items: center;
}
.price i {
  font-size: 18px;
  margin-left: 7px;
}
.note {
  margin-top: 10px;
  margin-inline: 12px;
  background-color: var(--background-overall);
  padding: 20px;
  border-radius: 5px;
  font-size: 13px;
}

.sub>span {
  color: var(--text-sub-color);
}
.sub {
  font-size: 12px;
  text-align: center;
}

.form-err {
  line-height: 25px;
  font-size: 13px;
  font-weight: 500;
  color: #f14545;
  transition: ease-in-out all 1s;
  padding-inline: 12px;
  margin-top: 10px;
}

.btn-login {
  border: none;
  padding: 10px 30px;
  width: 100%;
  font-weight: 600;
  border-radius: 17.5px;
  cursor: point;
  background-color: #00be06;
  color: #001a00;
}

.center-confirm {
  margin-top: 40px;
  margin-inline: 12px;
  
}
.center-confirm button {
  text-align: center;
  border-radius: 5px;
  height: 35px;
  line-height: 35px;
  font-weight: 700;
  display: block;
  width: 100%;
  border: none;
}
.noti-sc>i {
  font-size: 40px;
  color: #faa600;
  display: block;
  margin-bottom: 10px;
}
</style>
