<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
const theme = ref(localStorage.getItem('theme') || 'dark');;
const emit = defineEmits(['close-popup'])
const listHistory = ref()
const closePopup = () => {
  emit('close-popup')
}
const props = defineProps({
    idPackage: Number
})

async function getListHistory() {
    const res = await request.get(`/staking-user/history/${props.idPackage}`, {
        params: {
            limit: 20
        }
    })
    listHistory.value = res.data.data
}
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

onMounted(async ()=> {
    await getListHistory();
})

</script>
<template>
    <div class="history-farming" :data-theme="theme">
        <div class="topp">
            <div class="top">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <div class="t">
                    <span class="m">{{ languagePack.invest_history_farming_title }}</span>
                </div>
            </div>
        </div>
        <div class="his">
            <div class="item" v-for="(item, index) in listHistory" :key="index">
                <div class="left">
                    <div>USD</div>
                    <div class="time">{{ changeDate(item.createdAt) }}</div>
                </div>
                <div class="right">
                    <div>{{ item.balance_interest }}</div>
                    <div :class="item.is_taked ? 'status ok':'status pending'">{{ item.is_taked ? languagePack.invest_history_farming_status1 : languagePack.invest_history_farming_status2 }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
   .history-farming {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 100vh;
        min-height: 100vh;
        z-index: 999;
        overflow-y: scroll;
        background: var(--background-color);
        overflow-x: hidden;
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
    .his {
        padding: 10px 12px 75px 12px
    }
    .his .item {
        display: flex;
        justify-content: space-between;
        margin-block: 15px;
    }

    .his .item .right {
        text-align: right
    }
    .time {
        color: var(--text-sub-color);
    }
    .status {
        position: relative;
        display: inline-block;
    }
    .status.ok::after {
        content: '';
        position: absolute;
        display: block;
        width: 6px;
        height: 6px;
        background: #24af6c;
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
    }
    .status.pending::after {
        content: '';
        position: absolute;
        display: block;
        width: 6px;
        height: 6px;
        background: #faa600;
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
    }

</style>