import { createRouter, createWebHistory } from 'vue-router'
import Maket from '../views/Market/index.vue'
import Buy from '../views/Buy/index.vue'
import Person from '../views/Person/index.vue'
import History from '../views/History/index.vue'
import Invest from '../views/Invest/index.vue'
import Analysis from '../views/Person/index.vue'
import Profile from '../views/Profile/index.vue'
import Not from '../views/Layout/not.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import('../views/Home/index.vue')
    }
    ,
    {
      path: '/market',
      name: 'market',
      component: Maket
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/invest',
      name: 'invest',
      component: Invest
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
    ,
    {
      path: '/buy/:id?',
      name: 'buy',
      component: Buy
    }
    ,
    {
      path: '/person',
      name: 'person',
      component: Person
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis
    }
    ,
    {
      path: '/no-support',
      name: 'support',
      component: Not
    },
    {
      path: '/:pathMatch(.*)',
      name: 'home',
      component: ()=> import('../views/Home/index.vue')
    }
    // { path: '/:pathMatch(.*)*', redirect: '/' },
  ]
}) 

// router.beforeEach((to, from, next) => {
//   const publicPages = ["/"];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem("user");
//   if (authRequired && !loggedIn) {
//     next("/");
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const publicPages = ["/market", "/history", "/invest", "/profile", "/buy", "/person", "/analysis", "/no-support"]; // Các trang công khai
  const authRequired = publicPages.includes(to.path) // Kiểm tra xem đường dẫn hiện tại có yêu cầu đăng nhập không
  const loggedIn = localStorage.getItem("user");
  if (authRequired && !loggedIn) {
    // Nếu truy cập trang yêu cầu đăng nhập mà chưa đăng nhập, chuyển hướng về trang chủ
    next("/");
  } else if (/^\/buy(?:\/\w+)?$/.test(to.path) && !loggedIn) {
    // Nếu truy cập trang yêu cầu đăng nhập mà chưa đăng nhập, chuyển hướng về trang chủ
    next("/");
  } else {
    // Nếu đã đăng nhập hoặc truy cập trang công khai, cho phép tiếp tục
    next();
  }
});


router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location = to.fullPath
  }
})

function reloadPage() {
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '/market' || currentPath === '/person' || currentPath === '/profile' || currentPath === '/invest' ) {
    window.location.reload();
  }
}

setInterval(reloadPage, 10 * 60 * 1000);

export default router
