import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

// 将按需导入的 $http 挂载到 wx 顶级对象之上，方便全局调用
uni.$http = $http

// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

// 响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif