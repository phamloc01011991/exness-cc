<script setup>
import { onMounted, ref } from 'vue';
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money.js';
import request from '../../utils/request';
import loadApp from '../Layout/LoadApp.vue';
import supportAnalys from '../Layout/person/supportAnalys.vue';
import Depoint from '../Layout/person/depoit.vue';
import History from '../Layout/person/history.vue';
import Withdaw from '../Layout/person/withdow.vue'
import { OpenPopup } from '../../utils/plugin'
import chart from '../Layout/person/chart.vue'
import { languagePack } from '../../languages';

const loadding = ref(false)
const showCshk = ref(false)
const vnd = ref(false)
const userLogined = ref('')
const showDepoit = ref(false)
const farmingAmount = ref(0)
const showHistory = ref(false)
const showWithdaw = ref(false)
const showSupportAnalys = ref(false)
const listAnnalys = ref()

const priceUSD = ref()
async function getPriceUSD() {
  var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
  var data = await reponse.json()
  priceUSD.value = data.rates.VND
}

const isHiddenAmount = ref(true);
function hiddenAmount() {
  isHiddenAmount.value = !isHiddenAmount.value
}
async function getFarmingAmount() {
  await request.get('/staking').then((res) => {
    if (res.data.success === true) {
      farmingAmount.value = res.data.data.balance_hold_total;
    }
  })
}
async function getListAnnalys() {
  await request.get('/user/sum_total').then((res) => {
    if (res.data.success === true) {
      listAnnalys.value = res.data.data;
    }
  })
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

async function loadCheck() {
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
          userLogined.value = res.data
          loadVnd()
          
        } 
      })
  }
}

function showCshkPluin() {
  OpenPopup()
}
const theme = ref(localStorage.getItem('theme') || 'dark');;

async function loadVnd() {
  vnd.value = await usdToVnd(userLogined.value.balance)
}

onMounted(async () => {
  
  await getListAnnalys()

  await loadCheck()
  await getFarmingAmount()
  loadding.value = true
  getPriceUSD()
})


</script>
<template>
  <div class="main" v-if="loadding == true" :data-theme="theme">
    <div class="main-content">
      <div class="top">
        <h2>{{ languagePack.person_index_title }}</h2>
        <div class="cskh" @click="showCshkPluin()">
          <i class='bx bx-headphone'></i>
        </div>
      </div>
      <div class="money">
        <span class="title">{{ languagePack.person_index_total }} 
          <i
            :class="[isHiddenAmount ? 'bx bxs-show' : 'bx bxs-low-vision']"
            @click="hiddenAmount()"
          ></i>
        </span>
        <div class="amount">
          <span class="usd">{{ isHiddenAmount ? formatUsdt((parseFloat(userLogined.balance) + parseFloat(farmingAmount))) : '********'}} <span v-if="isHiddenAmount">USD <i class='bx bxs-down-arrow' style="font-size: 8px;"></i></span></span>
          <span class="vnd"> {{ isHiddenAmount ? '≈ ' + formatVnd((parseFloat(userLogined.balance) + parseFloat(farmingAmount))*priceUSD): '******' }} </span>
        </div>
        <chart :listAnnalys="listAnnalys.list"/>
        <span class="note">{{ languagePack.person_index_last_update }}: {{ changeDate(listAnnalys.updateAt) }}</span>
      </div>
      <div class="functions">
        <div class="item" @click="showDepoit=true">
          <i class='bx bx-log-in-circle bx-rotate-90' ></i>
          <span>{{ languagePack.person_index_depoint }}</span>
        </div>
        <div class="item" @click="showWithdaw=true">
          <i class='bx bx-log-out-circle bx-rotate-90' ></i>
          <span>{{ languagePack.person_index_withdraw }}</span>
        </div>
        <div class="item" @click="showHistory = true">
          <i class='bx bx-history'></i>
          <span>{{ languagePack.person_index_history }}</span>
        </div>
        <div class="item" @click="showSupportAnalys = true">
          <i class='bx bx-bar-chart'></i>
          <span>{{ languagePack.person_index_analys }}</span>
        </div>
      </div>
      <div class="accounts">
        <h3>{{ languagePack.person_index_myacc }}</h3>

        <RouterLink to="/buy" class="button-sub">
          <div class="item">
            <div class="left">
              <span class="title">{{ languagePack.person_index_mainacc }}</span>
              <span class="amount" style="color: var(--text-color);">{{ formatUsdt(userLogined.balance) }} <span>USD</span></span>
            </div>
            <i class="bx bx-right-arrow-alt"></i>
          </div>
        </RouterLink>
        
        <RouterLink to="/invest" class="button-sub">
          <div class="item">
            <div class="left">
              <span class="title">{{ languagePack.person_index_farmacc }}</span>
              <span class="amount" style="color: var(--text-color);">{{ formatUsdt(farmingAmount) }} <span>USD</span></span>
            </div>
            <i class="bx bx-right-arrow-alt"></i>
          </div>
        </RouterLink>
      </div>
    </div>
    <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
    <History v-if="showHistory" @close-popup="showHistory = false" />
    <Withdaw
      v-if="showWithdaw"
      @close-popup="showWithdaw = false"
      :securityCode="userLogined.securityCode"
      :balance="userLogined.balance"
      :status = "userLogined.status"

    />
    <supportAnalys v-if="showSupportAnalys" @close-popup="showSupportAnalys = false"/>
    
    
  </div>
  <div v-else>
    <loadApp />
  </div>
</template>
<style scoped>
.chart {
  margin-top: 30px;
}
.chart {
  height: 130px;
}
.main-content .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main-content .top .cskh {
  margin-right: 3px;
}
.main-content .top .cskh i {
  display: inline-block;
  font-size: 23px;
}
.main-content h2 {
  font-size: 20px;
}
.main {
  padding: 40px 12px;
  color: var(--text-color);
  background-color: var(--background-overall);
  height: 100vh;
  min-height: 100vh;
  overflow-y: scroll;
  padding-bottom: 100px;
}
.money {
  margin-top: 15px;
  padding: 15px;
  background: var(--background-color);
  border-radius: 10px;
}
.money .note {
  color: var(--text-sub-color);
  font-size: 10px;
  margin-top: 15px;
  display: block;
}
.money .title {
  color: var(--text-sub-color);
  margin-bottom: 3px;
  display: inline-block;
}
.money .amount span.usd {
  display: block;
    font-size: 23px;
    font-weight: 700;
}
.money .amount span.usd span {
  font-size: 14px;
  font-weight: 500;
}
.money .amount span.vnd {
  color: var(--text-sub-color);
  font-size: 13px;
}

/* functions */
.functions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.functions .item {
  background: var(--background-color);
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
}
.functions .item i {
  display: inline-block;
  font-size: 24px;
  color: #faa600;
}
.functions .item span {
  display: block;
  font-size: 12px;
}
.accounts {
  margin-top: 20px;
}
.accounts  h3 {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 5px;
}
.accounts .item .left .title {
  color: var(--text-sub-color);
  font-size: 13px;
}
.accounts .item .left>span {
  display: block;
}
.accounts .item .left .amount {
  font-weight: 600;
  margin-top: 5px;
}
.accounts .item .left .amount>span {
  font-weight: 500;
  font-size: 12px;
}
.accounts .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--background-color);
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.accounts .item i{
  font-size: 19px;
  color: var(--text-sub-color);
}
</style>