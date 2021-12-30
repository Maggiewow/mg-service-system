// 消息体的操作事件
import { CustomUrl } from './constant';
import commonAxios from 'ym-bridge-shandianyun';
import { CalcTargetId } from '@/libs/tools';

// 创建待办
export const createPending = (imRemoteId, waitTaskContent, waitTaskUserIds, waitTaskEndTime) => {
  return commonAxios.request({
    url: CustomUrl + '/news/waitTask',
    method: 'post',
    data: { imRemoteId, waitTaskContent, waitTaskUserIds, waitTaskEndTime },
  });
};

// 完成待办事项
export const completePending = (waitTaskId) => {
  return commonAxios.request({
    url: CustomUrl + '/news/waitTaskFinish',
    method: 'post',
    data: { waitTaskId },
  });
};

// 获取待办负责人用户列表
export const fetchPendingDirectorList = (groupId) => {
  return commonAxios.request({
    url: CustomUrl + '/news/getWaitTaskUserList',
    method: 'get',
    params: { groupId },
  });
};

// 全部列表
// 获取待办列表 status状态 默认0返回所有 1未处理 200完成  keyword关键字 page per_page groupId
export const fetchPendingList = (page = 1, type, status = 0, keyword) => {
  // 单聊userId 群聊groupId
  let params = { page, type, status, keyword, per_page: 20 };

  return commonAxios.request({
    url: CustomUrl + '/news/waitTaskList',
    method: 'get',
    params,
  });
};
// 获取标记列表
export const fetchMarkList = (page = 1, type, keyword) => {
  let params = { page, type, keyword, per_page: 20 };

  return commonAxios.request({
    url: CustomUrl + '/news/markList',
    method: 'get',
    params,
  });
};
// 获取收藏列表 newsType 区分
export const fetchCollectList = (page = 1, newsType, keyword) => {
  let params = { page, newsType, keyword, per_page: 20 };

  return commonAxios.request({
    url: CustomUrl + '/news/collectList',
    method: 'get',
    params,
  });
};
