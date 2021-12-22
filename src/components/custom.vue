<!--
 * @文件描述: 
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 15:35:02
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-12-22 15:41:42
-->
<template>
  <div class="custom-main">
    <yimu-im ref="yimu" :customMenu="customMenu" :fromSystem="fromSystem"></yimu-im>
  </div>
</template>

<script>
// @ is an alias to /src
import testComponent from './testComponent.vue';

export default {
  name: 'custom',
  data() {
    return {
      customMenu: [],
      fromSystem: 'custom',
    };
  },
  mounted() {
    setTimeout(() => {
      this.customMenu = [
        {
          name: 'collect',
          isBottom: false,
          title: '收藏',
          unread: 0,
          key: 'collect',
          iconClass: 'iconfont icon-shoucang1',
          component: testComponent,
        },
        {
          name: 'help',
          isBottom: false,
          title: '帮助',
          unread: 0,
          key: 'help',
          iconClass: 'iconfont icon-bangzhu1',
          component: testComponent,
        },
        {
          name: 'mark',
          isBottom: false,
          title: '标记',
          unread: 0,
          key: 'mark',
          iconClass: 'iconfont icon-zhiding',
          component: testComponent,
        },
        {
          name: 'pending',
          isBottom: false,
          title: '待办',
          unread: 0,
          key: 'pending',
          iconClass: 'iconfont icon-daibanshixiang',
          component: testComponent,
        },
        {
          name: 'data',
          isBottom: false,
          title: '数据',
          unread: 0,
          key: 'data',
          iconClass: 'iconfont icon-paixingbang',
          component: testComponent,
        },
        {
          name: 'manage',
          isBottom: false,
          title: '管理',
          unread: 0,
          key: 'manage',
          iconClass: 'iconfont icon-shezhi',
          component: testComponent,
        },
      ];
    }, 500);
  },
  destroyed() {
    console.log('销毁');
  },
};
</script>
