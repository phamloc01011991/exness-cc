<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import store from '../../stores/index'
import request from '../../utils/request'
import { languagePack } from '../../languages';

const form = ref(1)
const statusLogin = ref(false)
const phone = ref('')
const password = ref('')
const passwordconfirm = ref('')
const transferCode = ref('')
const invitedCode = ref('')
const loging = ref(false)
const signuping = ref(false)
const emailFotgot = ref('')
const securityCodeForgot = ref('')
const phoneForgot = ref('')
const forgoting = ref(false)
const errCommon = ref('')
const mess_suc_fogot = ref('')
const hiddenPassword = ref(true)
const hiddenPassword1 = ref(true)
const showInviteInput = ref(false);
const checkInviteCode = ref(false)
const emit = defineEmits(['close-popup'])

const closePopup = () => {
  emit('close-popup')
}

function getCurrentURL() {
  let href = window.location.href;
  var parts = href.split("/");
  if(parts[parts.length - 1]) {
    invitedCode.value = parts[parts.length - 1]
    checkInviteCode.value = true
  }
}

// Sử dụng hàm để lấy URL hiện tại

// ok

function chuyenform(mtr) {
  errCommon.value = ''
  form.value = mtr
}

function hiddenPasswordInput() {
  hiddenPassword.value = !hiddenPassword.value
}

function hiddenPasswordInput1() {
  hiddenPassword1.value = !hiddenPassword1.value
}

async function forgetPassword() {
  errCommon.value = ''
  var pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/
  if (!pattern.test(emailFotgot.value)) {
    errCommon.value = languagePack.popuser_err1
    return
  }

  if (isNaN(parseFloat(phoneForgot.value)) || phoneForgot.value.length < 10) {
    errCommon.value = languagePack.popuser_err2
    return
  }

  if (securityCodeForgot.value.toString().trim().length != 6) {
    errCommon.value = languagePack.popuser_err3
    return
  }
  forgoting.value = true

  await request
    .post('user/forgot_password', {
      securityCode: securityCodeForgot.value.trim(),
      emailUser: emailFotgot.value.trim(),
      phone: phoneForgot.value.trim()
    })
    .then(() => {
      setTimeout(() => {
        mess_suc_fogot.value = languagePack.popuser_err4
        setTimeout(() => {
          forgoting.value = false
          chuyenform(1)
        }, 5000)
      }, 2000)
    })
    .catch((err) => {
      if (err.response.data.message == 'Số điện thoại hoặc mã bảo mật không chính xác') {
        errCommon.value = languagePack.popuser_err5
        forgoting.value = false
      } else {
        errCommon.value = languagePack.popuser_err6
        forgoting.value = false
      }
    })
}

async function register() {
  errCommon.value = ''
  if (isNaN(parseFloat(phone.value)) || phone.value.length < 10) {
    errCommon.value = languagePack.popuser_err7
    return
  }

  if (password.value.length < 4) {
    errCommon.value = languagePack.popuser_err8
    return
  }

  if (passwordconfirm.value != password.value) {
    errCommon.value = languagePack.popuser_err9
    return
  }

  if (transferCode.value.length != 6 || /^0*[1-9]\d*$/.test(transferCode.value) == false)  {
    errCommon.value =  languagePack.popuser_err10
    return
  }

  if (invitedCode.value.length != 7)  {
    errCommon.value =  languagePack.popuser_err14
    return
  }
  signuping.value = true

  await request
    .post('auth/signup', {
      phone: phone.value.trim(),
      password: password.value.trim(),
      securityCode: transferCode.value.toString(),
      invitedCode: invitedCode.value
    })
    .then((res) => {
      statusLogin.value = true
      loginAccount()
    })
    .catch((err) => {
      if (err.response.data.message == 'Failed! Phone is already in use!') {
        errCommon.value = languagePack.popuser_err11
        signuping.value = false
      } else if (err.response.data.message == 'Must Have Invited Code' || err.response.data.message == 'Not Found Referral Code') {
        errCommon.value = languagePack.popuser_err14
        signuping.value = false
      }else{
        errCommon.value = languagePack.popuser_err12
        signuping.value = false
      }
    })
}

