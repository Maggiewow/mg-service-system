<!--
 * @文件描述: 
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 15:35:02
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-03-28 11:09:33
-->
<template>
  <div class="custom-main">
    <yimu-im
      ref="yimu"
      :theme="theme"
      :customMenu="customMenu"
      :fromSystem="fromSystem"
      @change-menu="handleChangeMenu"
      @set-font="setCSTheme"
    ></yimu-im>
  </div>
</template>

<script>
// @ is an alias to /src
import { getCurrentUser } from '@/api/data.js';
import { fetchSideBarConfig } from '@/api/chat.js';
import { MENU_OPTIONS } from '@/libs/constant';
import bus from '@/libs/bus';

export default {
  name: 'custom',
  props: {
    theme: {
      type: String,
      required: false,
      default: 'light',
    },
  },
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
  },
  mounted() {
    this.getSideBar();
  },
  destroyed() {
    console.log('销毁');
  },
  methods: {
    // 根据IM通知的字体大小引入css文件 small middle large
    setCSTheme(size = 'middle') {
      // 移除旧的节点
      const oldNode = document.querySelector('#mg-service-font-link');
      if (oldNode) {
        oldNode.parentNode.removeChild(document.querySelector('#mg-service-font-link'));
      }

      // 生成新节点，引入css
      const link = document.createElement('link');
      link.id = 'mg-service-font-link';
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = require(`@/assets/css/${size}.less`);
      document.getElementsByTagName('head')[0].appendChild(link);
    },
    openDialog() {
      this.$refs.yimu.openChatDialog();
    },
    handleChangeMenu(menuName) {
      this.curMenuName = menuName;
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
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSideBar() {
      fetchSideBarConfig('cs')
        .then((res) => {
          if (res.status === 200) {
            let ids = res.data.data.map(({ id }) => id);
            let defaultList = [3, 4]; // 3 4 每个人都有
            let list = [...new Set([...ids, ...defaultList])];
            this.setInitMenu(list);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setInitMenu(idList) {
      idList.forEach((id) => {
        if (![2, 6].includes(id) && MENU_OPTIONS[id]) {
          this.customMenu.push(MENU_OPTIONS[id]);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
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
