<script setup>
import { ref, computed, watch, provide, onMounted, reactive, onUnmounted, onBeforeMount } from 'vue';
import { languagePack } from '../../languages/index'
import PopUser from '../Layout/PopUser.vue';
import LangPopup from '../Layout/LangPopup.vue';
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money.js';
import Depoint from '../Layout/person/depoit.vue';
import { onLoadIcon } from '../../utils/orther';
import { OpenPopup } from '../../utils/plugin';
import Invite from '../Layout/home/Invite.vue';
import store from '../../stores/index'
import loadApp from '../Layout/LoadApp.vue'
import request from '../../utils/request'
import Item from '../Layout/Item.vue'
import Item1 from '../Layout/Item1.vue'
import HomeNotification from '../Layout/HomeNotification.vue';
import Search from '../Layout/Search.vue'
import Bonus from '../Layout/person/Bonus.vue';
import PersonNotification from '../Layout/person/notification.vue'
import SupportVip from '../Layout/person/supportVip.vue'
import MoreFuncs from '../Layout/home/MoreFuncs.vue'

const farmingAmount = ref(0)
const isShowMore = ref(false)
const isShowPersonNotification = ref(false)
const userLogined = ref('')
const isLogined = ref(false)
const showPopupLanguage = ref(false)
const showPopupQr = ref(false)
const loadding = ref(false)
const showCshk = ref(false)
const symbols = ref('')
const symbolsSlider = ref('')
const hiddenBalance = ref(false)
const isStatus = ref(false)
const showDepoit = ref(false)
const showAbout = ref(false)
const idInterval = ref('')
const idInterval1 = ref('')
const destroy = ref('')
const isDestroy = ref(false)
const showLogin = ref(false)
const checkLogin = store.getters.usersss
const isShowInvite = ref(false)
const showBonus = ref(false)
const showVip = ref(false)
// function toggleBalance() {
//   hiddenBalance.value = !hiddenBalance.value
// }
async function getFarmingAmount() {
  await request.get('/staking').then((res) => {
    if (res.data.success === true) {
      farmingAmount.value = res.data.data.balance_hold_total;
    }
  })
}
// Show login popup
function showLoginPopup() {
  showLogin.value = true;
}

const priceUSD = ref()
async function getPriceUSD() {
  var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
  var data = await reponse.json()
  priceUSD.value = data.rates.VND
}


//
const dataUserNot = ref();
const limitPage = ref(5);

// async function loadUserNotification() {
//   try {
//     await request
//       .get('notify/listing_full_user', {
//         limit: limitPage.value
//       })
//       .then(async (res) => {
//         dataUserNot.value = res.data.data
//         for (let i = 0; i < dataUserNot.value.length; i++) {
//           dataUserNot.value[i].time = await convertDateTimeMoment(dataUserNot.value[i].createdAt)
//         }
//       })
//   } catch (error) {
//     console.log(error)
//   }
// }
const isHiddenAmount = ref(true);
function hiddenAmount() {
  isHiddenAmount.value = !isHiddenAmount.value
}


const cvTime = ref()

// async function convertDateTime(time) {
//   const createdAt = time
//   cvTime.value = moment(createdAt).fromNow()
//   console.log(cvTime.value)
//   return cvTime.value
// }

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
            userLogined.value = res.data
            isLogined.value = true
            loadding.value = true

          } else {
            isLogined.value = false
            loadding.value =true
          }
        })
    } else {
      isLogined.value = false
      loadding.value =true
    }
  } catch (error) {
    console.log(error)
  }
}

const isLoginedChange = computed(() => store.getters.usersss)

watch(
  () => isDestroy.value,
  (newValue) => {
    if (newValue) {
      clearInterval(destroy.value)
    }
  }
)

watch(
  () => isLoginedChange.value,
  (val) => {
    loadCheck()
  }
)

async function getListSympol(limit) {
  await request
    .get('coinList/listing', {
      params: {
        limit: limit
      }
    })
    .then((res) => {
      symbols.value = {
        data: res.data.data,
        status: isStatus.value
      }
    })
}

