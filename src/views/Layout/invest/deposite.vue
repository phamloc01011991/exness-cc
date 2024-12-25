<script setup>
import { ref } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
import depositeSuccess from './depositeSuccess.vue';
const theme = ref(localStorage.getItem('theme') || 'dark');;
const emit = defineEmits(['close-popup', 'reloadAmount'])
const depositeAmount = ref();
const showSuccess = ref(false)
const err = ref('');
const dataSuccess = ref()
const closePopup = () => {
  emit('close-popup')
}
const reloadAmount = (id) => {
    emit('reloadAmount', id)
}
const props = defineProps({
    userLogined: Object,
    idStaking: Number,
    dateHold: Number,
    idStakingUser: null || Number
})
function setMax() {
    depositeAmount.value = props.userLogined.balance
}
async function deposite() {
    document.getElementsByClassName('deposite1 button')[0].disabled = true;
    console.log(document.getElementsByClassName('deposite button'));
    err.value = '';
    if (depositeAmount.value < 10) {
        err.value = languagePack.invest_deposite_err1
        document.getElementsByClassName('deposite button')[0].disabled = '';
        return
    }
    if (depositeAmount.value > 1999999) {
        err.value = languagePack.invest_deposite_err2
        document.getElementsByClassName('deposite button')[0].disabled = '';
        return
    }
    if (depositeAmount.value > props.userLogined.balance) {
        err.value = languagePack.invest_deposite_err3
        document.getElementsByClassName('deposite button')[0].disabled = '';
        return
    }
    if(!props.idStakingUser) {
        const res = await request.post('/staking-user', {
            staking_id: props.idStaking,
            balance_hold: parseFloat(depositeAmount.value)
        })
        document.getElementsByClassName('deposite1 button')[0].disabled = '';
        if(res.data.success) {
            showSuccess.value = true
            dataSuccess.value = res.data.data
        }
    }else {
        const res = await request.put(`/staking-user/${props.idStakingUser}`, {
            type: 'toup',
            price: parseFloat(depositeAmount.value)
        })
        document.getElementsByClassName('deposite1 button')[0].disabled = '';
        if(res.data.success) {
            showSuccess.value = true
            dataSuccess.value = res.data.data
            reloadAmount(res.data.data.staking_id)
        }
    }
    

}
</script>
<template>
    <div class="tranfer-popup" :data-theme="theme">
        <div class="topp">
            <div class="top">
                <div class="back"><i class='bx bx-left-arrow-alt' @click="closePopup"></i></div>
                <div class="t">
                    <span class="m">{{ languagePack.invest_deposite_transfer }}</span>
                </div>
            </div>
        </div>
        <div class="transfer">
            <div class="from trans">
                <div class="left">
                    <span class="to">{{ languagePack.invest_deposite_from }}</span>
                    <span class="ti">{{ languagePack.invest_deposite_from1 }}</span>
                </div>
                <i class="bx bxs-down-arrow" style="font-size: 8px;"></i>
            </div>
            <div class="to trans">
                <div class="left">
                    <span class="to">{{ languagePack.invest_deposite_to }}</span>
                    <span class="ti">{{ languagePack.invest_deposite_to1 }} {{ props.dateHold }} {{ languagePack.invest_deposite_todate }}</span>
                </div>
                <i class="bx bxs-down-arrow" style="font-size: 8px;"></i>
            </div>
        </div>
        <div class="hr"></div>
        <div class="funcs">
            <div class="form-control">
                <label for="amout">{{ languagePack.invest_deposite_amount }}</label>
                <div class="form-input">
                    <input id="amout" type="number" placeholder="Nhập số tiền cần chuyển" v-model="depositeAmount">
                    <div class="not">
                        <span class="max" @click="setMax">{{ languagePack.invest_deposite_max }}</span>
                        <span class="usd">USD</span>
                    </div>
                </div>
            </div>
            <div class="bl">
                <span class="k">{{ languagePack.invest_deposite_available }}</span>
                <span>{{ props.userLogined.balance }} USD</span>
            </div>
            <span class="err">{{ err }}</span>
            <button class="deposite1 button" @click="deposite">
                {{ languagePack.invest_deposite_submit }}
            </button>
        </div>
        <depositeSuccess v-if="showSuccess" @close-popup="showSuccess = false" :dataSuccess="dataSuccess"/>
    </div>
</template>
<style scoped>
    
    .err {
        display: block;
        line-height: 25px;
        font-size: 13px;
        font-weight: 500;
        color: #f14545;
        transition: ease-in-out all 1s;
        margin-top: 10px;
        text-align: center;
    }
    .tranfer-popup {
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
        padding-bottom: 75px;
    }
    .hr {
        width: 100%;
        height: 8px;
        background: var(--background-overall);
    }
    .topp {
        padding: 40px 12px 0px 12px;
        
    }
    .tranfer-popup .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .tranfer-popup .top .history i {
        display: inline-block;
        font-size: 25px;
    }
    .top .back {
        font-size: 25px;
    }

    .tranfer-popup .top .t {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .tranfer-popup  .t .m {
        font-size: 15px;
    }

    .tranfer-popup .t span {
        display: block;
    }

    .tranfer-popup .t  .m {
        font-size: 16px;
    }
    .funcs {
        margin-top: 8px;
        padding: 25px 12px 40px 12px;
    }
    .funcs .form-input {
        border-radius: 10px;
        background: var(--background-input);
        display: flex;
        align-items: center;
    }
    .funcs .form-control label {
        font-weight: 600;
        display: block;
        margin-bottom: 5px;
    }
    .funcs .form-input input {
        display: inline-block;
        width: 70%;
        padding: 10px 15px;
        background: none;
        outline: none;
        border: none;
        font-size: 15px;
        color: var(--text-color);
    }
    .funcs .form-input .not {
        display: flex;
        align-items: center;
        width: 50%;
    }
    .funcs .form-input .not .max {
        color: #faa600;
        border-right: 2px solid var(--border-color);
    }
    .funcs .form-input .not span {
        display: block;
        width: 50%;
        text-align: center;
    }
    .funcs .button {
        margin-top: 40px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        border-radius: 5px;
        width: 100%;
        outline: none;
        border: none;
    }
    .transfer {
        padding: 0px 30px 0px 30px;
    }
    .trans {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
    }
    .from {
        border-bottom: 1px solid var(--border-color);
    }
    .trans .left {
        display: inline-block;
    }
    .trans i {
        display: inline-block;
        color: var(--text-sub-color);
    }
    .trans .left .to {
        min-width: 50px;
        display: inline-block;
        font-size: 12px;
        color: var(--text-sub-color);
        padding-block: 20px;
    }
    .bl {
        display: flex;
        justify-content: space-between;
        margin-top: 7px;
    }
    .bl .k {
        color: var(--text-sub-color);
    }
    .bl .usd {
        font-weight: 600;
    }
   

</style>