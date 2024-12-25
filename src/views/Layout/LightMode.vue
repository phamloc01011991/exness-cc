<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../languages';
const emit = defineEmits(['close-popup'])
const theme = ref(localStorage.getItem('theme') || 'dark');;
function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    window.location.reload();
}
const closePopup = () => {
  emit('close-popup')
}
onMounted(() => {
  
})
</script>

<template>
    <div class="select-lang" :data-theme="theme">
      <div class="top">
        <div class="ct">
          <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
          <h4>{{ languagePack.lightmode_background }}</h4>
        </div>
      </div>
      <div class="lang">
        <div class="lang-item" @click="toggleTheme">
          <div class="left">
            <i class='bx bx-moon' ></i>
            <span>{{ languagePack.lightmode_background1 }}</span>
          </div>
          <i v-if="theme == 'light'" class='bx bx-check-circle' ></i>
        </div>
        <div class="lang-item"  @click="toggleTheme">
          <div class="left">
            <i class='bx bxs-moon' ></i>
            <span>{{ languagePack.lightmode_background2 }}</span>
          </div>
          <i v-if="theme == 'dark'"  class='bx bx-check-circle' ></i>
        </div>
      </div>
    </div>
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
  border-bottom: 1px solid var(--border-color);
  font-weight: 700;
}
.lang-item .left {
  display: flex;
  align-items: center;
}
.lang-item .left i {
  color: #faa600;
}
.lang-item .left span {
  display: inline-block;
  margin-left: 10px;
  padding-block: 15px;
}
.lang-item i {
  display: inline-block;
  color: #24af6c;
  font-size: 20px;

}
</style>