getListSympol(8);
idInterval1.value = setInterval(() => {
  getListSympol(8);
}, 3000)

//
// async function logoutFunction() {
//   store.dispatch('logout')
//   location.reload()
// }
/* Thực hiện popup đổi ngôn ngữ */
//notification

// function show_noti() {
//   isShowNotification.value = !isShowNotification.value
//   loadUserNotification()
//   function convertDateTime(time) {
//     const createdAt = time
//     cvTime.value = moment(createdAt).fromNow()
//     console.log(cvTime.value)
//     return cvTime.value
//   }
// }
// function close_noti(e) {
//   e.preventDefault()
//   isShowNotification.value = false
// }
//




// Open CSKH
function showCshkPluin() {
  OpenPopup()
}

const cskhPopup = () => {
  var check = store.getters.usersss
  if (check) {
    ; (function (a, b, c, d, e, j, s) {
      a[d] =
        a[d] ||
        function () {
          ; (a[d].a = a[d].a || []).push(arguments)
        }
        ; (j = b.createElement(c)), (s = b.getElementsByTagName(c)[0])
      j.async = true
      j.charset = 'UTF-8'
      j.src = 'https://static.meiqia.com/widget/loader.js'
      s.parentNode.insertBefore(j, s)
    })(window, document, 'script', '_MEIQIA')
    _MEIQIA('entId', 'ac089d73f6f2d45039ba4afc67348135')
    _MEIQIA('language', 'vi')
    const token = JSON.parse(localStorage.getItem('user') || '{}')
    const name = token.fullName
    const id = token.id
    _MEIQIA('metadata', {
      name: name + ' (ID: ' + id + ')',
      address: 'idAccount: ' + id
    })
    isDestroy.value = true
  }
}

// Check saturday and sunday
function isSaturdayOrSundayNorthAmerica() {
  var currentDate = new Date()
  var currentTimezone = 'America/New_York' // Múi giờ Bắc Mỹ

  // Xác định ngày hiện tại theo múi giờ Bắc Mỹ
  var currentDay = currentDate.toLocaleString('en-US', {
    weekday: 'long',
    timeZone: currentTimezone
  })

  return currentDay === 'Saturday' || currentDay === 'Sunday' || currentDay === 'Friday';
}
var isWeekend = isSaturdayOrSundayNorthAmerica();

// const checkStatusUserDepoit = () => {
//   // if(userLogined.value.status == 5) {
//   //   notify({
//   //   title: `Thất bại`,
//   //   text: `Tài khoản của bạn đã bị khoá. Vui lòng liên hệ CSKH`,
//   //   type: 'error'
//   // })
//   // } else { 
//   //   showDepoit.value = true
//   // }
//   showDepoit.value = true
// }
function transferType(type) {
  var i, x, tablinks
  x = document.getElementsByClassName('mk')
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  tablinks = document.getElementsByClassName('link')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active')
  }
  document.getElementById(type).classList.add('active')
  document.getElementById(type + '1').style.display = 'block'
}
// Switch dark mode
const theme = ref(localStorage.getItem('theme') || 'dark');
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  window.location.reload();
}
onBeforeMount(() => {
  if (localStorage.getItem('theme') === null) { 
    localStorage.setItem('theme', 'dark');
    theme.value = 'dark';
  }
  document.documentElement.className = theme.value;
});
onMounted(async () => {
  getFarmingAmount()
  await loadCheck()
  // console.log(userLogined.value);
  onLoadIcon()
  getPriceUSD()


  if (userLogined.value.status == 5) {
    store.dispatch('logout');
    location.reload();
  }

  watch(isLoginedChange, (newVal, oldVal) => {
    if (newVal == true) {
      cskhPopup()
    }
    if (newVal == false) {
      var check = store.getters.usersss
      if (check) {
        ; (function (a, b, c, d, e, j, s) {
          a[d] =
            a[d] ||
            function () {
              ; (a[d].a = a[d].a || []).push(arguments)
            }
            ; (j = b.createElement(c)), (s = b.getElementsByTagName(c)[0])
          j.async = true
          j.charset = 'UTF-8'
          j.src = 'https://static.meiqia.com/widget/loader.js'
          s.parentNode.insertBefore(j, s)
        })(window, document, 'script', '_MEIQIA')
        _MEIQIA('entId', 'ac089d73f6f2d45039ba4afc67348135')
        _MEIQIA('language', 'vi')
        const token = JSON.parse(localStorage.getItem('user'))
        let name = ''
        let id = ''
        if (token == undefined) {
          name = 'Khách hàng vãng lai'
        } else {
          name = token.fullName
          id = token.id
        }

        _MEIQIA('metadata', {
          name: name + ' (ID: ' + id + ')',
          address: 'idAccount: ' + id
        })
      }
    }
  })
})

