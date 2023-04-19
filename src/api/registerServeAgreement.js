import store from '../store'
import request from '@/utils/request'

// 注册服务协议
export function getRegisterServeAgreement(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/getRegisterServeAgreement',
        method: 'get',
        params
    })
}

// 注册服务协议
export function registerServeAgreement(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/registerServeAgreement',
        method: 'post',
        data
    })
}