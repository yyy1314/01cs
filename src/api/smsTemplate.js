import store from '@/store/index';
import request from '@/utils/request';

// 短信模板列表
export function getSmsTemplates(params={}) {
  store.commit('setIsLoading', false);
  return request({
    url: '/sms_template/index',
    method: 'get',
    params
  })
}

export function createSmsTemplate(params) {
  store.commit('setIsLoading', false);
  return request({
    url: '/sms_template/create',
    method: 'post',
    params
  })
}

export function modifySmsTemplate(data) {
  store.commit('setIsLoading', false);
  return request({
    url: '/sms_template/modify',
    method: 'post',
    data
  })
}

export function deleteSmsTemplate(data) {
  store.commit('setIsLoading', false);
  return request({
    url: '/sms_template/delete',
    method: 'post',
    data
  })
}

export function testSmsTemplate(data) {
  store.commit('setIsLoading', false);
  return request({
    url: '/sms_template/test',
    method: 'post',
    data
  })
}
