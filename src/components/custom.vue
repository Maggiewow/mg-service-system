<!--
 * @文件描述: 
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 15:35:02
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-12-31 10:44:23
-->
<template>
  <div class="custom-main">
    <yimu-im ref="yimu" :customMenu="customMenu" :fromSystem="fromSystem"></yimu-im>
  </div>
</template>

<script>
// @ is an alias to /src
import testComponent from './testComponent.vue';
import Collect from './SideBar/collect.vue';
import Mark from './SideBar/mark.vue';
import Pending from './SideBar/pending.vue';
import DataStatistics from './SideBar/dataStatistics.vue';

import { getCurrentUser } from '@/api/data.js';

export default {
  name: 'custom',
  data() {
    return {
      customMenu: [],
      fromSystem: 'cs',
      currentUser: {},
    };
  },
  created() {
    this.getCurrentChatUser();
  },
  mounted() {
    setTimeout(this.setInitMenu, 500);
  },
  destroyed() {
    console.log('销毁');
  },
  methods: {
    getCurrentChatUser() {
      getCurrentUser()
        .then((res) => {
          if (res.status === 200) {
            this.currentUser = res.data.data;
            const { id, nickname, orgid, avatar } = res.data.data;
            let user = {
              id: String(id),
              displayName: nickname,
              orgid: orgid,
              avatar: avatar,
            };
            sessionStorage.setItem('current_user', JSON.stringify(user));
            sessionStorage.setItem('current_userId', id);
            console.log('current_user', user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setInitMenu() {
      this.customMenu = [
        {
          name: 'collect',
          isBottom: false,
          title: '收藏',
          unread: 0,
          key: 'collect',
          iconClass: 'iconfont icon-shoucang1',
          component: Collect,
        },
        // {
        //   name: 'help',
        //   isBottom: false,
        //   title: '帮助',
        //   unread: 0,
        //   key: 'help',
        //   iconClass: 'iconfont icon-bangzhu1',
        //   component: testComponent,
        // },
        {
          name: 'mark',
          isBottom: false,
          title: '标记',
          unread: 0,
          key: 'mark',
          iconClass: 'iconfont icon-zhiding',
          component: Mark,
        },
        {
          name: 'pending',
          isBottom: false,
          title: '待办',
          unread: 0,
          key: 'pending',
          iconClass: 'iconfont icon-daibanshixiang',
          component: Pending,
        },
        {
          name: 'data',
          isBottom: false,
          title: '数据',
          unread: 0,
          key: 'data',
          iconClass: 'iconfont icon-paixingbang',
          component: DataStatistics,
        },
        // {
        //   name: 'manage',
        //   isBottom: false,
        //   title: '管理',
        //   unread: 0,
        //   key: 'manage',
        //   iconClass: 'iconfont icon-shezhi',
        //   component: testComponent,
        // },
      ];
    },
  },
};
</script>
<style lang="less" scoped>
.custom-main ::v-deep .ivu-table {
  font-size: 14px !important; // 14 ==> 16
}
.over_hide_1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.noselect {
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}

.narrow-scroll-bar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.narrow-scroll-bar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* border-radius: 6px; */
  /* box-shadow: inset 0 0 5px rgba(55, 153, 245, 0.2); */
  background: #aaa;
}

.narrow-scroll-bar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  /* border-radius: 6px; */
  background: #f2f2f2;
}
</style>
