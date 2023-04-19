import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import router from './route.js';
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

new Vue({
  el: '#mobile',
  router,
  render: h => h(App)
})
