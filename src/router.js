import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      beforeEnter: (to, from, next) => {
        const authState = sessionStorage.getItem('authState');
        if (authState) {
          next('/');
        } else {
          next();
        }
      }
    },
    {
      path: '/console/dashboard',
      name: 'console',
      component: () => import('./views/dashboard/Home.vue'),
      beforeEnter: (to, from, next) => {
        const authState = sessionStorage.getItem('authState');
        if (authState) {
          next();
        } else {
          next('/login');
        }
      }
    },
  ]
})
