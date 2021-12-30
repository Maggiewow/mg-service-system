<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2021-12-30 15:59:14
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
.ivu-message {
  z-index: 2001 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.over_hide {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.over_hide_2 {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
