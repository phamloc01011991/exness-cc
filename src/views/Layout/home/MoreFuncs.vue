<script setup>
import { ref, onMounted } from 'vue'
import { languagePack } from '../../../languages';
const emit = defineEmits(['close-popup'])
const showWithdow = ref(false)
import Withdow from '../../Layout/person/withdow.vue'
const theme = ref(localStorage.getItem('theme') || 'dark')
const closePopup = () => {
  emit('close-popup')
}
const props = defineProps({
  userLogined: Object
})

onMounted(async () => {
    
})
</script>
<template>
  <div>
    <div class="popbuy" :data-theme="theme">
      <div class="popbuy-content">
        <div class="top">
          <div class="ct">
            <div class="back"><i class="bx bx-left-arrow-alt" @click="closePopup"></i></div>
          </div>
        </div>
        <div class="functions">
          <div class="item" @click="showWithdow = true">
            <div class="icon">
              <i class="bx bx-log-out-circle bx-rotate-90"></i>
            </div>
            <span>{{ languagePack.home_morefuncs_withdraw }}</span>
          </div>
          
          <RouterLink to="/invest" style="display: block; color: var(--text-color);">
            <div class="item" @click="isShowInvite = true" style="width: 100%;">
              <div class="icon">
                <i class="bx bx-bolt-circle"></i>
              </div>
              <span>{{ languagePack.footer_invest }}</span>
            </div>
          </RouterLink>
        </div>
        
      </div>
    </div>
    <Withdow v-if="showWithdow" @close-popup="showWithdow = false" :securityCode="props.userLogined.securityCode" :balance="props.userLogined.balance" :status = "props.userLogined.status"/>

  </div>
</template>

<style scoped>
.popbuy {
  position: fixed;
  left: 0;
  top: 0;
  min-height: 100vh;
  width: 100%;
  z-index: 9999999999;
  background: var(--background-color);
  height: 100vh;
  overflow: scroll;
}
.popbuy-content {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
}
.popbuy-content .top {
  padding: 40px 12px 5px 12px;
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

.functions {
  display: flex;
  margin-top: 20px;
}
.functions .item,
.functions>a {
  width: 25%;
  text-align: center;
}
.functions .item .icon {
  position: relative;
  display: inline-block;
}
.functions .item .icon.hot::after {
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
.functions .item i {
  font-size: 27px;
  display: inline-block;
  color: #faa600;
}
.functions {
  margin-bottom: 10px;
}
.functions .item span {
  font-size: 13px;
  display: block
}

</style>
