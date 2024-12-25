<script setup>
import { ref, computed, watch, provide, onMounted, reactive } from 'vue'
import { languagePack } from '../../languages/index'
import PopBuy from '../Layout/PopBuy.vue'
import { RouterLink, useRouter } from 'vue-router'
import request from '../../utils/request'
import loadApp from '../Layout/LoadApp.vue'
import store from '../../stores/index'
const coinDefaul = ref('AUDCAD')
const router = useRouter()
const symbols = ref('')
const loadding = ref(false)
const userLogined = ref('')
const theme = ref(localStorage.getItem('theme') || 'dark');
function convertString(inputString) {
  var arr = inputString.split('')
  var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
  return outputString
}
// async function loadCheck() {
//   let user = localStorage.getItem('user')
//   if (typeof user == 'string') {
//     user = JSON.parse(user)
//     await request
//       .get('user/getUser', {
//         params: {
//           id: user.id
//         }
//       })
//       .then((res) => {
//         if (res.data.success === true) {
//           userLogined.value = res.data
//         }
//       })
//   }
// }
async function getListSympol(limit) {
  await request
    .get('coinList/listing', {
      params: {
        limit: limit
      }
    })
    .then((res) => {
      symbols.value = res.data.data
      loadding.value = true
    })
}


const selectForex = ref('')
function loadViewByTradingView(COIN) {
  try {
    let dt = new TradingView.widget({
      autosize: true,
      symbol: 'FX:' + COIN,
      interval: '1',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: theme.value || 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#100f15',
      enable_publishing: false,
      hide_legend: true,
      withdateranges: true,
      allow_symbol_change: false,
      save_image: false,
      studies: [
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 20

          }
        },
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 100
          }
        }
      ],
      studies_overrides: {
        'volume.volume.color.0': '#dfdfdf'
      },
      container_id: 'tradingview'
    })
  } catch (error) {
    console.log(error)
  }
}

function loadViewByTradingView1(COIN) {
  try {
    let dt = new TradingView.widget({
      autosize: true,
      symbol: 'FX:' + COIN,
      interval: '1',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: theme.value || 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#100f15',
      enable_publishing: false,
      hide_legend: true,
      allow_symbol_change: false,
      save_image: false,
      withdateranges: true,
      studies: [
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 20
          }
        },
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 100
          }
        }
      ],
      studies_overrides: {
        'volume.volume.color.0': '#dfdfdf'
      },
      container_id: 'tradingview1'
    })
  } catch (error) {
    console.log(error)
  }
}


function changeForex() {
  coinDefaul.value = selectForex.value
  loadViewByTradingView(coinDefaul.value)
  replaceDomainPrefix()
  // loadViewByTradingView1(coinDefaul.value)
}
// function btnShowPopBuy(command) {
//   if (userLogined.value.status == 5) {
//     notify({
//       title: `Thất bại`,
//       text: `Tài khoản của bạn đã bị khoá. Vui lòng liên hệ CSKH`,
//       type: 'error'
//     })
//   } else {
//     typeCommand.value = command
//     showPopBuy.value = true
//   }
// }

async function logoutFunction() {
  store.dispatch('logout')
  location.reload()
}


function transferType(type) {
  if(type == 'b') {
    loadViewByTradingView1(coinDefaul.value)
    replaceDomainPrefix()
  }
  var i, x, tablinks
  x = document.getElementsByClassName('wr')
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
function replaceDomainPrefix() {
      var iframes = document.getElementsByTagName('iframe');
      for (var i = 0; i < iframes.length; i++) {
          var iframe = iframes[i];
          var src = iframe.getAttribute('src');
          
          if (src && src.startsWith('https://s.tradingview')) {
              // Thay thế tiền tố bằng "in.tradingview"
              var newSrc = src.replace('https://s.tradingview', 'https://in.tradingview');
              
              // Gán lại src mới cho iframe
              iframe.setAttribute('src', newSrc);
          }
      }
  }
onMounted(async () => {
 
  if (router.currentRoute._value.params.id.length > 3) {
    coinDefaul.value = router.currentRoute._value.params.id.replace('/', '')
    loadViewByTradingView(coinDefaul.value)
    // loadViewByTradingView1(coinDefaul.value)
  } else {
    loadViewByTradingView(coinDefaul.value)
    // loadViewByTradingView1(coinDefaul.value)
  }
  selectForex.value = coinDefaul.value
  replaceDomainPrefix()
        

  await getListSympol(35)

})
</script>
<template>
  <div >
    <div class="main" :data-theme="theme">
      <div class="tablink">
        <span id="b" class="link" @click="transferType('b')">{{ languagePack.buy_title1 }}</span>
        <span id="a" class="link active" @click="transferType('a')">{{ languagePack.buy_title2 }}</span>
      </div>
      <div id="b1" class="wr" style="display: none; position: relative;">
        <div id="tradingview1" style="width: 100%; height: calc(100vh - 194px); margin-top: 20px;"></div>
      </div>
      <div id="a1" class="wr" style="position: relative">
        <div class="top flex">
          <div class="left">
            <i class="bx bx-menu"></i>
            <select class="select" @change="changeForex" v-model="selectForex">
              <option v-for="(item, index) in symbols" :value="item.symbol" :key="index">
                {{ item.symbol == 'AUDUSD' ? 'USD/VND' : convertString(item.symbol) }}
              </option>
            </select>
          </div>
          <div class="r">
            <i class="bx bx-candles bx-flip-horizontal chart" @click="transferType('b')"></i>
            <RouterLink
              to="/history"
              class="more"
              style="display: flex; align-items: center; justify-content: right"
            >
              <i class="bx bx-history"></i>
            </RouterLink>
          </div>
        </div>
        <div id="tradingview"></div>

        <PopBuy :name="coinDefaul" />
      </div>
      
    </div>
    <div v-if="loadding == false">
      <loadApp />
    </div>
  </div>
</template>
<style scoped>
.r {
  display: flex;
}
.chart {
  display: inline-block;
  margin-right: 10px;
}
.tablink .active {
  background-color: var(--background-input);
  border-radius: 5px;
  color: var(--text-color);
}
.tablink {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  background: var(--background-sub);
  margin-inline: 12px;
  color: var(--text-sub-color);
  margin-bottom: 10px;
}
.tablink span {
  display: block;
  width: 50%;
  padding: 5px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}
.main {
  padding: 50px 0 100px 0;
  background: var(--background-color);
  color: var(--text-color);
  height: 100vh;
  min-height: 100vh;
  overflow-y: scroll;
}

.top {
  margin-bottom: 10px;
  margin-inline: 12px;
  align-items: center;
}
.top .left {
  display: flex;
  align-items: center;
}
.top i {
  font-size: 23px;
}
.select {
  height: 30px;
  background: none;
  padding: 0 10px;
  outline: none;
  appearance: none;
  letter-spacing: 0.8px;
  border: none;
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
}
.btn-active {
  margin-top: 15px;
  text-align: center;
}
.btns {
  padding: 9px 30px;
  border: none;
  border-radius: 3px;
  margin: 0 5px;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.more {
  margin-left: auto;
}
.more i {
  font-size: 23px;
  color: var(--text-color);
}
</style>
