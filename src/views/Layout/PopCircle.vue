<script setup>
import {onMounted,defineProps,ref} from 'vue'
import { languagePack } from '../../languages';
const theme = ref(localStorage.getItem('theme') || 'dark');
function loadSeconds(number){
    let seconds = document.getElementById('seconds')
    let sec_dot = document.querySelector('.sec_dot')
    let ss = document.getElementById('ss')
    var s = number
    let limit = number
    for(let i = 0;i < s + 1;i++){
        setTimeout(()=>{
            seconds.innerHTML = `<span style='font-size:1.5em;'>${s}</span>` + "<br><span style='font-size:0.55em;'>SECONDS</span>"
            ss.style.strokeDashoffset = 440 - (440 * s) / limit
            sec_dot.style.transform = `rotateZ(${s * 360/limit}deg)`
            s = s - 1
            var num = i
            if(num == number){
                load.value = true
            }
        },1000 * i)
    }
}
const load = ref(false)
const props = defineProps({
    second: Number,
    name:String
});
onMounted(()=>{
    loadSeconds(props.second)
})
</script>
<template :data-theme="theme">
    <div class="circle" style="--clr:#16ba0c;">   
        <div class="dots sec_dot"></div>  
        <svg>
            <circle cx="70" cy="70" r="70"></circle> 
            <circle cx="70" cy="70" r="70" id="ss"></circle>
        </svg>
        <div id="seconds"><span style='font-size:1.5em;'>00</span><br><span style='font-size:0.55em;'>SECONDS</span></div>  
    </div>
    <div class="popbuy-wait" v-if="load">
        <img width="50" class="popbuy-wait__icon" height="50" src="../../assets/load.gif"/>
        <div class="popbuy-wait__data" ><span>{{ languagePack.popcircle_processcing }}</span></div>
    </div>
</template>
<style scoped>
.circle{
    position:relative;
    width:150px;
    height:150px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:0 auto;
}
.circle svg{
    position:reactive;
    width:150px;
    height:150px;
    transform: rotate(270deg);
}
.circle svg circle{
    width:100%;
    height:100%;
    fill:transparent;
    stroke-width:8;
    stroke:var(--background-sub);
    box-shadow:0 0 20px #dfdfdf,
    0 0 60px #dfdfdf;
    transform:translate(5px,5px);
}
.circle svg circle:nth-child(2){
    stroke:var(--clr);
    stroke-dasharray: 440;
    stroke-dashoffset: 440;
}
.circle div{
    position:absolute;
    text-align:center;
    font-weight:500;
    color:var(--text-color);
    font-size:1.5em;
}
.dots{
    position:absolute;
    width:100%;
    height:100%;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    z-index:1000;
}
.dots::before{
    content:"";
    position:absolute;
    top:-3px;
    width:15px;
    height:15px;
    background:var(--clr);
    border-radius:50%;
    box-shadow:0 0 20px var(--clr),
    0 0 60px var(--clr);
}
.popbuy-wait{
    position:absolute;
    top:0;
    left: 0;
    width:100%;
    height:100%;
    text-align:center;
    padding-top:35%;
    background: var(--background-color);
    border-radius: 10px;
    z-index: 99999;
}
.popbuy-wait__icon{
    margin:0;
}
.popbuy-wait__data{
    margin-top: 20px;
    font-size:14px;
    font-weight: 500;
}
</style>