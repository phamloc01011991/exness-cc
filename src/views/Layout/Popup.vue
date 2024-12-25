<template>
  <div>
    <!-- Nội dung của popup ở đây -->
    <button @click="closePopup">Đóng Popup</button>
  </div>
</template>

<script setup>

const emit = defineEmits(['close-popup']);
const closePopup = () => {
  emit('close-popup');
};


</script>
