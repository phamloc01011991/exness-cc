<script setup>
import { languagePack } from '../../languages';
import { RouterLink, useRouter } from 'vue-router'
import { onLoadIcon } from '../../utils/orther'
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'

const router = useRouter()
const isChangeRoute = computed(() => {
  return router.currentRoute.value.path
})

const theme = ref(localStorage.getItem('theme') || 'dark');
watch(
  () => isChangeRoute.value,
  (val) => {
    onLoadIcon()
  }
)
onMounted(() => {
  onLoadIcon()
})
onUnmounted(() => {
  onLoadIcon()
})
</script>
<template>
  <footer>
    <div class="footer-tab" :data-theme="theme">
      <ul class="footer-menu">
        <li class="menu-item">
          <RouterLink to="/" class="btn ft home show">
            <div>
              <i v-if="router.currentRoute.value.path != '/'" class='bx bx-home' ></i>
              <i v-else class='bx bxs-home' ></i>
            </div>
            <div class="ft_t">{{ languagePack.footer_home }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink :to="{ name: 'market' }" class="btn ft market">
            <div>
              <i v-if="router.currentRoute.value.path != '/market'" class='bx bx-candles' ></i>
              <i v-else class='bx bx-candles' ></i>
            </div>
            <div class="ft_t">Markets</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/buy" class="btn ft buy">
            <div>
              <i class='bx bx-transfer bx-rotate-90' ></i>
            </div>
            <div class="ft_t">{{ languagePack.footer_buy }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/invest" class="btn ft invest">
            <div>
              <i v-if="router.currentRoute.value.path != '/invest'" class='bx bx-bolt-circle' ></i>
              <i v-else class='bx bxs-bolt-circle' ></i>
            </div>
            <div class="ft_t">{{ languagePack.footer_invest }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/person" class="btn ft person">
            <div>
              <i v-if="router.currentRoute.value.path != '/person'" class='bx bx-wallet-alt' ></i>
              <i v-else class='bx bxs-wallet-alt' ></i>
            </div>
            <div class="ft_t">{{ languagePack.footer_asset }}</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>


<style scoped>

.footer-tab {
  max-width: 1280px;
  margin: 0 auto;
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top: 1px solid rgba(128, 128, 128, 0.247);
  background-color: var(--background-color);
}

.footer-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 5px;
  width: 100%;
  margin: auto;
  height: 70px;
  text-align: center;
  
}
.menu-item {
  width: calc(100% / 4);
  list-style-type: none;
  display: block;
  transition: all 1s;
}
.menu-item .btn {
  margin: auto;
  border-radius: 20%;
  font-size: 11px;
}
.menu-item .btn i {
  font-size: 21px;
}
.ft_t {
  font-weight: 600;
}

/* .menu-item a.show {
  color: #faa600 !important;
} */
.menu-item a {
  text-decoration: none;
}

a {
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
a:hover {
  text-decoration: none;
}
</style>
