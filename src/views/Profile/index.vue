<script setup>
import { ref, watch, onMounted } from 'vue';
import { languagePack } from '../../languages';
import Upload from '../Layout/person/upload.vue';
import depoit from '../Layout/person/depoit.vue';
import Bank from '../Layout/person/bank.vue';
import changepass from '../Layout/person/changepass.vue';
import profile from '../Layout/person/ProfileDetail.vue';
import supportScoreCredit from '../Layout/person/supportScoreCredit.vue';
import SupportUpload from '../Layout/person/SupportUpload.vue';
import LightMode from '../Layout/LightMode.vue';
import request from '../../utils/request'
import Invite from '../Layout/home/Invite.vue';
import Bonus from '../Layout/person/Bonus.vue';
import { OpenPopup } from '../../utils/plugin';
import supportVip from '../Layout/person/supportVip.vue';
import LangPopup from '../Layout/LangPopup.vue';
import LoadApp from '../Layout/LoadApp.vue';
const loadding = ref(false)
const showVip = ref(false)
const showBonus = ref(false)
const showsupportScoreCredit = ref(false)
const showSupportUpload = ref(false)
const showUpload = ref(false);
const showBank = ref(false);
const showchangepass = ref(false);
const showprofile = ref(false);
const showLangPopup = ref(false);
const showLightMode = ref(false)
const showDepoit = ref(false)
const showInvite = ref(false)
const userLogined = ref(false)
let locations = JSON.parse(localStorage.getItem('locations'))


async function loadCheck() {
    try {
        let user = localStorage.getItem('user')
        if (typeof user == 'string') {
            user = JSON.parse(user)
            await request
                .get('user/getUser', {
                    params: {
                        id: user.id
                    }
                })
                .then((res) => {
                    if (res.data.success === true) {
                        userLogined.value = res.data
                    }
                })
        }
    } catch (error) {
        console.log(error)
    }
}

function showCshkPluin() {
  OpenPopup()
}


const theme = ref(localStorage.getItem('theme') || 'dark');;
function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    window.location.reload();
}

onMounted(async () => {
    await loadCheck();
    loadding.value = true
})
</script>

