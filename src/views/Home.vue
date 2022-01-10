<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2022-01-10 09:34:43
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\views\Home.vue
-->
<template>
  <div class="comps">
    <custom-system ref="custom"></custom-system>
  </div>
</template>

<script>
// @ is an alias to /src
import CustomSystem from '@/components/custom';

export default {
  name: 'Home',
  components: {
    CustomSystem,
  },
};
</script>

<style scoped>
@import url('../assets/css/common.css');
</style>
