import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import choiceDepartment from '@/components/choiceDepartment'
import choicePeople from '@/components/choicePeople'
import makeAnswer from '@/components/makeAnswer'
import quesDia from '@/components/quesDia'
import textContent from '@/components/textContent'
import quesDia_one from '@/components/quesDia_one'
import diaLogin from '@/components/diaLogin'

// 导入 table 和 分页组件
import { VTable, VPagination } from 'vue-easytable'

// 注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
Vue.use(Router)




export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/textContent',
      name: 'textContent',
      component: textContent
    },
    {
      path: '/choiceDepartment',
      name: 'choiceDepartment',
      component: choiceDepartment
    },
    {
      path: '/choicePeople',
      name: 'choicePeople',
      component: choicePeople
    },
    {
      path: '/makeAnswer',
      name: 'makeAnswer',
      component: makeAnswer
    },
    
    {
      path: '/quesDia',
      name: 'quesDia',
      component: quesDia
    },
    {
      path: '/quesDia_one',
      name: 'quesDia_one',
      component: quesDia_one
    },
    {
      path: '/diaLogin',
      name: 'diaLogin',
      component: diaLogin
    }
  ]
})