onUnmounted(() => {
  clearInterval(idInterval1.value)
})

</script>

<template>
  <div v-if="loadding == true">
    <div class="main" :data-theme="theme" >
      <div class="main-content" >
        <div class="contain">
          <!-- HEADER -->
          <div class="head">
            <div class="left">
              <div class="logo">
                <RouterLink to="/profile" style="display: flex;">
                  <img :src="userLogined.avatar == '' || !userLogined.avatar ? 'https://i.imgur.com/Me8yPX7.png' : userLogined.avatar " alt="">
                </RouterLink>
              </div>
              <Search />
            </div>
            <div class="right">
              <div class="cskh" @click="showCshkPluin()">
                <i class='bx bx-headphone'></i>
              </div>
              <div class="dark-mode" @click="toggleTheme">
                <i class='bx bx-moon'></i>
              </div>
              <div class="noti" @click="isShowPersonNotification=true">
                <i class='bx bxs-bell'></i>
              </div>
            </div>
          </div>
          <!-- USER LOGINED -->
          <div class="user-logined" v-if="isLogined">
            <div class="money">
              <div class="left">
                <span class="title">{{ languagePack.home_total_balance }}
                  <i
                    :class="[isHiddenAmount ? 'bx bxs-show' : 'bx bxs-low-vision']"
                    @click="hiddenAmount()"
                  ></i>
                </span>
                <div class="amount">
                  <span class="usd">{{ isHiddenAmount ? formatUsdt((parseFloat(userLogined.balance) + parseFloat(farmingAmount))) : '********'}} <span v-if="isHiddenAmount">USD <i class='bx bxs-down-arrow' style="font-size: 8px;"></i></span></span>
                  <span class="vnd"> {{ isHiddenAmount ? '≈ ' + formatVnd((parseFloat(userLogined.balance) + parseFloat(farmingAmount))*priceUSD): '******' }} </span>
                </div>
              </div>
              <div class="right" @click="showDepoit = true">
                <span class="button">{{ languagePack.home_button_depoint }}</span>
              </div>
            </div>
            <div class="functions">
              <div class="item" @click="showDepoit = true">
                <div class="icon">
                  <i class='bx bx-log-in-circle bx-rotate-90' ></i>
                </div>
                <span>{{ languagePack.home_button_depoint }}</span>
              </div>
              <div class="item" @click="isShowInvite = true">
                <div class="icon">
                  <i class='bx bx-user-plus'></i>
                </div>
                <span>{{ languagePack.home_invite }}</span>
              </div>
              <div class="item" @click="showBonus = true">
                <div class="icon hot">
                  <i class='bx bx-gift'></i>
                </div>
                <span>{{ languagePack.home_bonus }}</span>
              </div>
              <div class="item" @click="showCshkPluin()">
                <div class="icon">
                  <i class='bx bx-headphone' ></i>
                </div>
                <span>CSKH</span>
              </div>
            </div>
            <div class="functions">
              <a class="item" href="https://exess.homes/#blog" target="_blank">
                <div class="icon">
                  <i class='bx bxl-blogger'></i>
                </div>
                <span>Blog</span>
              </a>
              <div class="item" @click="showVip = true">
                <div class="icon hot">
                  <i class='bx bx-diamond' ></i>
                </div>
                <span>VIP</span>
              </div>
              <a class="item" href="https://exess.homes/#about" target="_blank">
                <div class="icon">
                  <img src="../../assets/logo.png" alt="" style="width: 27px; height: 27px; object-fit: cover;">
                </div>
                <span>{{ languagePack.home_aboutus }}</span>
              </a>
              <div class="item" @click="isShowMore=true">
                <div class="icon">
                  <i class='bx bx-dots-horizontal-rounded'></i>
                </div>
                <span>{{ languagePack.home_more }}</span>
              </div>
            </div>
          </div>

          <!-- Join us (check login) -->
          <div class="join-us" v-if="!isLogined">
            <h3>{{ languagePack.unlogin_title }}</h3>
            <a class="button" href="#" @click="showLoginPopup">
              {{ languagePack.unlogin_button }}
            </a>
          </div>
        </div>

        <!-- NOTI SLIDER -->
        <div class="noti-slider">
          <HomeNotification />
        </div>

        <div class="contain1">
          <!-- ASSET - MARKET -->
          <div class="list-data">
            <div class="tablink">
                <span id="trending" class="link" @click="transferType('trending')">Trending</span>
                <span id="all" class="link active" @click="transferType('all')">{{ languagePack.market_tablink1 }}</span>
                <span id="new" class="link" @click="transferType('new')">{{ languagePack.market_tablink2 }}</span>
            </div>
            <div class="mk" id="trending1" style="display: none;">
              <div class="list-item list-data__title flex"
                style="color: var(--text-sub-color);  margin-bottom: 10px;">
                <div class="name" style="width: 35%">
                  {{ languagePack.market_item_tile1 }}
                </div>
                <div class="price" style="width: 33%; text-align: right">{{ languagePack.market_item_tile2 }}</div>
                <div class="percent" style="width: 32%; text-align: right">
                  {{ languagePack.market_item_tile3 }}
                </div>
              </div>
              <div>
                <template v-if="isWeekend == false">
                  <template v-for="(item, index) in symbols.data" :key="index">
                      <Item v-if="item.status == '1'"
                          :name="item.symbol" 
                          :data="item.data"
                          :vitri="index"
                      />
                  </template>
                </template>
                <template v-if="isWeekend == true">
                    <template v-for="(item, index) in symbols.data" :key="index">
                        <Item1 v-if="item.status == '1'"
                            :name="item.symbol" 
                            :data="item.data"
                            :vitri="index"
                        />
                    </template>
                </template>
              </div>
            </div>
            <div class="mk" id="all1">
              <div class="list-item list-data__title flex"
                style="color: var(--text-sub-color);  margin-bottom: 10px;">
                <div class="name" style="width: 35%">
                  {{ languagePack.market_item_tile1 }}
                </div>
                <div class="price" style="width: 33%; text-align: right">{{ languagePack.market_item_tile2 }}</div>
                <div class="percent" style="width: 32%; text-align: right">
                  {{ languagePack.market_item_tile3 }}
                </div>
              </div>
              <div>
                <template v-if="isWeekend == false">
                  <template v-for="(item, index) in symbols.data" :key="index">
                      <Item
                          :name="item.symbol" 
                          :data="item.data"
                          :vitri="index"
                      />
                  </template>
                </template>
                <template v-if="isWeekend == true">
                    <template v-for="(item, index) in symbols.data" :key="index">
                        <Item1
                            :name="item.symbol" 
                            :data="item.data"
                            :vitri="index"
                        />
                    </template>
                </template>
              </div>
            </div>
            <div class="mk" id="new1" style="display: none;">
              <div class="list-item list-data__title flex"
                style="color: var(--text-sub-color);  margin-bottom: 10px;">
                <div class="name" style="width: 35%">
                  {{ languagePack.market_item_tile1 }}
                </div>
                <div class="price" style="width: 33%; text-align: right">{{ languagePack.market_item_tile2 }}</div>
                <div class="percent" style="width: 32%; text-align: right">
                  {{ languagePack.market_item_tile3 }}
                </div>
              </div>
              <div>
                <template v-if="isWeekend == false">
                  <template v-for="(item, index) in symbols.data" :key="index">
                      <Item v-if="item.status == '2'"
                          :name="item.symbol" 
                          :data="item.data"
                          :vitri="index"
                      />
                  </template>
                </template>
                <template v-if="isWeekend == true">
                    <template v-for="(item, index) in symbols.data" :key="index">
                        <Item1 v-if="item.status == '2'"
                            :name="item.symbol" 
                            :data="item.data"
                            :vitri="index"
                        />
                    </template>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="see-more">
          <RouterLink to="/market" style="font-size: 13px; color: var(--text-sub-color); font-weight: 500;">
            {{ languagePack.market_more }} <i class='bx bx-right-arrow-alt' style="font-size: 17px;"></i>
          </RouterLink>
        </div>

        <!-- ENVENT -->
        <div class="event" style="margin-top: 8px;">
          <div class="heading">
            <h2>Sự kiện mới nhất</h2>
          </div>
          <div class="new-event">
            <div class="item">
              <div class="left">
                <h4 class="title">{{ languagePack.home_event1 }}</h4>
                <div class="bottom">
                  <span class="date">28 thg 8, 2024</span>
                  <span class="status">Mới</span>
                </div>
              </div>
              <div class="right">
                <img src="../../assets/event1.webp" alt="">
              </div>
            </div>
            <div class="item">
              <div class="left">
                <h4 class="title">{{ languagePack.home_event2 }}</h4>
                <div class="bottom">
                  <span class="date">1 thg 8, 2024</span>
                  <span class="status">Mới</span>
                </div>
              </div>
              <div class="right">
                <img src="../../assets/event2.webp" alt="">
              </div>
            </div>
            <div class="item">
              <div class="left">
                <h4 class="title">{{ languagePack.home_event3 }}</h4>
                <div class="bottom">
                  <span class="date">21 thg 7, 2024</span>
                  <span class="status">Mới</span>
                </div>
              </div>
              <div class="right">
                <img src="../../assets/event3.webp" alt="">
              </div>
            </div>
            <div class="item">
              <div class="left">
                <h4 class="title">{{ languagePack.home_event4 }}</h4>
                <div class="bottom">
                  <span class="date">19 thg 6, 2024</span>
                  <span class="status">Mới</span>
                </div>
              </div>
              <div class="right">
                <img src="../../assets/event4.webp" alt="">
              </div>
            </div>

          </div>
          
        </div>
      </div>
      <!-- <PopUser v-if="!isLogined" /> -->
      <LangPopup v-if="showPopupLanguage" @close-popup="showPopupLanguage = false" />
      <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
      <PopUser v-if="showLogin" @close-popup="showLogin = false"/>
      <Invite v-if="isShowInvite" @close-popup="isShowInvite = false" :referalCode="userLogined.referralCode"/>
      <Bonus v-if="showBonus" @close-popup="showBonus = false"/>
      <PersonNotification v-if="isShowPersonNotification" @close-popup="isShowPersonNotification = false"/>
      <SupportVip v-if="showVip" @close-popup="showVip = false"/>
      <MoreFuncs v-if="isShowMore" @close-popup="isShowMore = false" :userLogined="userLogined"/>
    </div>
  </div>
  <div v-else>
    <loadApp />
  </div>
