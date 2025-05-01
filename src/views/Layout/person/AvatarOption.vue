<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
const theme = ref(localStorage.getItem('theme') || 'dark')

const emit = defineEmits(['close-popup', 'loadcheck'])
const closePopup = () => {
  emit('close-popup')
}
const loadCheck = () => {
  emit('loadcheck')
}
const err = ref(false)
const currentAvatar = ref();
const props = defineProps({
  avatar: String
})

function changeAvatar(item) {
  currentAvatar.value = item
}
async function saveAvatar() {
  const res = await request.put('user/update_user', {
    avatar: currentAvatar.value
  })
  if (res.data.success) {
    loadCheck();
    emit('close-popup');
  }
}
const listAvatar = [
  'https://i.imgur.com/Kgd2KQp.png',
  'https://i.imgur.com/YYYHkWr.png',
  'https://i.imgur.com/iIfgPF9.png',
  'https://i.imgur.com/5K0530u.png',
  'https://i.imgur.com/9kXhN6o.png',
  'https://i.imgur.com/iwjPiCC.png',
  'https://i.imgur.com/GwUO9bM.png',
  'https://i.imgur.com/xNiLW02.png',
  'https://i.imgur.com/Me8yPX7.png'
]
function changeImg() {
  err.value = false
  const image = document.querySelector('#imgAvatar');
  convertToBase64(image)
    .then(async (base64String) => {
      const res = await uploadServer(base64String)
      currentAvatar.value = res.data.display_url
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function uploadServer(base64) {
  const data = new FormData()
  data.append('image', base64.split('base64,')[1]);
  data.append("key", "bfa1cd9b3bf942fd39aafe4ff6822349")
  return fetch("https://api.imgbb.com/1/upload", {
    method: "post",
    body: data
  }).then(res => res.json())
}

function convertToBase64(fileInput) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0];
    const maxSize = 250 * 1024; // 5MB


    if (file.size > maxSize) {
      err.value = true
      return;
    }
    currentAvatar.value = 'https://suteki.com.vn/theme/frontend/images/loading.gif'

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      currentAvatar.value = base64String
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

onMounted(async () => {
  if (props.avatar == '') {
    currentAvatar.value = 'https://i.imgur.com/Me8yPX7.png';
  } else {
    currentAvatar.value = props.avatar
  }
})

</script>
<template>
  <div class="tranfer-popup" :data-theme="theme">
    <div class="topp">
      <div class="top">
        <div class="back"><i class="bx bx-left-arrow-alt" @click="closePopup"></i></div>
        <div class="t">
          <span class="m">{{ languagePack.avatar_option_select }} Avatar</span>

        </div>
      </div>
    </div>
    <div class="current">
      <img :src="currentAvatar" />
    </div>
    <div class="up" onclick="document.getElementById('imgAvatar').click()">
      <div class="left">
        <i class='bx bx-camera'></i>
        <input hidden type="file" id="imgAvatar" @change="changeImg('imgAvatar')" />
      </div>
      <span>{{ languagePack.avatar_option_select_note }}</span>

    </div>
    <div class="err" v-if="err">
      {{ languagePack.avatar_option_err }}.
    </div>
    <div class="tab-link">
      <span>{{ languagePack.avatar_option_default }}</span>
    </div>
    <div class="default">
      <div :class="currentAvatar == item ? 'item active' : 'item'" @click="changeAvatar(item, this)"
        v-for="(item, index) in listAvatar" :key="index">
        <i v-if="currentAvatar == item" class='bx bx-chevron-down-circle'></i>
        <img :src="item" alt="" />
      </div>
      <div :class="!listAvatar.includes(currentAvatar) ? 'item active' : 'item'"
        v-if="!listAvatar.includes(currentAvatar)">
        <i class='bx bx-chevron-down-circle'></i>
        <img :src="currentAvatar" alt="">
      </div>

    </div>
    <div class="bt">
      <button class="button" @click="saveAvatar">
        {{ languagePack.avatar_option_save }}
      </button>
    </div>

  </div>
</template>
<style scoped>
.tab-link,
.default {
  padding-inline: 12px;
}

.tranfer-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 100vh;
  min-height: 100vh;
  z-index: 999;
  overflow-y: scroll;
  background: var(--background-color);
  overflow-x: hidden;
  padding-bottom: 75px;
}

.hr {
  width: 100%;
  height: 8px;
  background: var(--background-overall);
}

.topp {
  padding: 40px 12px 0px 12px;
}

.tranfer-popup .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top .back {
  font-size: 25px;
}

.top .t {
  font-size: 17px;
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.current {
  text-align: center;
  margin-block: 30px;
}

.current img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

.tab-link {
  padding-block: 10px;
  border-bottom: 1px solid var(--border-color);
}

.tab-link span {
  font-size: 15px;
  font-weight: 600;
}

.item img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.default {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.default .item {
  margin: 10px;
}

.button {
  border: none;
  display: block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  border-radius: 5px;
}

.bt {
  padding-inline: 12px;
  margin-top: 100px;
}

.item {
  position: relative;
}

.item.active::after {
  position: absolute;
  content: '';
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.item.active i {
  display: inline-block;
  font-size: 25px;
  color: #faa600;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.up {
  display: flex;
  justify-content: center;
  color: var(--text-color);
  border: 1px solid var(--text-sub-color);
  height: 36px;
  line-height: 36px;
  border-radius: 5px;
  width: 200px;
  min-width: 200px;
  margin-inline: auto;
}

.up .left {
  display: flex;
  align-items: center;
}

.up .left i {
  display: inline-block;
  font-size: 20px;
  vertical-align: middle;
  margin-right: 5px;
}

.err {
  text-align: center;
  margin-top: 10px;
  color: #f14545;
}</style>
