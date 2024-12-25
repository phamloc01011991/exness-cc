<script setup>
    import {  ref, onMounted } from 'vue';
    import { languagePack } from '../../languages/index'
    import loadApp from '../Layout/LoadApp.vue';
    import request from '../../utils/request'
    import { formatUsdt, usdToVnd } from '../../utils/money'
    import Introduce from '../Layout/invest/introduce.vue'
    import Caculate from '../Layout/invest/caculate.vue'
    import Banner from '../Layout/invest/banner.vue'
    import ItemFarming from '../Layout/invest/ItemFarming.vue'

    const showIntroduce = ref(false)
    const showCaculate = ref(false)
    const loadding = ref(false)
    const lstHistory = ref()
    const config = ref()
    const userLogined = ref('')
    const totalInterest = ref(0)
    const bonus = ref(0)
    const mpy = ref(0)
    const stakinglist = ref();
    const showFarming = ref(true);
    const showFarmingItem = ref(false);
    const itemFarming = ref()

    function showItemFarming(data) {
        showFarmingItem.value = true;
        itemFarming.value = data;
    }

    async function loadCheck() {
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
    }

    async function caculateInterest() {
        let balanceVND = await usdToVnd(userLogined.value.balance)
        for(let i=config.value.length-1; i>=0; i--) {
            if(balanceVND >= config.value[i].value){
                mpy.value = config.value[i].percent * 30
                bonus.value = userLogined.value.balance*config.value[i].percent/100
                return
            }
        }
    }
    async function getStakingList() {
        await request.get('/staking').then((res) => {
            if (res.data.success === true) {
                itemFarming.value = stakinglist.value = res.data.data;
                loadding.value = true
            }
        })
    }
    async function reloadAmount(id) {
        await getStakingList();
        await loadCheck();
        itemFarming.value = stakinglist.value.result[id - 1];
    }
    async function loadHistory() {
        await request.get('history_interest',{
            params: {
                page: 1,
                limit: 15
            }
            }).then((res) => {
            if (res.data.success === true) {
                totalInterest.value = res.data.sum;
                lstHistory.value = res.data.data;
            }
        })
    }



    async function getConfig() {
        await request.get('user/config-interest').then((res) => {
            if (res.data.success === true) {
                config.value = res.data.data;
            }
        })
    }

    const theme = ref(localStorage.getItem('theme') || 'dark');;

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

    onMounted(async () => {
        await loadCheck();
        await loadHistory();
        await getConfig();
        await caculateInterest();
        await getStakingList();
    })
</script>

