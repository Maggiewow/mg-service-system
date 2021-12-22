/*
 * @Author: your name
 * @Date: 2020-10-26 14:56:23
 * @LastEditTime: 2021-04-25 10:27:05
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \manuscript-pc\src\api\common.js
 */

import Cookies from 'js-cookie';
import gridsAxios from 'ym-bridge-shandianyun';

// let basePath = 'https://shandianyun-extraction.iqilu.com';
// let basePath = 'https://user.shandian8.com';
// let basePath = '';

console.log('gridsAxios', gridsAxios);
console.log('COOKIE', Cookies.get('jwt_token'));

export const getGridsList = (basePath) => {
  return gridsAxios.request({
    url: basePath + '/sync/list',
    method: 'get',
  });
};

export const getSyncGridUrl = (id, basePath) => {
  return gridsAxios.request({
    url: basePath + '/sync?id=' + id,
    method: 'get',
  });
};

//获取模块
export const getModules = (basePath) => {
  return gridsAxios.request({
    url: basePath + '/user/get-module',
    method: 'get',
  });
};
