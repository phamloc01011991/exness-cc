<script setup>
import { ref } from 'vue'
import { languagePack } from '../../../languages';
const theme = ref(localStorage.getItem('theme') || 'dark');;
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
const props = defineProps({
    item: Object
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

</script>
<template>
    <div class="deposite-success" :data-theme="theme">
        <div class="topp">
            <div class="top">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <div class="t">
                    <span class="m">{{ languagePack.person_history_detail_title }}</span>
                </div>
            </div>
        </div>
        <div class="noti">
            <span class="t">{{ languagePack.person_history_detail_amount }}</span>
            <span class="amount">{{ props.item.amount_usd }} USD</span>
            <span class="n" :class="item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "><i class='bx bx-check-circle' ></i>{{ props.item.status == 'approved'
                ? languagePack.person_history_status1
                : item.status == 'rejected'
                ? languagePack.person_history_status2
                : languagePack.person_history_status3 }}</span>
        </div>
        <div class="hr"></div>

        <div class="detail">
            <div class="item" v-if="item.typeTransaction == 'withdrawal' && item.type == 'staking'">
                <span class="left">{{ languagePack.person_history_detail_from }}</span>
                <span class="right">{{ languagePack.person_history_detail_name1 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'withdrawal' && item.type == 'staking'">
                <span class="left">{{ languagePack.person_history_detail_to }}</span>
                <span class="right">{{ languagePack.person_history_detail_name2 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'toup' && item.type == 'staking'">
                <span class="left">{{ languagePack.person_history_detail_from }}</span>
                <span class="right">{{ languagePack.person_history_detail_name2 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'toup' && item.type == 'staking'">
                <span class="left">{{ languagePack.person_history_detail_to }}</span>
                <span class="right">{{ languagePack.person_history_detail_name1 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'toup' && item.type == 'bank'">
                <span class="left">{{ languagePack.person_history_detail_from1 }}</span>
                <span class="right">Internet Banking</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'toup' && item.type == 'bank'">
                <span class="left">{{ languagePack.person_history_detail_to }}</span>
                <span class="right">{{ languagePack.person_history_detail_name1 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'withdrawal' && item.type == 'bank'">
                <span class="left">{{ languagePack.person_history_detail_from2 }}</span>
                <span class="right">{{ languagePack.person_history_detail_name1 }}</span>
            </div>
            <div class="item" v-if="item.typeTransaction == 'withdrawal' && item.type == 'bank'">
                <span class="left">{{ languagePack.person_history_detail_to }}</span>
                <span class="right">{{ languagePack.person_history_detail_name4 }}</span>
            </div>
            <div class="item">
                <span class="left">{{ languagePack.person_history_detail_time }}</span>
                <span class="right">{{ changeDate(props.item.updatedAt) }}</span>
            </div>
            <div class="item">
                <span class="left">{{ languagePack.person_history_detail_code }}</span>
                <span class="right">{{ props.item.code }}</span>
            </div>
            <a class="button-sub" @click="closePopup">
                {{ languagePack.person_history_detail_close }}
            </a>
        </div>
    </div>
</template>
<style scoped>
    .deposite-success {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 100vh;
        min-height: 100vh;
        z-index: 9999999;
        overflow-y: scroll;
        background: var(--background-color);
        overflow-x: hidden;
    }
    .hr {
        height: 8px;
        background-color: var(--background-overall);
    }
    .topp {
        padding: 40px 12px 0px 12px;
        
    }
    .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }
    .top .back {
        font-size: 25px;
    }
    .top .t {
        font-weight: 600;
        font-size: 17px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .noti {
        padding: 20px 12px;
        text-align: center;
    }
    .noti span {
        display: block;
    }
    .noti .t {
        font-size: 13px;
        color: var(--text-sub-color);
    }
    
    .noti .amount {
        margin-block: 5px;
        font-size: 16px;
        font-weight: 600;
    }
    .noti .n {
        color: #24af6c;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .noti .n i {
        display: inline-block;
        margin-right: 5px;
    }
    .detail {
        padding-inline: 12px;
    }
    .detail .item {
        display: flex;
        justify-content: space-between;
        margin-block: 15px;
    }
    .item .left {
        color: var(--text-sub-color);
    }
    .button-sub {
        display: block;
        color: var(--text-color);
        border: 1px solid var(--text-sub-color);
        height: 36px;
        line-height: 36px;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        margin-top: 30px;
    }
    .top .t .m {
        letter-spacing: 0.5px;
    }
    .status.pending{

  color: #faa600;

}
.status.ok {

    color: #24af6c;

}
.status.can{

    color: #f14545;

}
</style>