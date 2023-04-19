import store from '../store'
import request from '@/utils/request'

//  行业分类列表
export function industry(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/industry',
        method: 'get',
        params
    })
}

//  行业分类删除
export function industryDel(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/industryDel',
        method: 'get',
        params
    })
}

//  行业分类创建
export function industryCreate(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/industryCreate',
        method: 'post',
        data
    })
}
