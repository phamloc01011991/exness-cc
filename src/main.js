import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment';
import App from './App.vue'
import router from './router'
import store from './stores/index'


import './assets/main.css'
/* add icons to the library */

// const checkDevives = async () => {
//     var useagent = navigator.userAgent
//     if(useagent.includes("Windows") || useagent.includes("Macintosh")){
//         //react 
//         location.href = "https://anfindsoft.com/"
//     }
// }
// await checkDevives()
// Check brower
moment.locale('vi');

const app = createApp(App)
app.config.globalProperties.$moment=moment;
app.use(createPinia())
app.use(router)
app.use(store)
app.mount('#app')
