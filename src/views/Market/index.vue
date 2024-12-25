<script setup>
import { ref, onMounted,onUnmounted  } from 'vue'
import { languagePack } from '../../languages'
import Item from '../Layout/Item.vue'
import Item1 from '../Layout/Item1.vue'
import request from '../../utils/request'
import loadApp from '../Layout/LoadApp.vue'

const loadding = ref(false)
const idInterval = ref('')
const isStatus = ref(false)
const symbols = ref("")
async function getListSympol(limit){
    try {
        await request.get('coinList/listing', {
        params: {
            "limit": limit
        }
    }).then(res => {
        isStatus.value = !isStatus.value
        symbols.value = {
            data:res.data.data,
            status: isStatus.value
        }
        loadding.value = true
    })
    } catch (error) {
        console.log(error);
    }
    
}
function isSaturdayOrSundayNorthAmerica() {
  var currentDate = new Date();
  var currentTimezone = 'America/New_York'; // Múi giờ Bắc Mỹ
  
  // Xác định ngày hiện tại theo múi giờ Bắc Mỹ
  var currentDay = currentDate.toLocaleString('en-US', { weekday: 'long', timeZone: currentTimezone });
  
  return currentDay === 'Saturday' || currentDay === 'Sunday' || currentDay === 'Friday';
}


var isWeekend = isSaturdayOrSundayNorthAmerica();
const theme = ref(localStorage.getItem('theme') || 'dark');;

function transferType(type) {
  var i, x, tablinks
  x = document.getElementsByClassName('markets-body')
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  tablinks = document.getElementsByClassName('link')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active')
  }
  document.getElementById(type).classList.add('active')
  document.getElementById(type + '1').style.display = 'block'
}

onMounted(()=>{
    getListSympol(35)
    idInterval.value = setInterval(()=>{
        getListSympol(35)
    },3000)
})
onUnmounted(()=>{
    clearInterval(idInterval.value)
})
</script>

<template>
    <div  class="main" :data-theme="theme">
       <div class="main-content">
            <div class="markets">

                <div class="tablink">
                    <span id="trending" class="link" @click="transferType('trending')">Trending</span>
                    <span id="all" class="link active" @click="transferType('all')">{{ languagePack.market_contract }}</span>
                    <span id="new" class="link" @click="transferType('new')">{{ languagePack.market_new }}</span>
                </div>
                <div id="trending1" class="markets-body" style="display: none;">
                    <div class="list-data">
                        <div class="list-item list-data__title flex" style="color: var(--text-sub-color); margin-bottom: 5px;">
                            <div class="name" style="width:35%">{{ languagePack.market_list1 }}</div>
                            <div class="price" style="width:33%;text-align:right;">{{ languagePack.market_list2 }}</div>
                            <div class="percent" style="width:32%;text-align:right;">{{ languagePack.market_list3 }}</div>
                        </div>
                        <template v-if="isWeekend == false">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item v-if="item.status == '1'"
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                        <template v-if="isWeekend == true">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item1 v-if="item.status == '1'"
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                    </div>
                </div>
                <div id="all1" class="markets-body">
                    <div class="list-data">
                        <div class="list-item list-data__title flex" style="color: var(--text-sub-color); margin-bottom: 5px;">
                            <div class="name" style="width:35%">{{ languagePack.market_list1 }}</div>
                            <div class="price" style="width:33%;text-align:right;">{{ languagePack.market_list2 }}</div>
                            <div class="percent" style="width:32%;text-align:right;">{{ languagePack.market_list3 }}</div>
                        </div>
                        <template v-if="isWeekend == false">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                        <template v-if="isWeekend == true">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item1
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                    </div>
                </div>
                <div id="new1" class="markets-body" style="display: none;">
                    <div class="list-data">
                        <div class="list-item list-data__title flex" style="color: var(--text-sub-color); margin-bottom: 5px;">
                            <div class="name" style="width:35%">{{ languagePack.market_list1 }}</div>
                            <div class="price" style="width:33%;text-align:right;">{{ languagePack.market_list2 }}</div>
                            <div class="percent" style="width:32%;text-align:right;">{{ languagePack.market_list3 }}</div>
                        </div>
                        <template v-if="isWeekend == false">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item v-if="item.status == '2'"
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                        <template v-if="isWeekend == true">
                            <template v-for="(item, index) in symbols.data" :key="index">
                                <Item1 v-if="item.status == '2'"
                                    :name="item.symbol" 
                                    :data="item.data"
                                    :vitri="index"
                                />
                            </template>
                        </template>
                    </div>
                </div>
            </div>  
       </div>
    </div>
    <div v-if="loadding == false">
      <loadApp />
    </div>
</template>

<style scoped>
.tablink {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
    padding-inline: 12px;
}
.tablink span {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-sub-color);
    display: inline-block;
    margin-right: 15px;
    position: relative;
}
.tablink span:last-child {
    margin-right: 0;
}
.tablink span.active {
    color: var(--text-color);
}
.tablink span.active::after {
    content: '';
    width: 100%;
    height: 2px;
    display: block;
    background-color: #faa600;
    position: absolute;
    right: 0;
    bottom: -11px;
    transition: ease all 0.7s;
}
.main{
    padding-top: 45px;
    padding-bottom: 75px;
    height: 100vh;
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-y: scroll;
}
.main-content{
    width:100%;
}
.flex{
    display:flex;
}
.list-item>div {
  font-weight: 500;
  font-size: 13px;
}
.markets-body {
    padding-inline: 12px;
}
/*  */
</style>
