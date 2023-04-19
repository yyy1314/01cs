import store from '@/store/index';
import request from '@/utils/request';

// 活动报名邀请短信
export function sendActivityJoinSms(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activity_join/send_sms',
    method: 'post',
    data
  })
}
