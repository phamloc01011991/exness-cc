<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
import { formatUsdt, usdToVnd, formatVnd } from '../../../utils/money'

let resultData = reactive({})
const amount = ref('')
const securityCode = ref('')
// const amountVND = ref('100')
const noty = ref('0')
const emit = defineEmits(['close-popup', 'reloadListHistory'])
const bank = ref('')
const withdawSuccess = ref(true)
const priceUSD = ref()
const feeWithdrawal = ref()
const minWithdrawal = ref()
const maxWithdrawal = ref()
const err_withdraw = ref('')
const err_security = ref('')
const err_general = ref('')
const check_add_bank = ref(false)
const props = defineProps({
  securityCode: String,
  balance: String,
  status: Number
})
const code = ref('')
const datetime = ref('')
function setMax() {
    amount.value = props.balance
}
async function get_User_Config() {
  const response = await request.get('user/config/get_config')
  if (response.data.success) {
    feeWithdrawal.value = response.data.data[0].withdrawal_fee
    minWithdrawal.value = response.data.data[0].min_withdrawal
    maxWithdrawal.value = response.data.data[0].max_withdrawal
  }
}

async function getPriceUSD() {
  var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
  var data = await reponse.json()
  priceUSD.value = data.rates.VND
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

async function withDawAmount() {
  document.getElementsByClassName('button')[0].disabled = true;
  
  err_withdraw.value ='';
  err_security.value ='';
  err_general.value ='';
  
  if(props.status === 5) {
    err_general.value = languagePack.person_withdow_err1
    return
  }

  // if(props.status != 3) {
  //   err_general.value = languagePack.person_withdow_err17
  //   return
  // }

  if(check_add_bank.value == false) {
    err_general.value = languagePack.person_withdow_err2
    return
  }
  if (amount.value < parseFloat(minWithdrawal.value)) {
    err_withdraw.value = languagePack.person_withdow_err3
    document.getElementsByClassName('button')[0].disabled = '';
    return
  }
  if (amount.value > parseFloat(maxWithdrawal.value)) {
    err_withdraw.value = languagePack.person_withdow_err4
    document.getElementsByClassName('button')[0].disabled = '';
    return
  }
  if (amount.value > parseFloat(props.balance)) {
    err_withdraw.value = languagePack.person_withdow_err5
    document.getElementsByClassName('button')[0].disabled = '';
    return
  }
  if (securityCode.value.trim() !== props.securityCode) {
    err_security.value = languagePack.person_withdow_err6
    document.getElementsByClassName('button')[0].disabled = '';
    return
  }

  const list = await request.get('user/get_trans_history', {
    params: {
      typeTransaction: 'withdrawal'
    }
  })
  if (list.data.data.length > 0 && list.data.data[0].status == 'pending') {
    err_general.value = languagePack.person_withdow_err7
    document.getElementsByClassName('button')[0].disabled = '';
    return
  }
  // document.getElementsByClassName('btn-withdraw')[0].setAttribute('disabled', '')
  var res = await request.post('user/withdrawal_trans', {
    amount: amount.value
  })

  var result = res.data
  code.value = result.transaction.code
  datetime.value = result.transaction.createdAt
 

  if (result.success == true) {
    noty.value = result
    // amountVND.value = await usdToVnd(result.transaction.amount)
    // setTimeout(() => {
    //   withdawSuccess.value = false
      
    // }, 1000)
  } else {
    err_general.value = languagePack.person_withdow_err8
    // document.getElementsByClassName('btn-login')[0].disabled = true;
  }
}

const closePopup = () => {
  emit('close-popup')
}

async function checkBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    bank.value = result.bank
    check_add_bank.value = true
    return false
  } else {
    check_add_bank.value = false
    return true
  }
}
const theme = ref(localStorage.getItem('theme') || 'dark');


