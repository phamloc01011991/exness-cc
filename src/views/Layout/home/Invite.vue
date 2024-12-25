<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import SupportInvite from '../../Layout/home/supportInvite.vue'
const emit =defineEmits(['close-popup']);
const closePopup = () => {
  emit('close-popup');
};
const showOk = ref(false)
const props = defineProps({
    referalCode: String
})
function onReady(url)
{
  var qrcode = new QRCode("id_qrcode");
  qrcode.makeCode(`https://exesstrading.pro/${props.referalCode }`)
}
const theme = ref(localStorage.getItem('theme') || 'dark');

function copyClipboard(textToCopy) {
    if (!navigator.clipboard) {
    console.log("Trình duyệt không hỗ trợ API clipboard.");
} else {
    // Sao chép nội dung vào bộ nhớ đệm
    navigator.clipboard.writeText(textToCopy)
        .then(function() {
            showOk.value = true
        })
}
}
onMounted(()=>{
    onReady("xin chao")
})
</script>

<template>
    <div class="invite" :data-theme="theme">
        <div class="top">
            <div class="ct">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
            </div>
            <h4>{{ languagePack.home_invite_title1 }} <span>({{ languagePack.home_invite_title2 }})</span></h4>
            <div class="intro">
                <div class="left">
                    <span class="t">{{ languagePack.home_invite_person_invite }}</span>
                    <span class="b">+7 USD <br><strong>{{ languagePack.home_invite_for_one }}</strong></span>
                </div>
                <div class="right">
                    <span class="t">{{ languagePack.home_invite_newbie }}</span>
                    <span class="b">+15 USD <br><strong>{{ languagePack.home_invite_free_start }}</strong></span>
                </div>
            </div>

        </div>
        <div class="howto">
            <h4>{{ languagePack.home_invite_link }}</h4>
            <div class="img-intro">
                <div class="step">
                    <div class="top-step">
                        <i class='bx bx-user-plus' ></i>
                        <span>{{ languagePack.home_invite_sharecode }}</span>
                    </div>
                    <div class="code">
                        <span>{{ languagePack.home_invite_mycode }}</span> <span class="c">{{ props.referalCode }}<i @click="copyClipboard(`${props.referalCode}`)" class='bx bx-copy' ></i></span>
                    </div>
                    <div class="code">
                        <span>{{ languagePack.home_invite_link_invite }}</span> <span class="c">https://exesstrading.pro/{{ props.referalCode }} <i @click="copyClipboard(`https://exesstrading.pro/${props.referalCode}`)" class='bx bx-copy' ></i></span>
                    </div>
                    <div class="qr-code-container">
                        <span>{{ languagePack.home_invite_link_orshare }}</span>
                        <div>
                            <div class="qr_code" id="id_qrcode" style="width: 80px; height: 80px;">

                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="dk">
            <h4>{{ languagePack.home_invite_policy }}</h4>
            <div class="sec">
                <span>1</span>
                <p>{{ languagePack.home_invite_sec1 }}</p>
            </div>
            <div class="sec">
                <span>2</span>
                <p>{{ languagePack.home_invite_sec2 }}</p>
            </div>
            <div class="sec">
                <span>3</span>
                <p>{{ languagePack.home_invite_sec3 }}</p>
            </div>
            <div class="sec">
                <span>4</span>
                <p>{{ languagePack.home_invite_sec4 }}</p>
            </div>
            <div class="sec">
                <span>5</span>
                <p>{{ languagePack.home_invite_sec5 }}</p>
            </div>
            <div class="sec">
                <span>6</span>
                <p>{{ languagePack.home_invite_sec6 }}</p>
            </div>
            <div class="sec">
                <span>7</span>
                <p>{{ languagePack.home_invite_sec7 }}</p>
            </div>
        </div>
        <SupportInvite v-if="showOk" @close-popup="showOk = false" />
    </div>
</template>

<style scoped>
.invite {
    background: var(--background-overall);
    color: var(--text-color);
    height: 100vh;
    min-height: 100vh;
    overflow-y: scroll;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-bottom: 85px;
    z-index: 999999;
}
.top {
    background: var(--background-color);
    padding: 40px 12px 50px 12px;
}
.top .ct {
  position: relative;
}
.top .back {
  font-size: 25px;
}
.top h4 {
  font-weight: 600;
  font-size: 18px;

}
.top h4 span {
    color: var(--text-sub-color);
}

.howto {
    margin-top: 15px;
    background: var(--background-color);
    padding: 40px 12px 40px 12px;
}
.img-intro {
    margin-top: 10px;
}
.howto h4 {
    font-size: 16px;
}
.img-intro i {
    display: inline-block;
    margin-right: 10px;
    font-size: 22px;
    vertical-align: middle;
}
.step .code {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    background: var(--background-input);
    color: var(--text-sub-color);
    padding: 6px 10px;
    border-radius: 5px;
}
.step .code .c {
    color: var(--text-color);
    font-weight: 600;
    letter-spacing: 0.3px;
}
.step .code .c i {
    font-size: 16px;
    display: inline-block;
    margin-left: 5px;
    color: #faa600;
}
.dk h4 {
    margin-bottom: 15px;
}
.dk {
    margin-top: 15px;
    background: var(--background-color);
    padding: 20px 12px;
}
.dk .sec {
    display: flex;
    margin-bottom: 5px;
}
.dk span {
    display: inline-block;
    margin-right: 10px;
    color: #faa600;
    font-weight: 600;
}
.intro {
    display: flex;
    margin-top: 25px;
}
.intro span {
    display: block;
}
.intro div {
    width: 50%;
    text-align: left;
}
.intro .right {
    padding-left: 20px;
    border-left: 1px solid var(--border-color);
}
.intro .t {
    color: var(--text-sub-color);
    margin-bottom: 5px;
}
.intro .b {
    font-size: 15px;
    font-weight: 600;
    color: #faa600;
}
.intro .b strong {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color);
}
.qr_code {
    display: flex;
    justify-content: center;
    margin-block: 10px;
    overflow: hidden;
    border: 1px solid var(--text-sub-color);
}
.qr-code-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
.qr-code-container span,
.qr-code-container div {
}
.qr-code-container span {
    color: var(--text-sub-color);
    font-size: 13px;
}
</style>
