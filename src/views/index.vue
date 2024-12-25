<script setup>
import {  ref } from 'vue'
import Header from './Layout/Header.vue'
import Footer from './Layout/Footer.vue'

const checkLoad = ref('load')
async function checkConnect(){
    checkLoad.value = 'loaded'
}
checkConnect()




</script>

<template>
    <div v-if="checkLoad === 'load'" class="non-data">
        Đang tải
    </div>
    <div v-else class="site">
        <Header />
        <RouterView />
        <Footer  />
    </div>
</template>

<style scoped>

.site{
    width:100%;
    min-height: 100vh;
}
</style>


