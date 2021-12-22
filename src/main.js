/*
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2021-12-22 15:31:04
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\main.js
 */

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import config from '@/config';

import { Message } from 'view-design';
import 'view-design/dist/styles/iview.css';
// Vue.use(ViewUI);

import yimuIm from 'yimu-im';
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';
console.log('yimuIm', yimuIm);

Vue.use(yimuIm);
Vue.use(LemonIMUI);

Vue.config.productionTip = false;
Vue.prototype.$config = config;
Vue.prototype.$Message = Message;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