async function loginAccount() {
  errCommon.value = ''
  loging.value = true
  const user = {
    sdt: phone.value.trim(),
    password: password.value.trim()
  }
  await store
    .dispatch('login', {
      user
    })
    .then((res) => {
      statusLogin.value = true
      window.location.reload()
    })
    .catch((err) => {
      errCommon.value = languagePack.popuser_err13
      loging.value = false
    })
}
const theme = ref(localStorage.getItem('theme') || 'dark');;
onMounted(() => {
  getCurrentURL()
})
</script>
<template>
  <div class="pop-user" :data-theme="theme">
    <div class="pop-user__content">
      <div v-if="form === 1" class="form-login">
        <div class="top">
          <div class="back" @click="closePopup">
            <i class='bx bx-left-arrow-alt' @click="closePopup"></i>
          </div>
          <h4 class="title">{{ languagePack.popuser_login }} Exness</h4>
          <span class="goto" @click="chuyenform(2)">{{ languagePack.popuser_register }}</span>
        </div>
        <form @submit.prevent="loginAccount">
          <div class="form-input">
            <div class="form-control">
              <i class='bx bx-phone f-icon'></i>
              <input v-model="phone" :placeholder="languagePack.popuser_phone" autocomplete="off"/>
            </div>
          </div>
          <div class="form-input pass">
            <div class="form-control">
              <input
              v-model="password"
              :type="hiddenPassword == true ? 'password' : 'text'"
              :placeholder="languagePack.popuser_pass"
              autocomplete="off"
            />
            <i class='bx bx-lock f-icon' ></i>
            <i
              class="hidepass"
              :class="[hiddenPassword == true ? 'bx bxs-low-vision' : 'bx bxs-show']"
              @click="hiddenPasswordInput()"
            ></i>
            </div>
          </div>
          <span class="fg-pass" @click="chuyenform(3)">{{ languagePack.popuser_fogot }}</span>
          <p class="err-login">{{ errCommon }}</p>
          <button class="button" type="submit" v-if="loging == false">
            {{ languagePack.popuser_login }}
          </button>
          <button class="btn btnloading" type="submit" disabled v-if="loging == true">
            {{ languagePack.popuser_loging }} ...
          </button>
        </form>
        <div class="form-input"></div>
      </div>

      <div v-if="form === 2" class="form-login">
        <div class="top">
          <div class="back"><i class='bx bx-left-arrow-alt' @click="chuyenform(1)"></i></div>
          <h4 class="title">{{ languagePack.popuser_create }} Exness</h4>
          <span class="goto" @click="chuyenform(1)">{{ languagePack.popuser_login }}</span>
        </div>
        <div class="form-input">
          <div class="form-control">
            <i class='bx bx-phone f-icon'></i>
            <input :placeholder="languagePack.popuser_phone" v-model="phone" autocomplete="off"/>
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input
            :placeholder="languagePack.popuser_pass"
            :type="hiddenPassword1 == true ? 'password' : 'text'"
            v-model="password"
            autocomplete="off"
          />
          <i class='bx bx-lock f-icon' ></i>
          <i
            class="hidepass"
            :class="[hiddenPassword1 == true ? 'bx bxs-low-vision' : 'bx bxs-show']"
            @click="hiddenPasswordInput1()"
          ></i>
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input
            :placeholder="languagePack.popuser_repass"
            :type="hiddenPassword1 == true ? 'password' : 'text'"
            v-model="passwordconfirm"
            autocomplete="off"
          />
          <i class='bx bx-lock f-icon' ></i>
          <i
            class="hidepass"
            :class="[hiddenPassword1 == true ? 'bx bxs-low-vision' : 'bx bxs-show']"
            @click="hiddenPasswordInput1()"
          ></i>
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.popuser_securiticode" v-model="transferCode" type="text" autocomplete="off"/>
            <i class='bx bx-code f-icon' ></i>
          </div>
        </div>
        <div class="form-input pass" >
          <div class="form-control " >
            <input :placeholder="languagePack.popuser_invitecode" type="text" v-model="invitedCode" autocomplete="off" readonly v-if="checkInviteCode" style="text-transform: uppercase;"/>
            <input :placeholder="languagePack.popuser_invitecode" type="text" v-model="invitedCode" autocomplete="off" v-if="!checkInviteCode"/>
            <i class='bx bx-user-plus f-icon' ></i>
          </div>
        </div>
        <div class="dk">
          <p>
            {{ languagePack.popuser_dk_register1 }} <span>{{ languagePack.popuser_dk_register2 }} Exness</span>
          </p>
        </div>
        <p class="err-login">{{ errCommon }}</p>
        <button class="button" @click="register()" v-if="signuping == false">
          Đăng ký
        </button>
        <button class="btn btnloading" disabled v-if="signuping == true">{{ languagePack.popuser_registering }} ...</button>
      </div>

      <div v-if="form === 3" class="form-foget">
        <div class="top">
          <div class="back"><i class='bx bx-left-arrow-alt' @click="chuyenform(1)"></i></div>
          <h4 class="title">{{ languagePack.popuser_forgotpass }}</h4>
        </div>
        <div class="not">
          <p>
            {{ languagePack.popuser_forgotpass_intro }}
          </p>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.popuser_input_email" v-model="emailFotgot" autocomplete="off"/>
            <i class='bx bx-mail-send f-icon' ></i>
          </div>
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.popuser_input_sdt" v-model="phoneForgot" autocomplete="off"/>
            <i class="bx bx-phone f-icon"></i>
          </div>
          
        </div>
        <div class="form-input">
          <div class="form-control">
            <input :placeholder="languagePack.popuser_input_securiticode" v-model="securityCodeForgot" autocomplete="off"/>
            <i class='bx bx-code f-icon' ></i>
          </div>
        </div>
        <p class="err-login">{{ errCommon }}</p>
        <p class="mess_suc_fogot">{{ mess_suc_fogot }}</p>

        <button class="button" v-if="forgoting == false" @click="forgetPassword()">
          {{ languagePack.popuser_fogot }}
        </button>
        <button class="btn btnloading" disabled v-if="forgoting == true">
          {{ languagePack.popuser_input_fogoting }} ...
        </button>
      </div>
    </div>
  </div>
