import Router from 'vue-router';

const routes = [
  { path: '/test', component: () => import('@/mobile/views/test') },

];

export default new Router({
  routes
})
