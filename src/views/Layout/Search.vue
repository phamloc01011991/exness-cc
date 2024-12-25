<script setup >
</script>
<template >
    <div class="search">
        <input type="text" placeholder="">
        <i class='bx bx-search' ></i>
    </div>
</template>
<style scoped>
    .search {
        padding: 5px 10px;
        height: 35px;
        background-color: var(--background-input);
        position: relative;
        border-radius: 10px;
        width: 100%;
    }
    .search i {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
    }
    .search input {
        background: none;
        border: none;
        width: 100%;
        height: 100%;
        padding-left: 35px;
        outline: none;
        color: var(--text-color);
        text-transform: uppercase;
    }
    .search input::placeholder {
        font-size: 14px;
    }
</style>