import Vue from 'vue'
import Router from 'vue-router'
import console from '@/components/console'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'console',
      component: console
    }
  ]
})
