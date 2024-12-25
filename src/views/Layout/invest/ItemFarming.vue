<script setup>
import { ref } from 'vue'
import { languagePack } from '../../../languages';
import deposite from '../invest/deposite.vue'
import historyFarming from './historyFarming.vue';
import request from '../../../utils/request';
import { formatUsdt } from '../../../utils/money';
const showDeposite = ref(false)
const showHistoryFarming = ref(false)
const theme = ref(localStorage.getItem('theme') || 'dark');;
const emit = defineEmits(['close-popup', 'reloadAmount'])
const closePopup = () => {
  emit('close-popup')
}
const reloadAmount = (id) => {
    emit('reloadAmount', id)
}
const props = defineProps({
  data: Object,
  userLogined: Object
})
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
async function takeUsd(id) {
    document.getElementsByClassName('b')[0].disabled = '';

    const res = await request.put(`/staking-interest/${id}`)

    if(res.data.success) {
        reloadAmount(props.data.id);
        document.getElementsByClassName('b')[0].disabled = '';
    } else {
        document.getElementsByClassName('b')[0].disabled = '';
    }
    
}

</script>
<template>
    <div class="farming-item" :data-theme="theme">
        <div class="topp">
            <div class="top">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <div class="ct">
                    <div class="icon">
                        <i class='bx bx-dollar-circle m' ></i>
                        <i class='bx bx-dollar-circle s' ></i>
                    </div>
                    <div class="t">
                        <span class="m">{{ languagePack.layout_invest_item_farming_title1 }}</span>
                        <span class="s">{{ languagePack.layout_invest_item_farming_title2 }}</span>
                    </div>
                </div>
                <div class="history" @click="showHistoryFarming = true">
                    <i class="bx bx-history"></i>
                </div>
            </div>
        </div>
        <div class="balance">
            <span class="tt">Farming</span>
            <span class="usd">{{ props.data.balance_hold ? props.data.balance_hold: 0 }} USD</span>
        </div>
        <div class="detail1">
            <div class="item">
                <span class="left">MPY</span>
                <span class="right">{{ props.data.interestRate*30 ?props.data.interestRate*30 : '...' }}%</span>
            </div>  
            <div class="item">
                <span class="left">{{ languagePack.layout_invest_item_bonus_recieve }}</span>
                <span class="right">{{ props.data.balance_take ? formatUsdt(props.data.balance_take):0 }} USD</span>
            </div>   
            <div class="item">
                <span class="left">{{ languagePack.layout_invest_item_bonus_avail }}</span>
                <span class="right in">{{ props.data.balance_interest || props.data.balance_interest == 0 ? formatUsdt(props.data.balance_interest) : '...' }} USD <span class="b" v-if="props.data.balance_interest > 0" @click="takeUsd(props.data.id_staking_user)">{{ languagePack.layout_invest_item_bonus_recieve1 }}</span></span>
            </div>   
        </div>
        <div class="detail1">
            <div class="item">
                <span class="left">{{ languagePack.layout_invest_item_circle }}</span>
                <span class="right">{{ props.data.dateHold ? props.data.dateHold:'...' }} ngày</span>
            </div>    
            <div class="item" v-if="props.data.balance_hold>0">
                <span class="left">{{ languagePack.layout_invest_item_endcircle }}</span>
                <span class="right">{{ props.data.date_end ? changeDate(props.data.date_end):'...' }}</span>
            </div>
            <div class="item">
                <span class="left">Farm size</span>
                <span class="right">1,999,999 USD</span>
            </div>
            <div class="item">
                <span class="left">{{ languagePack.layout_invest_rate_bonus }}</span>
                <span class="right">100:{{ props.data.interestRate ? props.data.interestRate:'...' }}</span>
            </div>
            <div class="item">
                <span class="left">{{ languagePack.layout_invest_recieve_circle }}</span>
                <span class="right">{{ languagePack.layout_invest_recieve_circle1 }}</span>
            </div>     
        </div>
        <div class="note">
            <p>{{ languagePack.layout_invest_note }}.</p>
        </div>
        <div class="funcs">
            <span class="deposite button" @click="showDeposite =true">
                {{ languagePack.layout_invest_submit }} USD
            </span>
        </div>
    </div>
    <deposite v-if="showDeposite" @reloadAmount="reloadAmount($event)"  @close-popup="showDeposite = false" :userLogined="props.userLogined" :idStaking="props.data.id" :idStakingUser="props.data.id_staking_user" :dateHold="props.data.dateHold"/>
    <historyFarming v-if="showHistoryFarming" @close-popup="showHistoryFarming = false" :idPackage="props.data.id_staking_user"/>
</template>
<style scoped>
    .farming-item {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 100vh;
        min-height: 100vh;
        z-index: 99;
        overflow-y: scroll;
        background: var(--background-overall);
        overflow-x: hidden;
        padding-bottom: 75px;

    }
    .topp {
        padding: 40px 12px 20px 12px;
        background: var(--background-sub);
    }
    .farming-item .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .farming-item .top .history i {
        display: inline-block;
        font-size: 25px;
    }
    .top .back {
        font-size: 25px;
    }
    .farming-item .ct {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
    }
    .farming-item  .top .icon i {
        display: inline-block;
        color: #faa600;
    }
    .farming-item .top .icon i.m{
        font-size: 30px;
    }
    .farming-item .top .icon i.s {
        font-size: 20px;
        position: absolute;
        top: 0;
        left: 25px;
    }
    .farming-item .top .t {
        margin-left: 22px;
    }
    .farming-item  .t .m {
        font-size: 15px;
    }
    .farming-item  .t .s {
        font-size: 13px;
        color: var(--text-sub-color);
    }
    .farming-item .t span {
        display: block;
    }
    .farming-item  span{
        display: block;
    }  
    .farming-item .t  .m {
        font-size: 16px;
    }
    .farming-item .s {
        font-size: 13px;
        color: var(--text-sub-color);
    }
    .balance {
        text-align: center;
        margin-block: 30px;
    }
    .balance .tt {
        color: var(--text-sub-color);
    }
    .balance .usd {
        font-size: 23px;
        font-weight: 700;
    }
    .detail1 {
        margin-inline: 12px;
        background: var(--background-color);
        margin-bottom: 15px;
        border-radius: 5px;
        padding: 5px 12px;
    }
    .detail1 .item {
        padding-block: 15px;
        display: flex;
        justify-content: space-between;
    }
    .detail1 .item:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
    }
    .detail1 .item .left {
        color: var(--text-sub-color);
    }

    .funcs {
        margin-inline: 12px;
        margin-top: 30px;
    }
    .funcs .button {
        text-align: center;
        height: 36px;
        line-height: 36px;
        border-radius: 5px;
    }
    .note {
        padding-inline: 12px;
        font-size: 12px;
        color: var(--text-sub-color);
        text-align: center
    }
    .right.in {
        display: inline-block;
    }
    .right.in span {
        display: inline-block;
    }
    .right.in span.b {
        margin-left: 3px;
        font-weight: 600;
        color: #faa600;
    }
    .item .right {
        text-align: right;
    }


</style>
