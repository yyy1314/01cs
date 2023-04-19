import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css
import '@/styles/font/iconfont.css'; // 阿里字体图标

import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control

import * as filters from '@/utils/filters.js';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(ElementUI);

import veRing from 'v-charts/lib/ring.common';
Vue.component(veRing.name, veRing);

import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
Vue.use(preview);

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
