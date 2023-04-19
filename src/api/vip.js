import store from '../store'
import request from '@/utils/request'

// 获取VIP等级
export function getVipList(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/vip',
        method: 'GET',
        params
    })
}

// 获取VIP等级
export function vipCreate(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/vipCreate',
        method: 'post',
        data
    })
}

//获取vip列表
export function getVipApplyList(params) {
    store.commit('setIsLoading',false)
    return request({
        url: '/vipApplyList',
        method: 'get',
        params
    })
}

//审核通过
export function vipApplyAuditPass(data) {
    store.commit('setIsLoading',false)
    return request({
        url: '/vipApplyAuditPass',
        method: 'post',
        data
    })
}

//审核不通过
export function vipApplyAuditNoPass(data) {
    store.commit('setIsLoading',false)
    return request({
        url: '/vipApplyAuditNoPass',
        method: 'post',
        data
    })
}