<script setup>
    import {  ref, onMounted } from 'vue';
    import { languagePack } from '../../languages/index'
    import loadApp from '../Layout/LoadApp.vue';
    import request from '../../utils/request'
    import tableItem from '../Layout/tableItem.vue'
    const loadding = ref(false)
    const historys = ref()
    const theme = ref(localStorage.getItem('theme') || 'dark');
    async function loadDataHistory() {
    await request
        .get('order_history/listing', {
        params: {
            limit: 15,
            page: 0
        }
        })
        .then((res) => {
            var result = res.data
            historys.value = result.result
            loadding.value = true
        })
    }

    onMounted(async () => {
       
        await loadDataHistory()
    })
</script>

<template>
    <div  class="main" v-if="loadding == true" :data-theme="theme">
       <div class="main-content">
        <div class="history">
            <div class="history-content">
                <div class="top">
                    <div class="back">
                        <RouterLink to="/buy">
                            <i style="color: var(--text-color);" class='bx bx-left-arrow-alt' @click="closePopup"></i>
                        </RouterLink>
                    </div>
                    <h4>{{ languagePack.history_title }} </h4>
                </div>
            <div class="history-content__table">
                <div v-if="historys == false" class="history_non" style="text-align: center; margin-top: 50px;">
                    <img src="../../assets/file.png" alt="">
                    <p style="font-weight: 500; display: block; margin-top: 20px;">{{ languagePack.history_untitle }}</p>
                </div>
                <tableItem
                v-for="(item, index) in historys"
                :amount="item.amount"
                :key="index"
                :name="item.name"
                :input="item.entry_price"
                :output="item.exit_price"
                :profit="item.profit.toString()"
                :order_type="item.order_type"
                :order_result="item.order_result"
                :time="item.createdAt"
                :id="item.id.toString()"
                :order_duration ="item.order_duration.toString()"
                :profit_percentage ="item.profit_percentage.toString()"
                />
            </div>
            </div>
        </div>
       </div>
    </div>
    <div v-else>
     <loadApp />
    </div>
</template>
<style scoped>
.history {
    
}
.main-content {
    padding: 50px 12px 75px 12px;
    height: 100vh;
    min-height: 100vh;
    color: var(--text-color);
    background-color: var(--background-overall);
    overflow-y: scroll;
}
 .top {
  display: flex;
  margin-bottom: 25px;
}
 .top .back {
  font-size: 25px;
}
 .top h4 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 17px;
}
</style>