</template>
<!-- Phần CSS của login -->
<style scoped>

/* new */
.pop-user {
  padding-top: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  min-height: 100vh;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.57);
  color: var(--text-color);
}

.pop-user__content {
  border-radius: 10px 10px 0 0;
  padding: 40px 12px 75px 12px;
  overflow-y: scroll;
  background-color: var(--background-color);
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  height: 100%;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 30px;
  position: relative;
}
.top .title {
  font-size: 17px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 0.3px;
}
.top .back i{
  font-size: 23px;
  color: var(--text-sub-color);
}
.top .goto {
  color: #faa600;
  font-weight: 600;
}

.form-input {
  position: relative;
  background:var(--background-input);
  margin-bottom: 20px;
  border-radius: 5px;
  padding-inline: 10px;
}
.form-input.pass {
  margin-bottom: 7px;
}
.f-icon {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: 19px;
  transform: translateY(-50%);
}
.form-control {
  position: relative;
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
  padding-left: 25px;
}

.hidepass {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--text-sub-color);
  font-size: 17px;
}

.fg-pass {
  display: block;
  text-align: right;
  font-size: 13px;
  color: #faa600;
  margin-bottom: 15px;
}
.button {
  display: block;
  height: 36px;
  border: none;
  border-radius: 5px;
  width: 100%;
}
.err-login {
  font-size: 13px;
  font-weight: 500;
  color: #f14545;
  margin-bottom: 5px;
  text-align: center;
  padding-bottom: 15px;
  margin-top: 10px;
}
.invite {
  display: block;
  margin-bottom: 5px;
  color: #faa600;
  font-size: 13px;
}
.invite i {
  display: inline-block;
  font-size: 10px;
  margin-left: 3px;
}
.dk {
  margin-top: 20px;
}
.dk p {
  color: var(--text-sub-color);
}
.dk p span {
  color: var(--text-color);
}
/*  */



.mess_suc_fogot {
  color: #24af6c;
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 5px;
}
.not p {
  color: var(--text-sub-color);
  margin-bottom: 15px;
  font-size: 13px;
}

.title-pop {
  margin-bottom: 20px;
  font-size: 21px;
  font-weight: 600;
}


.form-input__center {
  text-align: center;
  width: 100%;
  padding: 5px;
}

.close {
  position: absolute;
}



a {
  color: #b8c3fb;
}
.btn {
  border: none;
  padding: 10px 30px;
  width: 100%;
  font-weight: 600;
  border-radius: 5px;
  cursor: point;
}
.option {
  text-align: center;
  margin-block: 10px;
}

.btn-register {
  background-color: #002201;
  color: #16ba0c;
  border: 1px solid #09320a;
  margin-bottom: 10px;
}
.btn-fogot {
  background-color: #1c1c1e;
  color: #dfdfdf;
}

.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  padding-inline: 15%;
  padding-bottom: 20px;
}
.bottom .left {
  margin-right: 30px;
}


.btnloading {
}


</style>