</template>
<style scoped>
a.item {
  color: var(--text-color);
}
.mk {
  padding-inline: 12px;
  padding-bottom: 10px;
}
.tablink {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
    padding-inline: 12px;
    padding-top: 10px;
}
.tablink span {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-sub-color);
    display: inline-block;
    margin-right: 15px;
    position: relative;
}
.tablink span:last-child {
    margin-right: 0;
}
.tablink span.active {
    color: var(--text-color);
}
/* new css */
/* contain */
.contain {
  background-color: var(--background-color);
  padding: 40px 12px 10px 12px;
}

.main-content {
  margin-bottom: 50px;

}

.contain1 {
  background-color: var(--background-color);
}

/*  */
.main {
  color: var(--text-color);
  background: var(--background-overall);
  height: 100vh;
  min-height: 100vh;
  overflow-y: scroll;  
}

.heading h2 {
  color: var(--text-color);
  padding: 4px 0px 3px 0px ;
  font-size: 17px;
  line-height: 17px;
  margin-bottom: 5px;
  font-weight: 500;
}

/* head */
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head .left {
  width: 70%;
}

.head .right {
  width: 25%;
  justify-content: space-between;
}

.head .left .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 7.5px;
  border-radius: 50%;
  margin-right: 15px;
}

.head .left .logo img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.head .user-id {
  font-size: 11px;
  color: #16ba0c;
  margin-right: 10px;
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
}

