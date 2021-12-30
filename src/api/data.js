import { BaseUrl, CustomUrl } from './constant';
import commonAxios from 'ym-bridge-shandianyun';

export const registerUser = () => {
  return commonAxios.request({
    url: BaseUrl + '/register',
    method: 'post',
  });
};

//获取当前用户
export const getCurrentUser = () => {
  return commonAxios.request({
    url: CustomUrl + '/userinfo',
    method: 'get',
  });
};

//根据多个用户id获取用户
export const getTargetInfoById = (ids) => {
  return commonAxios.request({
    url: BaseUrl + '/org/multi-users',
    method: 'get',
    params: {
      ids,
    },
  });
};

//通过机构id获取用户
export const getUserByOrgid = (orgid) => {
  return commonAxios.request({
    url: BaseUrl + '/org/' + orgid + '/users',
    method: 'get',
  });
};

//通过机构id获取用户
export const getOrgList = () => {
  return commonAxios.request({
    url: BaseUrl + '/orgs',
    method: 'get',
  });
};

//创建群组
export const createGroup = (name, members, type = 4) => {
  return commonAxios.request({
    url: BaseUrl + '/group',
    method: 'post',
    data: {
      name,
      members,
      type,
    },
  });
};

//获取群组信息接口
export const groupInfos = (groupIds) => {
  return commonAxios.request({
    url: BaseUrl + '/groupInfos',
    method: 'get',
    params: {
      groupIds,
    },
  });
};

//获取群组信息接口
export const groupMembers = (groupIds) => {
  return commonAxios.request({
    url: BaseUrl + '/group/' + groupIds + '/members',
    method: 'get',
  });
};

//群组加人接口
export const addMemberToGroup = (groupId, userIds) => {
  return commonAxios.request({
    url: BaseUrl + '/group/' + groupId + '/member-inc',
    method: 'post',
    data: {
      members: userIds,
    },
  });
};

//上传附件
export const uploadFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('require_thumb', 1);
  return commonAxios.request({
    url: BaseUrl + '/notify/upload',
    method: 'post',
    data: fd,
  });
};
