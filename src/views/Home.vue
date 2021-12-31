<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2021-12-31 17:58:38
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
  mounted() {
    console.log('custom', this.$refs.custom.openDialog);
  },
};
</script>

<style scoped>
@import url('../assets/css/common.css');
</style>
