<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
import { formatUsdt, usdToVnd, formatVnd } from '../../../utils/money'
import request from '../../../utils/request'
const emit = defineEmits(['close-popup', 'loadcheck'])
const theme = ref(localStorage.getItem('theme') || 'dark');;
const listBonus = ref()
const closePopup = () => {
    emit('close-popup')
}
const props = defineProps({
    check: Object
})
//ok
function getFirstNotClaimedReward() {
    return props.check?.rewardInfo?.rewardList
        .filter(item => item.status === 'notclaim')
        .sort((a, b) => a.id - b.id)[0] || null;
}

async function getBonusList() {
    const list = await request.get('user/cumulative-recharge')
    listBonus.value = list.data.data
}
async function claim(id) {
    await request.post('user/cumulative-recharge-claim', {
        idValue: id
    })
    emit('loadcheck')
}
onMounted(() => {
    getBonusList()
})
</script>

<template>
    <div class="select-lang" :data-theme="theme">
        <div class="top">
            <div class="ct">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <h4>Tích luỹ trong ngày</h4>

            </div>
        </div>
        <div class="container">
            <div class="subtop">
                <div class="t">
                    <span>Còn {{ formatUsdt(parseFloat(getFirstNotClaimedReward().value) -
                        parseFloat(check?.rewardInfo?.totalInDayToupAmount)) }}<strong> / {{
        formatUsdt(getFirstNotClaimedReward().value) }} USD</strong></span> <span class="percent">{{
        formatUsdt((parseFloat(check?.rewardInfo?.totalInDayToupAmount) /
            parseFloat(getFirstNotClaimedReward().value)
            * 100)) }}%</span>
                </div>
                <span class="progress-bar"><span class="ct"
                        :style="{ width: formatUsdt((parseFloat(check?.rewardInfo?.totalInDayToupAmount) / parseFloat(getFirstNotClaimedReward().value) * 100)) + '%' }"></span></span>
                <div class="b">
                    <span class="a">Phần thưởng tiếp theo:</span> <span>{{ formatUsdt(getFirstNotClaimedReward().reward) }}
                        USD</span>
                </div>
            </div>
            <div class="list-bonus">
                <p class="a1">Mốc nạp tiền trong ngày</p>
                <p class="a2">Số liệu được làm mới vào 0h mỗi ngày</p>
                <ul>
                    <li v-for="item in check?.rewardInfo?.rewardList" :key="item.id"
                        :class="getFirstNotClaimedReward().id == item.id ? 'active' : ''">
                        <div class="flag">
                            <i class='bx bxs-flag-alt'></i>
                        </div>
                        <div class="moc">
                            <div class="t">Khối lượng</div>
                            <div class="b">{{ formatUsdt(item.value) }} <span>USD</span></div>
                        </div>
                        <div class="bonus">
                            <div class="t">Phần thưởng</div>
                            <div class="b">{{ formatUsdt(item.reward) }} <span>USD</span></div>
                        </div>
                        <div class="recieve" v-if="item.status == 'claimable'" @click="claim(item.id)">Nhận</div>
                        <div class="recieve ed " v-else-if="item.status == 'claimed'">Đã nhận</div>
                        <div class="recieve" v-else></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 20px 0px;
}

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

.subtop {
    background: var(--background-sub);
    padding: 15px;
    border-radius: 10px;
    margin-inline: 12px;
}

.subtop .t {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.subtop .t .percent {
    color: #faa600;
}

.subtop .t strong {
    font-weight: normal;
    color: var(--text-sub-color);
}

.progress-bar {
    width: 100%;
    display: block;
    height: 7px;
    background: #474747;
    border-radius: 3px;
    margin-block: 10px;
}

.progress-bar .ct {
    display: inline-block;
    height: 100%;
    background-color: #faa600;
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.3s ease;
    border-radius: 3px;
}

.subtop .b {
    font-size: 13px;
}

.subtop .b .a {
    color: var(--text-sub-color);
}

.list-bonus {
    margin-top: 20px;
}

.list-bonus p {
    margin-inline: 12px;
}

.list-bonus .a1 {
    font-weight: 500;
    font-size: 16px;
}

.list-bonus .a2 {
    font-size: 13px;
    color: var(--text-sub-color);
}

.list-bonus ul {
    margin-top: 15px;
}

.list-bonus ul li {
    padding: 10px;
}

.list-bonus ul li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 12px;

}

.list-bonus ul li .moc {
    width: 37.5%;
}

.list-bonus ul li .bonus {
    width: 37.5%;
}

.list-bonus ul li .flag {
    width: 10%;
    font-size: 16px;
}

.list-bonus ul li .recieve {
    width: 15%;
    color: #faa600;
    font-size: 13px;
    text-align: center;

}

.list-bonus ul li .recieve.ed {
    color: var(--text-sub-color);
}

.list-bonus ul li .t {
    color: var(--text-sub-color);
    font-size: 13px;
}

.list-bonus ul li.active {
    background-color: #271d0a;
}

.list-bonus ul li.active .flag {
    color: #faa600;
    font-size: 20px;
}

.list-bonus ul li .b span {
    color: var(--text-sub-color);
    font-size: 13px;
}
</style>
