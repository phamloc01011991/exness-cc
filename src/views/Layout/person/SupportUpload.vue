<script setup>
import { onMounted, ref } from 'vue'
import { languagePack } from '../../../languages';
const emit = defineEmits(['close-popup'])

const theme = ref(localStorage.getItem('theme') || 'dark');;
const props = defineProps({
    status: Number
})


const closePopup = () => {
  emit('close-popup')
}


onMounted(() => {
  
})
</script>
<template>
  <div class="support-depoint" :data-theme="theme">
    <div class="content">
        <div class="top">
            <h4>{{ languagePack.person_support_upload_title }}</h4>
            <span @click="closePopup"><i class='bx bx-x' ></i></span>
        </div>
        <div class="p">
            {{ props.status != 1 ? (props.status === 3 ? languagePack.person_support_upload_p1 : languagePack.person_support_upload_p2) : languagePack.person_support_upload_p3 }}
        </div>
    </div>
  </div>
</template>
<style scoped>
.support-depoint {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.27);
    z-index: 999999;
}
.content {
    position: absolute;
    bottom: 0;
    padding-top: 20px;
    padding-bottom: 75px;
    left: 0;
    right: 0;
    padding-inline: 12px;
    background-color: var(--background-sub);
    border-radius: 10px 10px 0px 0px;
    color: var(--text-sub-color);
}
.p {
    color: var(--text-sub-color);
}
h4 {
    font-size: 16px;
    margin-bottom: 30px;
}
.top {
    display: flex;
    justify-content: space-between;
}
.top span i {
    vertical-align: middle;
}
.top span {
    display: inline-block;
    color: var(--text-sub-color);
    background: var(--background-close);
    width: 20px;
    height: 20px;
    border-radius: 10px;
    text-align: center;
    line-height: 20px;
}
</style>
