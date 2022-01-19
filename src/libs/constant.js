/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2020-11-23 11:16:15
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-01-19 09:36:17
 */

import Collect from '@/components/SideBar/collect.vue';
import Mark from '@/components/SideBar/mark.vue';
import Pending from '@/components/SideBar/pending.vue';
import DataStatistics from '@/components/SideBar/dataStatistics.vue';
import testComponent from '@/components/testComponent.vue';

export const PAGE_SIZE = 10;

export const ALL_MENU_LIST = [
  { id: 1, name: 'collect' },
  { id: 2, name: 'help' },
  { id: 3, name: 'mark' },
  { id: 4, name: 'pending' },
  { id: 5, name: 'data' },
  { id: 6, name: 'manage' },
];
export const MENU_OPTIONS = {
  1: {
    name: 'collect',
    isBottom: false,
    title: '收藏',
    unread: 0,
    key: 'collect',
    iconClass: 'iconfont icon-shoucang1',
    component: Collect,
  },
  2: {
    name: 'help',
    isBottom: false,
    title: '帮助',
    unread: 0,
    key: 'help',
    iconClass: 'iconfont icon-bangzhu1',
    component: testComponent,
  },
  3: {
    name: 'mark',
    isBottom: false,
    title: '标记',
    unread: 0,
    key: 'mark',
    iconClass: 'iconfont icon-zhiding',
    component: Mark,
  },
  4: {
    name: 'pending',
    isBottom: false,
    title: '待办',
    unread: 0,
    key: 'pending',
    iconClass: 'iconfont icon-daibanshixiang',
    component: Pending,
  },
  5: {
    name: 'data',
    isBottom: false,
    title: '数据',
    unread: 0,
    key: 'data',
    iconClass: 'iconfont icon-paixingbang',
    component: DataStatistics,
  },
  6: {
    name: 'manage',
    isBottom: false,
    title: '管理',
    unread: 0,
    key: 'manage',
    iconClass: 'iconfont icon-shezhi',
    component: testComponent,
  },
};