.head .right i {
  color: var(--text-color);
  font-size: 23px;
  vertical-align: middle;
}

.head .right {
  display: flex;
}

.head .left {
  display: flex;
  align-items: center;
}
/* user logined */
.user-logined .money {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block: 20px;
}
.user-logined .money  .left {
  padding-left: 5px;
}
.user-logined .money .left .title {
  color: var(--text-sub-color);
  display: block;
  font-size: 13px;
  margin-bottom: 3px;
}
.user-logined .money  .left .title i {
  vertical-align: middle;
  display: inline-block;
  margin-left: 5px;
}
.user-logined .money  .left .amount span {
  font-size: 13px;
}
.user-logined .money  .left .amount span.usd {
  display: block;
  font-size: 19px;
  font-weight: 700;
}
.user-logined .money  .left .amount span.usd  span {
  font-size: 12px;
}
.user-logined .money  .left .amount span.vnd {
  color: var(--text-sub-color);
}
.user-logined .money  .right span {
  padding: 5px 15px;
  border-radius: 5px;
  margin-right: 10px;
}
.user-logined .functions {
  display: flex;
  justify-content: space-between;
}
.user-logined .functions .item {
  width: 21%;
  text-align: center;
}
.user-logined .functions .item .icon {
  position: relative;
  display: inline-block;
}
.user-logined .functions .item .icon.hot::after {
  content: 'HOT';
  color: #000;
  position: absolute;
  top: 0px;
  right: -20px;
  font-size: 8px;
  font-weight: 500;
  background-color: #faa600;
  padding: 1px 2px;
  border-radius: 5px;
}
.user-logined .functions .item i {
  font-size: 27px;
  display: inline-block;
  color: #faa600;
}
.user-logined .functions {
  margin-bottom: 10px;
}
.user-logined .functions .item span {
  font-size: 13px;
  display: block
}
/* Join us */
.join-us {
  margin-block: 20px;
}

