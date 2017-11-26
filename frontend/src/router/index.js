import Vue from 'vue'
import Router from 'vue-router'
import StatusPage from '@/components/pages/StatusPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StatusPage',
      component: StatusPage
    }
  ]
})
