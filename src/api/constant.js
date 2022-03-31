/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-22 16:42:03
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-03-31 16:31:18
 */

let IMUrl = '';
let CSUrl = '';
if (window.location.origin.includes('.iqilu.com')) {
  // 正式环境
  IMUrl = 'https://shandianyun-im.iqilu.com';
  CSUrl = 'https://shandianyun-customer.iqilu.com';
} else if (window.location.origin.includes('.shandian8.com')) {
  // 测试环境
  IMUrl = 'https://im.shandian8.com';
  CSUrl = 'https://cs.shandian8.com';
} else {
  // 本地开发环境
  IMUrl = 'https://im.shandian8.com';
  CSUrl = 'https://cs.shandian8.com';
}

export const BaseUrl = IMUrl;
export const CustomUrl = CSUrl;

export const PAGE = 1;
export const PAGE_SIZE = 10;
export const BIG_PAGE_SIZE = 30;
