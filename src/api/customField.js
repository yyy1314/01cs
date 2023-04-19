import store from '@/store/index';
import request from '@/utils/request';

// 自定义字段列表
export function getCustomFields(params={}) {
  store.commit('setIsLoading', false);
  return request({
    url: '/custom_fields/index',
    method: 'get',
    params
  })
}


// 自定义字段新增
export function createCustomField(data) {
  store.commit('setIsLoading', false);
  return request({
    url: '/custom_fields/edit',
    method: 'post',
    data
  })
}


// 自定义字段删除
export function deleteCustomField(data) {
  store.commit('setIsLoading', false);
  return request({
    url: '/custom_fields/delete',
    method: 'post',
    data
  })
}
