import store from '@/store/index';
import request from '@/utils/request';

// 访客列表
export function getVisitors(params={}) {
  store.commit('setIsLoading', false);
  return request({
    url: '/user_log/visitor',
    method: 'get',
    params
  })
}

// 访客日志列表
export function getVisitorLogs(params={}) {
  store.commit('setIsLoading', false);
  return request({
    url: '/user_log/index',
    method: 'get',
    params
  })
}
