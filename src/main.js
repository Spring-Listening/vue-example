import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import store from '@/store/store'
import '@/utils/initRem'
import * as Global from '@/components/global'

Vue.config.productionTip = false
Vue.use(Global)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
