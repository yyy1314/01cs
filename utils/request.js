import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'
import qs from 'qs'

// 创建axios实例
const uploadRequest = axios.create({
  baseURL: process.env.BASE_API,
  //baseURL: 'http://192.168.0.211:8082/api/admin',
  timeout: 50000, // 请求超时时间
  withCredentials: false,
})

// request拦截器
uploadRequest.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken();
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (store.getters.isLoading) {
      var loadingInstance = Loading.service({
        text: '加载中...'
      });
      store.commit('setLoadingInstance', loadingInstance);
    }
    config.data = qs.stringify(config.data);
    store.commit('setIsLoading', true);
    return config;
  },
  error => {
    Promise.reject(error);
  }
)
// response 拦截器
uploadRequest.interceptors.response.use(
  response => {
    var loadingInstance = store.getters.loadingInstance
    if (loadingInstance) {
      loadingInstance.close();
    }
    const res = response.data;
    if(response.status !== 200){
      Message({
        message: res.msg || '服务器异常或网络错误1！',
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject('error');
    }else{
      return res;
    }
  },error => {
    var loadingInstance = store.getters.loadingInstance
    if (loadingInstance) {
      loadingInstance.close();
    }
    // 401 登陆失败;
    if (error.response && error.response.status === 401) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload();
        })
      })
      return Promise.reject(error);
    }
    // 字段验证
    if (error && error.response && error.response.status === 400 && error.response.statusText == 'Bad Request') {
      Message({
        message: error.response.data[0],
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(error);
    }
    Message({
      message: error.message == 'Network Error' ? '服务器异常或网络错误2！' : error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default uploadRequest
