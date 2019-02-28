import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueFirestore from 'vue-firestore'
import './registerServiceWorker'
import { store } from './services/Store'

Vue.config.productionTip = false
Vue.use(VueFirestore)

new Vue({
  router,
  data: store,
  render: h => h(App)
}).$mount('#app')
