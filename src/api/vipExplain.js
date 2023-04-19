import store from '../store'
import request from '@/utils/request'

// 入会须知
export function getVipExplain(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/getVipExplain',
        method: 'get',
        params
    })
}

// 入会须知
export function vipExplain(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/vipExplain',
        method: 'post',
        data
    })
}