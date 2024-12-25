<script setup>
import request from '../../../utils/request'
import { languagePack } from '../../../languages';
let locations = JSON.parse(localStorage.getItem('locations'))

import { onMounted, ref } from 'vue'
const dataUserNot = ref()
const limitPage = ref(10)
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
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
async function loadUserNotification() {
  try {
    await request
      .get('notify/listing_full_user', {
        params:{
          limit: limitPage.value,
          language: locations.language
        }
      })
      .then(async (res) => {
        dataUserNot.value = res.data.data
      })
  } catch (error) {
    console.log(error)
  }
}
const theme = ref(localStorage.getItem('theme') || 'dark');
onMounted(async () => {
    await loadUserNotification()
})
</script>
<template>
    <div class="popbuy" :data-theme="theme">
        <div class="popbuy-content">
          <div class="top">
            <div class="ct">
              <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
              <h4>{{ languagePack.person_notification_title }}</h4>
            </div>
          </div>
          <ul>
            <template v-for="(item, index) in dataUserNot">
                <li class="item">
                    <div class="left">
                        <img width="30" src="../../../assets/favicon.png" alt="photo">
                    </div>
                    <div class="right">
                        <p class="tt">{{ item.title }}</p>
                        <p class="main-ct">{{ item.content }}</p>
                        <span class="time">{{changeDate(item.createdAt)}}</span>
                    </div>
                </li>
            </template>
          </ul>
        </div>
    </div>
</template>\
<style scoped>
ul {
  padding-inline: 12px;
}
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
  min-height: 100vh;
  height: 100vh;
  z-index: 99999;
  overflow-y: scroll;
  background: var(--background-overall);
  padding-bottom: 75px;
}
.popbuy-content .top {
  padding: 45px 12px 10px 12px;
  background: var(--background-sub);
  margin-bottom: 40px;

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
  font-weight: 500;
  font-size: 17px;
}
.item {
    display: flex;
    margin-bottom: 20px;
}
.item .right {
  margin-left: 10px;
  background-color: var(--background-color);
  border-radius: 5px;
  padding: 10px 10px;
  width: 100%;
}
.time {
  font-size: 12px;
  color: var(--text-sub-color);
  font-weight: 500;
}
.main-ct {
    line-height: 17px;
    margin-bottom: 5px;
}
.tt {
    font-weight: 500;
    margin-bottom: 5px;
    font-weight: 600;
}
</style>