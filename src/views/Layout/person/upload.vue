<script setup>
import {onMounted,ref,reactive,defineProps,createApp} from 'vue'
import request from '../../../utils/request'
import { languagePack } from '../../../languages';

const img1 = ref('')
const img2 = ref('')
const gttt = ref('')
const namecc = ref('')
const defaultImg = "https://i.imgur.com/bBWqKSY.png"
const gifloading = ref(false)
const loadingverify = ref(false)
let resultData = reactive({})
const status = ref(true)
const emit = defineEmits(['close-popup', 'loadcheck']);
const closePopup = () => {
  emit('close-popup');
};
async function uploadImg(){
    loadingverify.value = true

    if(img1.value == defaultImg || img2.value == defaultImg || namecc.value == '' || gttt.value == '') {
        document.querySelector('.err-validate-verify').style.display = 'block'
        loadingverify.value = false
    }else {
        var res = await request.post('user/kyc',{
            frontImage:img1.value,
            backImage:img2.value,
            realName: namecc.value,
            identityCard: gttt.value
        })
        status.value = false
        loadingverify.value = false
        emit('loadcheck');
    }
}

function turnOffNotiError() {
    document.querySelector('.err-validate-verify').style.display = 'none';
}



async function changeImg(img){
    document.querySelector('.err-validate-verify').style.display = 'none'
    if(img == "img1"){
        gifloading.value = true;
        img1.value ='https://suteki.com.vn/theme/frontend/images/loading.gif'
        const image = document.querySelector('#img1')
        convertToBase64(image)
            .then(async (base64String) => {
                var res = await uploadServer(base64String)
                img1.value = res.data.display_url
                gifloading.value = false
            })
            .catch((error) => {
                gifloading.value = false
                img1.value = defaultImg
        });
        
    }else{
        gifloading.value = true
        img2.value ='https://suteki.com.vn/theme/frontend/images/loading.gif'
        const image1 = document.querySelector('#img2')
        convertToBase64(image1)
            .then(async (base64String) => {
                var res = await uploadServer(base64String)
                img2.value = res.data.display_url
                gifloading.value = false
            })
            .catch((error) => {
                gifloading.value = false
                img2.value = defaultImg
        });
    }
}
async function uploadServer(base64){
    const data = new FormData()
    data.append('image',base64.split('base64,')[1]);
    data.append("key", "bfa1cd9b3bf942fd39aafe4ff6822349")
    return fetch("https://api.imgbb.com/1/upload", {
    method: "post",
    body: data
    }).then(res => res.json())
}
function convertToBase64(fileInput) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
function checkMaxLength(input) {
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength);
  }
}
const theme = ref(localStorage.getItem('theme') || 'dark');
onMounted(()=>{
    img1.value = defaultImg
    img2.value = defaultImg
})
</script>
<template>
    <div class="popbuy" :data-theme="theme">
        <div class="popbuy-content">
            <div class="top">
                <div class="ct">
                    <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <h4>{{ languagePack.person_upload_title }}</h4>
                </div>
            </div>
            <div class="popbuy-center" v-if="status">
                <div class="center-time">
                    <div class="form-input">
                        <div class="form-control">
                            <input type="text" id="name_gt" :placeholder="languagePack.person_upload_input1" v-model="namecc" @click="turnOffNotiError">
                        </div>
                    </div>
                    <div class="form-input">
                        <div class="form-control">
                            <input type="text" id="cccdnumber" pattern="[0-9]*"  :placeholder="languagePack.person_upload_input2" v-model="gttt" @click="turnOffNotiError">     
                        </div>
                    </div>
                    <label class="sub-upload" for="">{{ languagePack.person_upload_front }}</label>
                    <div class="center-time__body">
                        <img style="width:60%; "
                        onclick="document.getElementById('img1').click()"
                         :src="img1" />
                         <input hidden type="file" id="img1" @change="changeImg('img1')"/>
                    </div>
                    <label class="sub-upload" for="">{{ languagePack.person_upload_back }}</label>
                    <div class="center-time__body">
                        <img style="width:60%;"
                        onclick="document.getElementById('img2').click()"
                        :src="img2" 
                         />
                         <input hidden type="file" id="img2" @change="changeImg('img2')" />
                    </div>
                </div>
                <div class="center-confirm">
                    <p class="err-validate-verify">{{ languagePack.person_upload_err1 }}.</p>
                    <button class="button" v-if="gifloading == true" disabled>
                        {{ languagePack.person_upload_btn1 }}
                    </button>
                    <button class="button"  @click="uploadImg()" v-if="gifloading == false && loadingverify == false">
                        {{ languagePack.person_upload_btn2 }}
                    </button>
                    <button class="button" v-if="loadingverify == true" disabled>
                        {{ languagePack.person_upload_btn3 }}
                    </button>
                </div>
            </div>

            <div class="notifi-done" v-else>
                <div class="noti-sc" >
                <!-- Thông báo -->
                <img src="../../../assets/tick.png" alt="tick success" class="img" />
                <p class="noty">{{ languagePack.person_upload_noty1 }} <br>{{ languagePack.person_upload_noty2 }} </p>
                <p class="thanks">{{ languagePack.person_upload_thanks }}</p>
                <!-- <p class="noty moneyShow" style="margin: 8px 0px">
                    {{ formLang.depoint_vnd }}: {{ formatVnd(amount) }}
                </p>
                <p class="noty moneyShow" style="margin: 8px 0px">
                    {{ formLang.depoint_usd }}: {{ formatUsdt(amountUsd) }}
                </p> -->
                <div class="money">
                    <button class="center-balence__btn btns" @click="closePopup()">
                    {{ languagePack.person_upload_sm }}
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.popbuy-center {
    padding-inline: 12px;
}
.note{
    margin: 10px;
}
.info{
    color:#dfdfdf;
}
.flex{
    display:flex;
}
.center-time{
    text-align:start;
    margin-top:10px;
    margin-bottom:10px;
}
.center-time__body{
    font-size:10px;
    text-align: center;
    margin-block: 5px;
}
.center-time__body img {
    max-height: 110px;
    object-fit: contain;
}




.popbuy-bottom{
    font-size:13px;
    margin-top:15px;
    margin-bottom:10px;
}
.popbuy-bottom__label{
    width:50%;
    text-align:center;
}
.info{
    margin-top:20px;
}
.info-content{
    margin-top:20px;
}
.info-content__item{
    width:33%;
}
.info-content__item div{
    line-height:30px;
}
.success{
    color:#00eb00;
}
.error{
    color:#24af6c;
}
.err-validate-verify {
    margin: 20px 0 20px 0;
    text-align: center;
    color: #f14545;
    display: none;
    font-weight: 500;
    font-size: 13px;
}

/*  */

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
height: 100vh;
z-index: 99999;
background-color: var(--background-color);
padding-bottom: 75px;
overflow-y: scroll;
}
.popbuy-content {
  
}
.popbuy-content .top {
    background: var(--background-sub);
  padding: 45px 12px 10px 12px;
  margin-bottom: 50px;
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
  border-radius: 3px;
  padding-inline: 8px;
}
.form-input label {
  font-size: 10px;
  color: var(--text-sub-color);
  font-weight: bold;
}
.sub-upload {
    font-size: 12px;
  color: var(--text-sub-color);
  font-weight: 600;
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
}
.button {
   height: 36px;
   line-height: 36px;
   border-radius: 5px;
   width: 100%;
   border: none;
   font-size: 14px;
   margin-top: 20px;
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
  z-index: 9999;
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