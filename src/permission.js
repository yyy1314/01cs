import router from './router'
import store from './store';
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import Layout from '@/views/layout/Layout'

const whiteList = ['/login'] // 不重定向白名单

const fakeRouter = {
  'router': [
    {
      path: '/roleManagement ',
      component: Layout,
      redirect: '/roleManagement/index',
      name: 'roleManagementIndex',
      meta: { title: '角色管理', icon: 'role' },
      children: [
        {
          path: '/roleManagement/index',
          name: 'roleManagementIndex',
          component: () => import('@/views/roleManagement/index'),
          meta: { title: '角色管理', icon: 'role' }
        },
        {
          path: '/roleManagement/details',
          name: 'roleManagementDetails',
          hidden: true,
          component: () => import('@/views/roleManagement/details'),
          meta: { title: '角色详情', viceTitle: '编辑角色' }
        }
      ]
    }
  ]
}

router.beforeEach((to, from, next) => {
  NProgress.start();

  let isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  if(isMobile){
    window.location.href = '/mobile.html#/test';
    NProgress.done();
  }

  if (getToken()) {
    // router.options.routes = [...router.options.routes, ...fakeRouter.router]
    // global.antRouter = router.options.routes
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done(); // 如果当前页面是仪表板将不会触发afterEach挂钩，所以手动处理它
    } else {
      if (store.getters.name) {
        next();
      }else{
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          next();//resolve 钩子
        });
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
})
