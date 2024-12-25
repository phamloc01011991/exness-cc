<script setup>
import request from '../../../utils/request'
import { ref } from 'vue'
import { languagePack } from '../../../languages';
const oldPassword = ref('')
const newPassword = ref('')
const reNewPassword = ref('')
const err1 = ref('')
const err2 = ref('')
const err3 = ref('')
const showSuccess = ref(false)
const err_common = ref('')
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
const theme = ref(localStorage.getItem('theme') || 'dark');
async function changePassword() {
    err1.value = ''
    err2.value = ''
    err3.value = ''
    err_common.value = ''
    if (newPassword.value.length < 4 || reNewPassword.value.length < 4) {
        err2.value = languagePack.person_changepass_err1;
        err3.value = languagePack.person_changepass_err2;
        return
    }
     if (newPassword.value != reNewPassword.value) {
        err_common.value = languagePack.person_changepass_err3
    return
  }
  await request
    .post('auth/changePassword', {
      newPassword: newPassword.value,
      oldPassword: oldPassword.value
    })
    .then((res) => {
      if (res.data.message == 'Password updated successfully.') {
        showSuccess.value = true
      }
    })
    .catch((err) => {
      if ((err.response.data.message == 'Invalid old password.')) {
        err_common.value = languagePack.person_changepass_err4
      }
    })
}

</script>
<template>
    <div class="popbuy" :data-theme="theme">
        <div class="popbuy-content">
          <div class="top">
            <div class="ct">
              <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
              <h4>{{ languagePack.person_changepass_title }}</h4>
            </div>
          </div>
          <div class="wrap-changePass">
            <div class="changePassword">
                <div class="form-input">
                    <div class="form-control">
                      <i class='bx bx-lock f-icon' ></i>
                        <input v-model="oldPassword" :placeholder="languagePack.person_changepass_current" type="text" autocomplete="off"/>
                    </div>
                </div>
                <p class="err1">{{ err1 }}</p>
                <div class="form-input">
                    <div class="form-control">
                      <i class='bx bx-lock f-icon' ></i>
                        <input v-model="newPassword" placeholder="Mật khẩu mới" type="text" autocomplete="off"/>
                    </div>
                </div>
                <p class="err1">{{ err2 }}</p>
                <div class="form-input">
                    <div class="form-control">
                      <i class='bx bx-lock f-icon' ></i>
                        <input v-model="reNewPassword" placeholder="Xác nhận lại mật khẩu mới" type="text" autocomplete="off"/>
                    </div>
                </div>
                <p class="err1">{{ err3 }}</p>
                <p class="err_common">{{ err_common }}</p>
                <button @click="changePassword()" class="button">{{ languagePack.person_changepass_btnsubmit }}</button>
            </div>
            </div>
            <div class="notifi-done" v-if="showSuccess">
                <div class="noti-sc" >
                <!-- Thông báo -->
                <img src="../../../assets/tick.png" alt="tick success" class="img" />
                <p class="noty">{{ languagePack.person_changepass_noty }}. </p>
                <p class="thanks">{{ languagePack.person_changepass_thanks }}.</p>
                <div class="money">
                    <button class="center-balence__btn btns" @click="closePopup()">
                    {{ languagePack.person_changepass_btnsubmit }}
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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
  bottom: 65px;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  z-index: 99999;
  overflow-y: scroll;
  background: var(--background-color);

}
.popbuy-content {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
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
.form-input {
  position: relative;
  background:var(--background-input);
  margin-bottom: 20px;
  border-radius: 5px;
  padding-inline: 10px;
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
.wrap-changePass {
  padding-inline: 12px;
}
.f-icon {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: 19px;
  transform: translateY(-50%);
}
.button {
  font-weight: 600;
  margin-top: 40px;
  height: 36px;
  line-height: 36px;
  display: block;
  border: none;
  width: 100%;
  border-radius: 5px;
}
.err1, .err2, .err3,.err_common{
  line-height: 25px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(218, 40, 40);
  transition: ease-in-out all 1s;
}
.err_common {
    text-align: center;
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
  min-height: 250px;
  border-radius: 15px;
  padding: 25px;
  z-index: 999999999;
  background: var(--background-color);
}
.money {
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
}
.money button {
  background: none;
  color: #00be06;
  border: 1px solid var(--background-input);
  margin-bottom: 10px;
  padding: 10px 30px;
  width: 100%;
  font-weight: 600;
  border-radius: 17.5px;
  cursor: point;
  color: var(--text-color)
}
.noty,.thanks {
  line-height: 25px;
}
</style>