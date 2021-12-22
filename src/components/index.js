/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 15:34:31
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-12-22 15:39:56
 */
import CustomSystem from './custom';
CustomSystem.install = function (Vue) {
  Vue.component(CustomSystem.name, CustomSystem);
};
export default CustomSystem;