onMounted(async () => {
  //get bank
  get_User_Config()
  getPriceUSD()
  var res = checkBank()
})
</script>
<template>
  <div class="popbuy" :data-theme="theme">
    <div class="popbuy-content">
      <div class="top">
        <div class="ct">
          <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
        <h4>{{ languagePack.person_withdow_title }}</h4>
        </div>
      </div>
      <div class="popbuy-center">
        <div class="center-time">
          <div class="center-time__body">
            <div v-if="check_add_bank == true" class="securityCode" style="margin-bottom: 18px;">
              <label for="" style="font-size: 13px; font-weight: 600; margin-bottom: 3px; display: block;">{{ languagePack.person_withdow_bank }}</label>
              <div class="form-input">
                <div class="form-control">
                  <input style="text-transform: uppercase;" type="text" :value="bank.bankName + ' - ' + bank.numberCard" readonly/> 
                </div>
              </div>
            </div>
            <div class="valueMoney">
              <label for="" style="font-size: 13px; font-weight: 600; margin-bottom: 3px; display: block;">{{ languagePack.person_withdow_amount }}</label>
              <div class="form-input sl">
                    <input id="amout" type="number" :placeholder="languagePack.person_withdow_amount_input" v-model="amount">
                    <div class="not">
                        <span class="max" @click="setMax">{{ languagePack.person_withdow_max }}</span>
                        <span class="usd">USD</span>
                    </div>
                </div>
              <div class="form-err">{{ err_withdraw }}</div>
              <p class="note">
                
                <div class="sub">
                  {{ languagePack.person_withdow_sub1 }} {{ formatUsdt(amount - (amount / 100) * feeWithdrawal) }} USD ≈
                {{ formatVnd((amount - (amount / 100) * feeWithdrawal) * priceUSD) }}.
                </div>
                <div class="fee">
                  {{ languagePack.person_withdow_fee }}: {{ feeWithdrawal }}%
                </div>
              </p>
            </div> 
            <div class="securityCode">
              <label for="" style="font-size: 13px; font-weight: 600; margin-bottom: 3px; display: block;">Mã bảo mật</label>
              <div class="form-input">
                <div class="form-control">
                  <input :placeholder="languagePack.person_withdow_security" type="text" v-model="securityCode" /> 
                </div>
              </div>
              <div class="form-err">{{ err_security }}</div>
              <p class="note">{{ languagePack.person_withdow_security_note }}</p>
            </div>
          </div>
        </div>
        
        <div class="form-err" style="font-size: 12px;">{{ err_general }}</div>
        <div class="center-confirm">
          <button class="button" @click="withDawAmount()">
            {{ languagePack.person_withdow_smbtn }}
          </button>
        </div>
      </div>
      <div class="notifi-done" v-if="noty != 0">
        <div class="noti-sc">
          <i class='bx bx-check-circle' ></i>
          <p class="noty">{{ languagePack.person_withdow_success_noti1 }} <br>{{ languagePack.person_withdow_success_noti2 }} </p>
          <div class="detail">
            <div class="item">
              <span class="left">{{ languagePack.person_withdow_success_time }}</span>
              <span class="right">{{ changeDate(datetime) }} </span>
            </div>
            <div class="item">
              <span class="left">{{ languagePack.person_withdow_success_code }}</span>
              <span class="right">{{ code }}</span>
            </div>
          </div>
          <div class="money">
            <button class="" @click="closePopup()">
              {{ languagePack.person_withdow_success_close }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
.securityCode {
  margin-top: 3px;
}
.img {
  width: 100px;
  height: 100px;
}
.noti-sc>i {
  font-size: 40px;
  color: #faa600;
  display: block;
  margin-bottom: 10px;
}


.center-info {

  margin-top: 10px;
  text-align: start;
}
.center-info p {
  font-size: 12px;
  font-weight: 500;
  line-height: 25px;
}
.center-info p a {
  font-weight: 500;
}
.popbuy-center {
  padding-inline: 12px;
  min-height: 150px;
}
.center-time {
  text-align: start;
  margin-top: 10px;
  margin-bottom: 10px;
}
.center-confirm .center-balence__btn {
  padding: 7px 30px;
  border: none;
}

h4 {
  padding: 0px 20px;
}
.note, .note>div {
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
  color: var(--text-sub-color);
}
.note {
  margin-bottom: 15px;
}
/*  */
.img {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}
.popbuy {
  color: var(--text-color);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  z-index: 99999;
  background-color: var(--background-overall);
  overflow-y: scroll;
  padding-bottom: 75px;
}

.popbuy-content .top {
  padding: 45px 12px 10px 12px;
  background: var(--background-sub);
  margin-bottom: 50px;
}
.popbuy-content .top .ct {
  display: flex;
}
.popbuy-content .top .back {
  font-size: 25px;
}
.popbuy-content .top h4 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 17px;
}
.form-control {
  position: relative;
}
.form-input {
  position: relative;
  background:var(--background-input);
  margin-bottom: 5px;
  border-radius: 3px;
  padding-inline: 8px;
}

input {
  background: none;
  border: none;
  width: 100%;
  outline: none;
  padding-block: 15px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
  letter-spacing: 0.4px;
}
.center-confirm .center-balence__btn {
  padding: 7px 30px;
  border: none;
}
.button {
  border: none;
  display: block;
  width: 100%;
  border-radius: 5px;
  height: 36px;
  line-height: 36px;
}
.center-confirm {
  margin-top: 40px;
}
.infd {
  text-transform: uppercase;
}
.form-err {
  line-height: 25px;
  font-size: 13px;
  font-weight: 500;
  color: #f14545;
  transition: ease-in-out all 1s;
  margin-top: 10px;
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
.noty,.thanks {
  font-weight: 500;
  line-height: 25px;
}
.sl {
  display: flex;
  align-items: center;
  background: var(--background-input);
}
.form-input .not {
        display: flex;
        align-items: center;
        width: 50%;
    }
.form-input .not .max {
        color: #faa600;
        border-right: 2px solid var(--border-color);
    }
.form-input .not span {
        display: block;
        width: 50%;
        text-align: center;
    }
/*  */
</style>