.join-us h3 {
  font-size: 23px;
  font-weight: 600;
  margin-bottom: 15px;
}

.join-us .button {
  padding: 7.5px 15px;
  font-size: 16px;
  border-radius: 5px;
}

/* noti-slider */
.noti-slider {
  margin-block: 8px;
}

/* market */


.list-item>div {
  font-weight: 500;
  font-size: 13px;
}

.see-more {
  border-top: 1px solid var(--border-color);
  padding-block: 10px;
  text-align: center;
  background-color: var(--background-color);
}

.see-more a {
  display: flex;
  align-items: center;
  justify-content: center;

}

.flex {
  display: flex;
}

/* event */
.event .heading {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-color);
}
.event .new-event {
  padding: 15px 12px 10px 12px;
  background-color: var(--background-color);

}
.event .new-event .item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.event .new-event .item .left {
  width: 55%;
}
.event .new-event .item .left .title {
  font-size: 13px;
  color: var(--text-color);
}
.event .new-event .item .bottom {
  font-size: 12px;
}
.event .new-event .item .bottom  {
  display: inline-block;
  margin-top: 3px;
}
.event .new-event .item .bottom .date {
  color: var(--text-sub-color);
}
.event .new-event .item .bottom .status {
  margin-left: 10px;
  background: #1c5137;
  color: #39eb8d;
  padding: 2px;
  border-radius: 3px;
}
.event .new-event .item .right {
  width: 35%;
}
.event .new-event .item .right img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 3px;
}


</style>
