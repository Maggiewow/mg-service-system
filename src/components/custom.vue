<!--
 * @文件描述: 
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 15:35:02
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-01-04 14:13:09
-->
<template>
  <div class="custom-main">
    <yimu-im
      ref="yimu"
      :customMenu="customMenu"
      :fromSystem="fromSystem"
      @change-menu="handleChangeMenu"
    ></yimu-im>
  </div>
</template>

<script>
// @ is an alias to /src
import Collect from './SideBar/collect.vue';
import Mark from './SideBar/mark.vue';
import Pending from './SideBar/pending.vue';
import DataStatistics from './SideBar/dataStatistics.vue';

import { getCurrentUser } from '@/api/data.js';
import { fetchSideBarConfig } from '@/api/chat.js';
import bus from '@/libs/bus';

export default {
  name: 'custom',
  data() {
    return {
      customMenu: [],
      fromSystem: 'cs',
      currentUser: {},
      curMenuName: 'messages',
    };
  },
  created() {
    this.getCurrentChatUser();
    this.getSideBar();
  },
  mounted() {
    setTimeout(this.setInitMenu, 500);
  },
  destroyed() {
    console.log('销毁');
  },
  methods: {
    openDialog() {
      console.log('openChatDialog', this.$refs.yimu.openChatDialog);
      this.$refs.yimu.openChatDialog();
    },
    handleChangeMenu(menuName) {
      this.curMenuName = menuName;
      console.log('home', menuName);
      // collect mark pending data
      if (['collect', 'mark', 'pending', 'data'].includes(menuName)) {
        // 通知更新接口
        bus.$emit('update' + menuName);
      }
    },
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
    getSideBar() {
      fetchSideBarConfig()
        .then((res) => {
          if (res.status === 200) {
            console.log('res.data', res.data);
            // this.setInitMenu()
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
/deep/ .ivu-modal-wrap {
  z-index: 2002;
}
ul {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;
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
