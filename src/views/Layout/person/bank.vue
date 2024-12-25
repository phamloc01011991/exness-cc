<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
const err_depoint = ref('')
let resultData = reactive({})
const nameBank = ref('')
const nameInfo = ref('')
const numberBank = ref('')
const branch = ref('')
const statusBank = ref(false)
const is_add_done = ref(false)

const emit = defineEmits(['close-popup'])
async function saveBank() {
  
  document.getElementsByClassName('button')[0].disabled = true;
  err_depoint.value = ''
  if(nameBank.value.length < 2) {
    document.getElementsByClassName('button')[0].disabled = '';
    err_depoint.value = languagePack.person_bank_err1
    return
  }

  if(nameInfo.value.length < 5) {
    document.getElementsByClassName('button')[0].disabled = '';
    err_depoint.value = languagePack.person_bank_err2
    return
  }
  if (numberBank.value.length < 5) {
    document.getElementsByClassName('button')[0].disabled = '';
    err_depoint.value = languagePack.person_bank_err3
    return
  }
  var res = await request.post('user/new_bank', {
    bank_name: nameBank.value,
    number_card: numberBank.value,
    branch_name: branch.value,
    name_user: nameInfo.value
  })
  if(res.data.success){
    is_add_done.value = true
  }
  
}
async function checkBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    var bank = result.bank
    nameBank.value = bank.bankName.toUpperCase()
    nameInfo.value = bank.nameUser.toUpperCase()
    numberBank.value = bank.numberCard
    branch.value = bank.branchName.toUpperCase()
    statusBank.value = false
  } else {
    statusBank.value = true
  }
}

const closePopup = () => {
  emit('close-popup')
}

const theme = ref(localStorage.getItem('theme') || 'dark');

onMounted(async () => {
  var res = await checkBank()
})
</script>
<template>
  <div class="popbuy" :data-theme="theme">
    <div class="popbuy-content">
      <div class="topp">
        <div class="top">
          <div class="ct">
            <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
          <h4>{{ languagePack.person_bank_title }}</h4>
          </div>
        </div>
      </div>
      <div class="popbuy-center" v-if="statusBank">
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.person_bank_name_bank" v-model="nameBank" />
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.person_bank_inf" v-model="nameInfo" />
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.person_bank_number_bank" v-model="numberBank" />
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.person_bank_branch" v-model="branch" />
          </div>
        </div>
        <p class="form-err">{{ err_depoint }}</p>
        <div class="center-confirm">
          <button class="button" @click="saveBank()">
            {{ languagePack.person_bank_save }}
          </button>
        </div>
      </div>
      <div class="popbuy-center" v-else>
        <div class="form-input">
          <label for="">{{ languagePack.person_bank_name_bank }}</label>
          <div class="form-control">
            <input :value="nameBank" readonly/>
          </div>
        </div>
        <div class="form-input">
          <label for="">{{ languagePack.person_bank_inf }}</label>
          <div class="form-control">
            <input :value="nameInfo" readonly/>
          </div>
        </div>
        <div class="form-input">
          <label for="">{{ languagePack.person_bank_number_bank }}</label>
          <div class="form-control">
            <input :value="numberBank" readonly/>
          </div>
        </div>
        <div class="form-input">
          <label for="">{{ languagePack.person_bank_branch }}</label>
          <div class="form-control">
            <input  :value="branch" readonly/>
          </div>
        </div>
        <p class="note">Lưu ý: Hãy liên hệ Chăm sóc khách hàng nếu gặp vấn đề</p>
      </div>
      <div class="notifi-done" v-if="is_add_done">
        <div class="noti-sc" >
          <img src="../../../assets/tick.png" alt="tick success" class="img" />
          <p class="noty">{{ languagePack.person_bank_note }} </p>
          <p class="thanks">{{ languagePack.person_bank_thanks }}.</p>
          <div class="money">
            <button class="center-balence__btn btns" @click="closePopup()">
              {{ languagePack.person_bank_submit }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<style scoped>
.note {
  margin-top: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-sub-color);
}
.form-err {
  line-height: 25px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(218, 40, 40);
  transition: ease-in-out all 1s;
}

.popbuy-content .top .ct{
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
  font-size: 16px;
}
.form-control {
  position: relative;
}
.form-input {
  position: relative;
  background:var(--background-input);
  margin-bottom: 20px;
  border-radius: 5px;
  padding-inline: 10px;
}
.form-input label {
  color: var(--text-sub-color);
  font-size: 12px;
  display: block;
  margin-bottom: -10px;
  padding-top: 5px;
}
input {
  background: none;
  border: none;
  width: 100%;
  outline: none;
  padding-block: 15px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  letter-spacing: 0.4px;
}
.button {
  display: block;
  height: 36px;
  border: none;
  border-radius: 5px;
  width: 100%;
}
/*  */

.popbuy-content .top {
  background: var(--background-sub);
  padding: 45px 12px 10px 12px;
  margin-bottom: 50px;
}
.popbuy {
  color: var(--text-color);
  position: fixed;
  background: var(--background-color);
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  z-index: 99999;
}

.popbuy-content {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
  overflow-y: scroll;
}
.popbuy-center {
  min-height: 150px;
  padding-inline: 12px;
  padding-bottom: 75px;
}
.center-confirm {
  margin-top: 40px;
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
  bottom: 20px;
  left: 12px;
  right: 12px;
  font-size: 12px;
  text-align: center;
  background-color: var(--background-color);
  min-height: 325px;
  border-radius: 15px;
  padding: 25px;
  z-index: 999999999;
}
.money {
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
}
.money button {
  background: none;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  margin-bottom: 10px;
  padding: 10px 30px;
  width: 100%;
  font-weight: 600;
  border-radius: 17.5px;
  cursor: point;
}
.noty,.thanks {
  font-size: 13px;
  font-weight: 500;
  line-height: 25px;
}
</style>
