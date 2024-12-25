<script setup>
import {onMounted,ref} from 'vue'

const emit =defineEmits(['close-popup']);
const closePopup = () => {
  emit('close-popup');
};
onMounted(()=>{
    
})

</script>
<template>
    <div class="result">
        <div class="result-content">
            <div class="result-close"><div class="close" style="text-align: end;"><i @click="closePopup" class='bx bx-x' style='font-size:20px;color:#dfdfdf;background:red;' ></i></div></div>
            <div class="result-data" v-if="showPopCircle">   
               Xin chao
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>