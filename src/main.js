// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
<<<<<<< HEAD


import Vue from 'vue'                       // @haidong 引入vue源码
import App from './App'                     // @haidong 页面对象
import router from './router'               // @haidong 路由对象
import store from './store'                 // @haidong 全局store
import iView from 'iview'                   // @haidong 引入iview组件
import i18n from '@/locale'                 // @haidong
import config from '@/config'               // @haidong
import importDirective from '@/directive'   // @haidong
import 'iview/dist/styles/iview.css'        // @haidong 引入页面css
import './index.less'                       // @haidong
import '@/assets/icons/iconfont.css'        // @haidong
=======
import Vue from 'vue' // @haidong vue源码
import App from './App' // @haidong 主容器
import router from './router' // @haidong 路由规则
import store from './store' // @haidong 全局store
import iView from 'iview' // @haidong iview组件
import i18n from '@/locale'  // @haidong 
import config from '@/config'  // @haidong 全局配置
import importDirective from '@/directive' // @haidong 
import 'iview/dist/styles/iview.css' // @haidong 全局css
import './index.less'  // @haidong 主容器css
import '@/assets/icons/iconfont.css'
>>>>>>> 1e54b62196756ac08969976e8cf9158fe0fa3b87
// import '@/mock'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
