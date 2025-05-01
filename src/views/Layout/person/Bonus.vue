<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import BonusDepoint from '../person/BonusDepoint.vue'
import request from '../../../utils/request'
const emit = defineEmits(['close-popup', 'loadcheck'])
const theme = ref(localStorage.getItem('theme') || 'dark');;
const isBonusDepoint = ref(false)
const check = ref()


const closePopup = () => {
  emit('close-popup')
}

async function getCumulativeRechargeCheck() {
  const list = await request.get('user/cumulative-recharge-check')
  check.value = list.data
}

onMounted(() => {
  getCumulativeRechargeCheck()
})
</script>

<template>
  <div class="select-lang" :data-theme="theme">
    <div class="top">
      <div class="ct">
        <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
        <h4>{{ languagePack.person_bonus_title }}</h4>
      </div>
    </div>
    <div class="lang">
      <h5>{{ languagePack.person_bonus_event }}</h5>
      <div class="lang-item">
        <div class="left">
          <img width="80" src="../../../assets/user-friendly.png" alt="" />
        </div>
        <div class="right">
          <h4>{{ languagePack.person_bonus_title_event }} <span class="cancel-event">(Đã tạm dừng)</span></h4>
          <p>{{ languagePack.person_bonus_title_ct }}</p>
          <button disabled class="button aa">{{ languagePack.person_bonus_btn_recieve }}</button>
        </div>
      </div>
    </div>
    <div class="lang">
      <div class="lang-item">
        <div class="left">
          <img width="80" src="../../../assets/wallet.png" alt="" />
        </div>
        <div class="right">
          <h4>Thưởng nạp tích luỹ trong ngày</h4>
          <p>Thưởng nạp tích luỹ trong ngày đối với khách hàng mới</p>
          <button class="button dp" @click="isBonusDepoint = true" :disabled="check?.rewardInfo.isEligible == false"
            :class="check?.rewardInfo.isEligible == true ? '' : 'aa'">Xem</button>
        </div>
      </div>
    </div>
  </div>
  <BonusDepoint v-if="isBonusDepoint" @close-popup="isBonusDepoint = false" :check="check"
    @loadcheck="getCumulativeRechargeCheck" />
</template>

<style scoped>
.select-lang {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  z-index: 99999;
  overflow-y: scroll;
  background: var(--background-color);
  overflow-x: hidden;
  color: var(--text-color);
}

.top {
  padding: 40px 12px 5px 12px;
  background: var(--background-sub);
}

.top .ct {
  position: relative;
}

.top .ct h4 {
  font-weight: 600;
  font-size: 17px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.top .back {
  font-size: 25px;
}

.lang {
  padding: 20px 12px
}

.lang h5 {
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: 700;
}

.lang-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--background-sub);
  padding: 20px;
  border-radius: 5px;
}

.lang-item .left {}

.lang-item .right {
  margin-left: 25px;
}

.lang-item p {
  display: block;
  margin-block: 10px;
}

.lang-item .aa {
  border: none;
  width: 75px;
  height: 25px;
  border-radius: 5px;
  background: var(--background-button-disable);
}

.lang-item .dp {
  border: none;
  width: 75px;
  height: 25px;
  border-radius: 5px;
}

.cancel-event {
  display: block;
  color: var(--text-sub-color);
  font-size: 13px;
}
</style>
