import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/',
      name: 'home',
      component:() => import('@/views/Home')
    },
    {
      path: '/about',
      name: 'about',
      component:() => import('@/views/About')
    },
    {
      path: '/loadmore',
      name: 'loadmore',
      component:() => import('@/views/loadmore')
    },
  ]
})
