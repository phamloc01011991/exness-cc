<script setup>
import { ref } from 'vue'
import { languagePack } from '../../../languages';
const theme = ref(localStorage.getItem('theme') || 'dark');;

</script>
<template>
    <div class="banner" :data-theme="theme">
        <div class="top">
            <span class="title">{{ languagePack.invest_banner_title }}</span>
            <img src="../../../assets/favicon.png" alt="">
        </div>
        <p class="content">{{ languagePack.invest_banner_ct }}</p>
        <div class="bottom">
            <div class="left">
                <div class="user-icon">
                    <i class='bx bx-user-circle'></i>
                </div>
                <div class="sl">
                    <span>478,354</span>
                    <span class="sub">{{ languagePack.invest_banner_person_join }}</span>
                </div>
            </div>
            <div class="right">
                <div class="money-icon">
                    <i class='bx bx-dollar-circle'></i>
                </div>
                <div class="sl">
                    <span>11.04 {{ languagePack.invest_banner_bilion }} USD</span>
                    <span class="sub">{{ languagePack.invest_banner_profit }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.banner {
    background: var(--background-color);
    border-radius: 10px;
}

.banner .top {
    display: flex;
    justify-content: space-between;
    padding: 20px 12px 0 12px;
}

.banner .top img {
    width: 27px;
    height: 27px;
    object-fit: cover;
}

.content {
    width: 70%;
    padding-inline: 12px;
}

.bottom .left {
    display: flex;
    align-items: center;
    padding-right: 10px;
    border-right: 1px solid var(--border-color);
}

.bottom {
    display: flex;
    align-items: center;
}

.bottom .right {
    display: flex;
    align-items: center;
    padding-left: 10px;

}

.title {
    color: var(--text-sub-color);
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
}

.bottom {
    padding: 15px;
}

.bottom span {
    display: block;
}

.bottom i {
    font-size: 21px;
    color: #faa600;
    display: inline-block;
    margin-right: 10px;
}

.sub {
    font-size: 12px;
    color: var(--text-sub-color);
    font-weight: 400;
}
</style>
