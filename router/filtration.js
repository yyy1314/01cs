import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  {
    path: '/test',
    component: Layout,
    name: 'test',
    meta: { title: '测试', icon: 'banner' },
    children: [
      {
        path: '/test',
        name: 'bannerIndex',
        component: () => import('@/views/test'),
        meta: { title: '轮播图', icon: 'banner' }
      }
    ]
  }
]