<template>
    <div  class="main" v-if="loadding == true" :data-theme="theme">
        <div class="tab-control">
            <span :class="showFarming ? 'active':'inactive'" @click="showFarming = true">Farming</span>
            <span :class="!showFarming ? 'active':'inactive'" @click="showFarming = false">{{ languagePack.invest_title }}</span>
        </div>
        
        <div class="tab-content farming" v-show="showFarming">
            <div class="balance">
                <span class="title">{{ languagePack.invest_following_title }}</span>
                <span class="usd">{{ formatUsdt(stakinglist.balance_hold_total) }} USD</span>
            </div>
            <div class="wr">
                <Banner />
                <h4>{{ languagePack.invest_farming_title }}</h4>
                <div class="item" v-for="(item, index) in stakinglist.result" :key="index">
                    <div class="top">
                        <div class="left">
                            <div class="icon">
                                <i class='bx bx-dollar-circle m' ></i>
                                <i class='bx bx-dollar-circle s' ></i>
                            </div>
                            <div class="t">
                                <span class="m">{{ languagePack.invest_depoint }} USD</span>
                                <span class="s">{{ languagePack.invest_recieve }} USD</span>
                            </div>
                        </div>
                        <div class="right">
                            <span class="m">{{ item.interestRate * 30 }}%</span>
                            <span class="s">MPY</span>
                        </div>
                    </div>
                    <div class="date-hold">
                        <span class="s">{{ languagePack.invest_circle }}</span>
                        <span>{{ item.dateHold }} {{ languagePack.invest_date }}</span>
                    </div>
                    <div class="rate-bonus">
                        <span class="s">{{ languagePack.invest_rate }}</span>
                        <span>100:{{ item.interestRate }}</span>
                    </div>
                    <div class="detail">
                        <span @click="showItemFarming(item)">{{ languagePack.invest_info_detail }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-content over" v-show="!showFarming">
            <div class="mmm" v-if="showCaculate == false && showIntroduce == false">
                <div class="top">
                    <div class="left">
                        <h2>{{ languagePack.invest_title }}</h2>
                        <span style="color: var(--text-sub-color); font-size: 13px;">{{ languagePack.invest_farming_sub_title }}</span>
                    </div>
                    <div class="right">
                        <img class="img1" src="../../assets/dollar-symbol2.png" alt="">
                        <img class="img2" src="../../assets/dollar-symbol.png" alt="">
                    </div>
                </div>
                <div class="main-content">
                    <div class="center">
                        <div class="t">
                            <h3>{{ languagePack.invest_farming_recieving }}</h3>
                            <span class="link" @click="showIntroduce=true">Chính sách >></span>
                        </div>
                        <div class="content">
                            <div class="c-top">
                                <span class="sp1">{{ languagePack.invest_recieve_today }}</span>
                                <span class="sp2">+{{ formatUsdt(parseFloat(bonus).toFixed(2)) }} USD</span>
                            </div>
                            <div class="c-bt">
                                <h4>{{ languagePack.invest_farming_flex }}</h4>
                                <div class="ct">
                                    <div class="l">
                                        <span class="sp1">{{ languagePack.invest_asset }}</span>
                                        <span class="sp2">
                                            USD
                                        </span>
                                    </div>
                                    <div class="c" style="text-align: right;">
                                        <span class="sp1">MPY(%/{{ languagePack.invest_month }})</span>
                                        <span class="sp2">{{mpy}}%</span>
                                    </div>
                                    <div class="r" style="text-align: right;">
                                        <span class="sp1">{{ languagePack.invest_bonus }}</span>
                                        <span class="sp2 bonus">+{{ formatUsdt(parseFloat(bonus).toFixed(2)) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="history">
                        <div class="t">
                            <h3>{{ languagePack.invest_farming_history }}</h3>
                        </div>
                        <div class="total">
                            <div class="l">
                                <span class="sp1">{{ languagePack.invest_farming_recieved }}</span>
                                <span class="sp2">{{ totalInterest ? parseFloat(totalInterest).toFixed(2) : 0 }} USD</span>
                            </div>
                            <div class="r">
                                <span @click="showCaculate=true">
                                    {{ languagePack.invest_farming_caculate }} (%) >>
                                </span>
                            </div>
                        </div>
                        <div class="ct">
                            <ul v-if="lstHistory != false">
                                <li v-for="item in lstHistory">
                                    <div class="l">
                                        <img  width="30" style="border-radius: 50%;" src="../../assets/dollar.png" alt="">
                                    </div>
                                    <div class="c">
                                        <span class="tt">{{ languagePack.invest_farming_history_title }}</span>
                                        <span class="dt">{{ changeDate(item.createdAt )}}</span>
                                    </div>
                                    <div class="r">
                                        <span>+{{ formatUsdt(parseFloat(item.additional_fee).toFixed(2)) }} USD</span>
                                    </div>
                                </li>
                            </ul>
                            <div v-else class="not-l">
                                <img src="../../assets/file.png" alt="">
                                <p>{{ languagePack.invest_farming_untitle }}</p>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
        </div>
       <Introduce v-if="showIntroduce" :config="config" @close-popup="showIntroduce = false"/>
       <Caculate v-if="showCaculate" :config="config" @close-popup="showCaculate = false"/>
       <ItemFarming :data = "itemFarming" v-if="showFarmingItem" @reloadAmount="reloadAmount($event)" @close-popup="showFarmingItem = false" :userLogined="userLogined"/>
       
    </div>
    <div v-else>
     <loadApp />
    </div>
</template>
<style scoped>

.main {
    color: var(--text-color);
    background-color: var(--background-overall);
    height: 100vh;
    min-height: 100vh;
    overflow-y: scroll;
    padding-bottom: 75px;
    
}
.tab-control {
    background: var(--background-color);
    padding: 55px 12px 15px 12px;

}
.tab-control span {
    font-size: 19px;
    font-weight: 600;
    margin-right: 20px;
}
.tab-control .inactive {
    color: var(--text-sub-color);
}
.tab-content.farming .wr {
    padding: 15px 12px;
}
.tab-content.over {
    margin-top: 8px;
    padding: 15px 12px;
}
.tab-content h4 {
    margin-top: 20px;
    font-size: 16px;
    margin-bottom: 10px;
}
.farming .balance {
    background: var(--background-color);
    padding-inline: 12px;
    padding-bottom: 20px;
}
.farming .balance span {
    display: block;
}
.farming .balance .title {
    color: var(--text-sub-color);
    margin-bottom: 5px;
}
.farming .balance .usd {
    font-size: 23px;
    font-weight: 700;
}

.farming .item {
    background: var(--background-color);
    padding: 15px;
    margin-bottom: 8px;
    border-radius: 10px;
}
.farming .item .top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
}
.farming .item .top .icon {
    position: relative;
}
.farming .item .top i {
    display: inline-block;
    color: #faa600;
}
.farming .item .top i.m{
    font-size: 30px;
}
.farming .item .top i.s {
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 25px;
}
.farming .item .top .left {
    display: flex;
    align-items: center;
}
.farming .item .top .left .t {
    margin-left: 22px;
}
.farming .item .top .left .t .m {
    font-size: 15px;
}
.farming .item .top .left .t .s {
    font-size: 13px;
    color: var(--text-sub-color);
}
.farming .item .top .left .t span {
    display: block;
}
.farming .item .top .right span{
    display: block;
}  
.farming .item .top .right .m {
    font-size: 15px;
}
.farming .item .top .right .s {
    font-size: 13px;
    color: var(--text-sub-color);
}
.date-hold, .rate-bonus {
    display: flex;
    justify-content: space-between;
    padding-block: 10px;
    border-bottom: 1px solid var(--border-color);
}
.date-hold .s, .rate-bonus .s {
    color: var(--text-sub-color);
}

.detail span {
    display: block;
    text-align: center;  
    padding-top: 15px;
    color: #faa600;;
}
/* ---------- */

.over .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 40px;
    padding-top: 60px;
    padding-inline: 12px;
    background: var(--background-color);
    border-radius: 10px;
}
.over .top .left {
    width: 65%;
}
.top h2 {
    font-weight: 700;
    letter-spacing: 0.3px;
    font-size: 27px;
}

.right img {
    width: 40px;
} 
.right .img2 {
    margin-bottom: 15px;
}
.center .t {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.center .t .link {
    color: #24af6c;
    display: inline-block;
}
.center .content {
    background-color: var(--background-color);
    border-radius: 5px;
}
h3 {
    margin-block: 15px;
    font-weight: 600;
    font-size: 17px;
}
.content .c-top {
    padding: 15px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.244);
}
.content .c-top .sp1 {
    font-size: 13px;
    color: var(--text-sub-color);
}
.bonus {
    color: #24af6c;
}
.content .c-top .sp2 {
    font-size: 23px;
    color: #24af6c;
    font-weight: 600;
}
.content .c-top span {
    display: block;
}
.c-bt {
    padding: 15px;
}
.c-bt .ct {
    display: flex;
    justify-content: space-between;
}
h4 {
    font-weight: 600;
    margin-bottom: 5px;
}
.c-bt .ct span {
    display: block;
}
.c-bt .ct .sp1 {
    color: var(--text-sub-color);
    margin-bottom: 5px;
}
.c-bt .ct .sp2 {
}
.history .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.history .total .sp1{
    color: var(--text-sub-color);
}
.history .total .sp2 {
    font-size: 17px;
}
.history .total span {
    display: block;
}
.history .total .r span{
    color: #24af6c;
}
.history .ct {
    margin-top: 20px;
}
.history .ct li {
    display: flex;
    align-items: center;
    padding-block: 10px;
}
.history .ct li .l {
    display: flex;
    align-items: center;
    width: 12%;
    justify-content: left;
}
.history .ct li .c {
    width: 48%;
}
.history .ct li .r {
    text-align: right;
    width: 40%;
}
.history .ct li:not(:last-child) {
    border-bottom: 1px solid rgba(128, 128, 128, 0.244);
}
.history .ct li span {
    display: block;
}

.history .ct .c .tt {
    font-weight: 500;
}
.history .ct .c .dt {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-sub-color);
}
.history .ct .r span {
    color: #24af6c;
    font-size: 15px;
}
.not-l {
    text-align: center;
    margin-bottom: 20px;
}
.not-l img {
    width: 45px;
    margin-bottom: 5px;
}
.not-l p {
    color: var(--text-sub-color);
} 
</style>