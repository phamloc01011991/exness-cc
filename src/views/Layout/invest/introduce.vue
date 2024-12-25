<script setup>
import request from '../../../utils/request'
import { onMounted, ref } from 'vue'
import { formatUsdt } from '../../../utils/money'
import { languagePack } from '../../../languages';
const emit = defineEmits(['close-popup'])
const USDprice =ref(0)
const closePopup = () => {
  emit('close-popup')
}
const theme = ref(localStorage.getItem('theme') || 'dark');
const props = defineProps({
  config: Object
})
async function RateVND() {
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT');
    var data =await reponse.json();
    return USDprice.value = data.rates.VND;
}
onMounted(async () => {
  await RateVND();
})
</script>
<template>
    <div class="popbuy" :data-theme="theme">
        <div class="popbuy-content">
          <div class="top">
            <div class="ct">
              <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
              <h4>{{ languagePack.invest_introduce_title }}</h4>
            </div>
          </div>
          <div class="content">
            <p>
                <strong>{{ languagePack.invest_introduce_ct1 }}</strong> {{ languagePack.invest_introduce_ct2 }} {{ props.config[props.config.length-1].percent }}% {{ languagePack.invest_introduce_ct3 }}. 
            </p>
            <p>
                {{ languagePack.invest_introduce_ct4 }}
            </p>
            <div class="banner">
                <img src="../../../assets/introduce.jpg" alt="" style=" width: 100%; object-fit: contain; border-radius: 5px">
            </div>
            <p>{{ languagePack.invest_introduce_ct5 }}:</p>
            <ul class="dt">
                <li v-for="item in props.config">
                    <p>{{ languagePack.invest_introduce_ct6 }} {{ item.percent }}% {{ languagePack.invest_introduce_ct7 }} {{ formatUsdt(parseFloat(item.value / USDprice).toFixed(2)) }}$ {{ languagePack.invest_introduce_ct8 }}.</p>
                </li>
            </ul>
          </div>
        </div>
    </div>
</template>
<style scoped>
.content {
  padding-inline: 12px;
}
.content p {
    text-indent: 10px;
    margin-bottom: 10px;
}
strong {
    font-weight: 700;
}
.img {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}
.popbuy {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 75px;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  z-index: 99999;
  overflow-y: scroll;
  background: var(--background-color);
  padding-bottom: 75px;

}
.popbuy-content {

}
.popbuy-content .top {
  background: var(--background-sub);
  padding: 45px 12px 5px 12px;
  margin-bottom: 50px;
}
.popbuy-content .top .ct{
  display: flex;
}
.popbuy-content .top .back {
  font-size: 23px;
}
.popbuy-content .top h4 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 16px;
}
.banner {
    text-align: center;
    margin-block: 10px;
}
.dt {
    margin-left: 10px;
    position: relative;
}
.dt p::after {
  content: '';
  position: absolute;
  display: block;
  width: 6px;
  height: 6px;
  background-color: #24af6c;
  border-radius: 50%;
  top: 6px;
  right: 100%;
}

</style>
