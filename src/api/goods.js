import store from '../store'
import request from '@/utils/request'

// 商品列表
export function goodsList(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsList',
        method: 'get',
        params
    })
}

//商品详情
export function goodsDetails(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsDetails',
        method: 'get',
        params
    })
}

//商品发布
export function goodsCreate(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsCreate',
        method: 'post',
        data
    })
}

//商品推荐
export function goodsRecommend(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goods/recommend',
        method: 'post',
        data
    })
}

//商品上下架
export function goodsUpDown(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsUpDown',
        method: 'get',
        params
    })
}


//商品删除
export function goodsDel(params) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsDel',
        method: 'get',
        params
    })
}

// 商品分类列表
export function goodsCategory() {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsCategory',
        method: 'get',
        params: { }
    })
}

// 创建商品分类
export function goodsCategoryCreate(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsCategoryCreate',
        method: 'post',
        data
    })
}
// 删除商品分类
export function goodsCategoryDel(data) {
    store.commit('setIsLoading', false)
    return request({
        url: '/goodsCategoryDel',
        method: 'post',
        data
    })
}
