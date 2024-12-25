<script setup>
import request from '../../../utils/request';
import { languagePack } from '../../../languages';
import { onMounted, ref } from 'vue';
import AvatarOption from '../../Layout/person/AvatarOption.vue';
import store from '../../../stores';

const emit = defineEmits(['close-popup', 'loadcheck']);
const theme = ref(localStorage.getItem('theme') || 'dark');
const showAvatarOption = ref(false)
const kycData = ref();
const loadCheck = () => {
  emit('loadcheck')
}
const closePopup = () => {
  emit('close-popup');
}
const props = defineProps({
  userLogined: Object
})
async function logoutFunction() {
  store.dispatch('logout');
  location.reload();
}
function maskCharacters(inputString) {
  let characters = inputString.split('');
  characters[2] = '*';
  characters[3] = '*';
  return characters.join('');
}
async function getKyc() {
  await request.get('user/kycUser').then((res) => {
    kycData.value = res.data.data;
  })
}
onMounted(async () => {
  await getKyc();
})

</script>
<template>
    <div class="popbuy" :data-theme="theme">
      <div class="popbuy-content">
        <div class="topp">
          <div class="top">
            <div class="back"><i class="bx bx-left-arrow-alt" @click="closePopup"></i></div>
            <h4>{{ languagePack.person_profile_detail_title }}</h4>
          </div>
          <div class="top-1">
            <div class="avt">
              <div class="img" @click="showAvatarOption= true">
                <img :src="props.userLogined.avatar == '' ? 'https://i.imgur.com/Me8yPX7.png' : props.userLogined.avatar " alt="">
                <i class="bx bx-camera"></i>
              </div>
              <span>{{ props.userLogined.phone }}</span>
            </div>
          </div>
          <div class="ct">
            <span class="user-id">UID: 627729001000{{ props.userLogined.id }} </span>
          </div>
        </div>
        <ul>
          <li>
            <div class="form-noinput">
              <label for="">Xác minh danh tính</label>
              <span class="lt1 name">{{props.userLogined.status != 1? props.userLogined.status === 3? languagePack.person_profile_detail_subtitle_upload1: languagePack.person_profile_detail_subtitle_upload2 : languagePack.person_profile_detail_subtitle_upload3}}</span>
            </div>
            <div class="form-noinput">
              <label for="">{{ languagePack.person_profile_detail_title_name }}</label>
              <span class="lt1 name">{{ kycData ? kycData.real_name : '.....' }}</span>
            </div>
            <div class="form-noinput">
              <label for="">{{ languagePack.person_profile_detail_title_number }}</label>
              <span class="lt1 name">{{ kycData ? kycData.identity_card : '.....' }}</span>
            </div>
            <div class="form-noinput">
              <label for="">{{ languagePack.person_profile_detail_title_phonenumber }}</label>
              <span class="lt2">{{ props.userLogined.phone }}</span>
            </div>
            <div class="form-noinput">
              <label for="">{{ languagePack.person_profile_detail_title_securitycode }}</label>
              <span class="lt2 scr">{{ maskCharacters(props.userLogined.securityCode) }}</span>
            </div>
            <div class="form-noinput">
              <label for="">{{ languagePack.person_profile_detail_title_invitecode }}</label>
              <span class="lt2 icode">{{ props.userLogined.referralCode }}</span>
            </div>
          </li>
        </ul>
        <div class="logout">
          <a href="" class="button-sub" @click="logoutFunction">{{ languagePack.person_profile_detail_logout }}</a>
        </div>
      </div>
      <AvatarOption v-if="showAvatarOption" @close-popup="showAvatarOption = false" @loadcheck="loadCheck" :avatar="props.userLogined.avatar"/>
    </div>
  </template>
  <style scoped>
  .topp {
    padding: 45px 12px 20px 12px;
    background: var(--background-color);
  }
  .img {
    position: relative;
  }
  .img::after {
    position: absolute;
    content: '';
    width: 60px;
    height: 60px;
    display: block;
    z-index: 99;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .icode {
    letter-spacing: 1px;
  }
  .img img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }
  .img i {
    color: var(--text-sub-color);
    position: absolute;
    font-size: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .popbuy {
    color: var(--text-color);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 99999;
    padding-bottom: 75px;
    background: var(--background-overall);
    overflow-y: scroll;
  }
  
  .popbuy-content .top {
    display: flex;
    margin-bottom: 25px;
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
  .top-1 .avt {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .top-1 .avt span {
    display: block;
    font-size: 16px;
    margin-left: 20px;
    font-weight: 600;
  }
  .user-id {
    color: var(--text-sub-color);
    font-size: 13px;
    font-weight: 600;
  }
  ul {
    background-color: var(--background-color);
    margin-top: 8px;
    padding: 0 12px 0 12px;
  }
  .form-noinput {
    display: flex;
    justify-content: space-between;
    padding-block: 15px;
  }
  .scr {
    letter-spacing: 2px;
  }
  .logout {
    padding-inline: 12px;
    margin-top: 50px;
  }
  .button-sub {
    display: block;
    color: var(--text-color);
    border: 1px solid var(--text-sub-color);
    height: 36px;
    line-height: 36px;
    width: 100%;
    text-align: center;
    border-radius: 5px;
    margin-top: 30px;
  }
  .form-noinput label {
    color: var(--text-sub-color);
  }
  </style>