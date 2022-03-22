/*
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2022-03-22 17:16:50
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\main.js
 */

import Vue from 'vue';

import {
  Button,
  Table,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Time,
  Tabs,
  TabPane,
  Message,
  Icon,
  Modal,
  Page,
  Switch,
  RadioGroup,
  Radio,
  Spin,
  Row,
  Col,
} from 'view-design';
import 'view-design/dist/styles/iview.css';

import App from './App.vue';
import store from './store';
import config from '@/config';
import router from './router';
import './index.less';

import yimuIm from 'yimu-im';
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';

Vue.use(yimuIm);
Vue.use(LemonIMUI);
Vue.component('Button', Button);
Vue.component('Table', Table);
Vue.component('Input', Input);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Time', Time);
Vue.component('Tabs', Tabs);
Vue.component('TabPane', TabPane);
Vue.component('Message', Message);
Vue.component('Icon', Icon);
Vue.component('Modal', Modal);
Vue.component('Page', Page);
Vue.component('i-switch', Switch);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Spin', Spin);
Vue.component('Row', Row);
Vue.component('Col', Col);

Vue.config.productionTip = false;
Vue.prototype.$config = config;
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
