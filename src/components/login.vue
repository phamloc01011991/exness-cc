<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '../../src/stores/index'

//check login
const router = useRouter()



const sdt = ref('')
const password = ref('')

const Login = () => {
    const user = {
        sdt: sdt.value,
        password: password.value
    }
    store
        .dispatch('login', {
            user
        })
        .then(() => {
            router.push({ path: '/home' })
        })
    console.log(sdt.value)
    console.log(password.value)
}

</script>

<template>
    <h1>Login</h1>
    <span>Sdt</span>
    <input v-model="sdt" type="text" placeholder="Sdt">
    <span>Password</span>
    <input v-model="password" type="text" placeholder="password">
    <button @click="Login">Login</button>
</template>

<style></style>