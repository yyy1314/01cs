import store from '../store'
import request from '@/utils/request'

// 商品订单列表
export function goodsOrderList(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsOrderList',
        method: 'get',
        params
    })
}

// 商品订单详情
export function goodsOrderDetails(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsOrderDetails',
        method: 'get',
        params
    })
}

//商品发货
export function goodsOrderSendOut(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsOrderSendOut',
        method: 'post',
        data
    })
}