<template>
    <div>
        <div class="profile" :data-theme="theme" v-if="showprofile == false && loadding == true" >
            <div class="main">
                <div class="top">
                    <div class="back">
                        <RouterLink to="/">
                            <i class='bx bx-left-arrow-alt'></i>
                        </RouterLink>
                    </div>
                    <div class="right">
                        <div class="dark-mode" @click="toggleTheme">
                            <i class='bx bx-moon'></i>
                        </div>
                        <div class="cskh" @click="showCshkPluin()">
                            <i class='bx bx-headphone'></i>
                        </div>
                    </div>
                </div>
                <div class="main-info">
                    <div class="avatar" @click="showprofile = true">
                        <img :src="userLogined.avatar == '' ? 'https://i.imgur.com/Me8yPX7.png' : userLogined.avatar " alt="">
                    </div>
                    <div class="right" style="display: flex; width: 100%; align-items: center;justify-content: space-between;" @click="showprofile = true">
                        <div class="1">
                            <span class="phonemail">{{ userLogined.phone }}</span>
                            <span class="uid">{{ languagePack.profile_index_title }}</span>
                        </div>
                        <div class="2">
                            <i class='bx bx-chevron-right' style="font-size: 25px; color: var(--text-sub-color);"></i>
                        </div>
                    </div>
                </div>
                <div class="sub-info">
                    <div class="vip" @click="showVip = true">
                        <i class='bx bx-diamond'></i>
                        <span>{{ languagePack.profile_index_vip }}</span>
                    </div>
                    <div class="au" @click="showSupportUpload = true">
                        <i class='bx bx-check-shield'></i>
                        <span>{{ userLogined.status != 1 ? (userLogined.status === 3 ? languagePack.profile_index_upload_status1 : languagePack.profile_index_upload_status2) : languagePack.profile_index_upload_status3 }}</span>
                    </div>
                    <div class="score" @click="showsupportScoreCredit = true">
                        <i class='bx bx-smile'></i>
                        <span>{{ languagePack.profile_index_scorecredit }}</span>
                    </div>
                </div>
            </div>
            <div class="main1">
                <div class="functions">
                    <div class="item" @click="showDepoit = true">
                        <div class="icon ">
                            <i class='bx bx-log-in-circle bx-rotate-90' ></i>
                        </div>
                        <span>{{ languagePack.profile_index_withdraw }}</span>
                    </div>
                    <div class="item">
                        
                        <RouterLink to="/invest">
                            <div class="icon">
                                <i class="bx bx-bolt-circle"></i>
                            </div>
                            <span style="color: var(--text-color);">{{ languagePack.footer_invest }}</span>
                        </RouterLink>
                    </div>
                    <div class="item" @click="showInvite = true">
                        <div class="icon bonus">
                            <i class='bx bx-user-plus'></i>
                        </div>
                        <span>{{ languagePack.profile_index_invite }}</span>
                    </div>
                    <div class="item" @click="showBonus = true">
                        <div class="icon hot">
                            <i class='bx bx-gift'></i>
                        </div>
                        <span>{{ languagePack.profile_index_bonus }}</span>
                    </div>
                    
                </div>
            </div>
            <div class="main1">
                <h3>{{ languagePack.profile_index_myprofile }}</h3>
                <div class="supports">
                    <div class="item" v-if="userLogined.status == 1" @click="showUpload = true">
                        <div class="left">
                            <i class='bx bx-credit-card-front'></i>
                            <span>{{ languagePack.profile_index_upload_t }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                    <div class="item" @click="showBank = true">
                        <div class="left">
                            <i class='bx bxs-bank'></i>
                            <span>{{ languagePack.profile_index_bank_t }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                    <div class="item">
                        <div class="left">
                            <i class='bx bx-coin'></i>
                            <span>{{ languagePack.profile_index_fee_t }}</span>
                        </div>
                        <span>2%</span>
                    </div>
                    <div class="item" @click="showchangepass = true">
                        <div class="left">
                            <i class='bx bx-lock-alt'></i>
                            <span>{{ languagePack.profile_index_changpass_t }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                </div>
            </div>
            <div class="main1">
                <h3>{{ languagePack.profile_index_setting }}</h3>
                <div class="supports">
                    <div class="item" @click="showLangPopup = true">
                        <div class="left">
                            <i class='bx bx-world'></i>
                            <span>{{ languagePack.profile_index_language }}</span>
                        </div>
                        <span>{{ locations.language == 'VN' ? 'Tiếng Việt' : 'English' }}<i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                    <div class="item">
                        <div class="left">
                            <i class='bx bx-money'></i>
                            <span>{{ languagePack.profile_index_coin_display }}</span>
                        </div>
                        <span>USD</span>
                    </div>
                    <div class="item" @click="showLightMode = true">
                        <div class="left">
                            <i class='bx bx-moon'></i>
                            <span>{{ languagePack.profile_index_dark }}</span>
                        </div>
                        <span>{{ theme == 'dark' ? languagePack.profile_index_mode1 : languagePack.profile_index_mode2 }}<i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                    <div class="item">
                        <div class="left">
                            <i class='bx bx-brush'></i>
                            <span>{{ languagePack.profile_index_clearcache }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                </div>
            </div>
            <div class="main1 main2">
                <h3>{{ languagePack.profile_index_support_title }}</h3>
                <div class="supports">
                    <div class="item" @click="showCshkPluin()">
                        <div class="left">
                            <i class='bx bx-headphone'></i>
                            <span>{{ languagePack.profile_index_support_title1 }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                    <a class="item" href="https://www.exess.homes/#about" target="_blank">
                        <div class="left">
                            <i class="bx bx-detail"></i>
                            <span>{{ languagePack.profile_index_support_title2 }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </a>
                    <a class="item" href="https://www.exess.homes/download" target="_blank">
                        <div class="left">
                            <i class='bx bx-like'></i>
                            <span>{{ languagePack.profile_index_support_title3 }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </a>
                    <a class="item" href="https://facebook.com" target="_blank">
                        <div class="left">
                            <i class='bx bxs-user-voice'></i>
                            <span>{{ languagePack.profile_index_support_title4 }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </a>
                    <a class="item" href="https://www.exess.homes/#features" target="_blank">
                        <div class="left">
                            <i class='bx bx-search-alt'></i>
                            <span>{{ languagePack.profile_index_support_title5 }}</span>
                        </div>
                        <span><i class='bx bx-right-arrow-alt'></i></span>
                    </a>
                </div>
            </div>

        </div>
        <div v-if="loadding == false">
            <LoadApp />
        </div>
        <Upload v-if="showUpload" @close-popup="showUpload = false" @loadcheck="loadCheck" />
        <Bank v-if="showBank" @close-popup="showBank = false" />
        <changepass v-if="showchangepass" @close-popup="showchangepass = false" />
        <profile v-if="showprofile" @close-popup="showprofile = false" :userLogined="userLogined" @loadcheck="loadCheck"/>
        <LightMode v-if="showLightMode" @close-popup="showLightMode = false" />
        <supportScoreCredit v-if="showsupportScoreCredit" @close-popup="showsupportScoreCredit = false" :scoreCredit="userLogined.creditScore" />
        <SupportUpload v-if="showSupportUpload" @close-popup="showSupportUpload = false" :status="userLogined.status" />
        <depoit v-if="showDepoit" @close-popup="showDepoit = false"/>
        <Invite v-if="showInvite" @close-popup="showInvite = false" :referalCode="userLogined.referralCode"/>
        <Bonus v-if="showBonus" @close-popup="showBonus = false"/>
        <supportVip v-if="showVip" @close-popup="showVip = false"/>
        <LangPopup v-if="showLangPopup" @close-popup="showLangPopup = false"/>
    </div>
</template>

<style scoped>
/* profile */
.profile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    min-height: 100vh;
    background-color: var(--background-overall);
    overflow-y: scroll;
    z-index: 99999;
    color: var(--text-color);
}

.main {
    background-color: var(--background-color);
    padding: 40px 12px 20px 12px;
}

.main1 {
    margin-top: 8px;
    background-color: var(--background-color);
    padding: 15px 12px 15px 12px;
}

.main2 {
    margin-bottom: 75px;
}

.main1 h3 {
    margin-bottom: 15px;
}

.profile .top {
    display: flex;
    justify-content: space-between;
}

.profile .top .right {
    display: flex;
}

.profile .top .right .cskh {
    margin-left: 10px;
}

.profile .top i {
    color: var(--text-color);
    font-size: 25px;
    vertical-align: middle;
}

/* main info */
.main-info {
    margin-top: 30px;
    display: flex;
    align-items: center;
}

.main-info .avatar {
    margin-right: 20px;
    position: relative;
}


.main-info .avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.main-info .right span.phonemail {
    font-weight: 700;
}

.main-info .right span.uid {
    display: block;
    font-size: 13px;
    color: var(--text-sub-color);
}

/* sub info */
.sub-info {
    margin-top: 15px;
    display: flex;
}

.sub-info>div {
    background: var(--background-input);
    padding: 2px 5px;
    font-size: 13px;
    border-radius: 3px;
    text-align: center;
}

.sub-info>div:not(:last-child) {
    margin-right: 5px;
}

.sub-info>div i {
    display: inline-block;
    margin-right: 2px;
}

.sub-info .vip i {
    color: #00bdab;
}

.sub-info .score i {
    color: #24af6c;
}

.sub-info .au i {
    color: #24af6c;
}

.functions {
    display: flex;
    justify-content: space-between;
}

.functions .item {
    width: 21%;
    text-align: center;
    display: block
}
 .item .left {
    display: flex;
    align-items: center;
}

.functions .item .icon {
    position: relative;
    display: inline-block;
}
a.item {
    color: var(--text-color);
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

.functions .item .icon.bonus::after {
    content: '$999';
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
    font-size: 24px;
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

/* supports */
.supports .item {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
}

.supports .item:not(:last-child) {
    margin-bottom: 15px;
}

.supports .item>span {
    color: var(--text-sub-color);
}

.supports .item>span i {
    display: inline-block;
    margin-left: 3px;
}

.supports .item .left i {
    display: inline-block;
    font-size: 19px;
    color: #faa600;
}

.supports .item .left span {
    display: inline-block;
    margin-left: 10px;
    font-size: 15px;
}
</style>
