import Vue from 'vue' // @haidong vue源码
import Router from 'vue-router' // @haidong vue-router源码
import routes from './routers' // @haidong 路由规则对象
import store from '@/store' // @haidong 全局store
import iView from 'iview' // @haidong iview组件
import { getToken, canTurnTo } from '@/libs/util' // @haidong 判断是否登录与用户是否有权限跳到该页

Vue.use(Router) // @haidong 在vue中需要先use
const router = new Router({ // @haidong 实例化一个路由对象
  routes,
  mode: 'history' // @haidong history模式
})
const LOGIN_PAGE_NAME = 'login' // @haidong 登录页面

router.beforeEach((to, from, next) => { // @haidong 跳转规则
  iView.LoadingBar.start() // @haidong 加载动画
  const token = getToken() // @haidong 获取权限
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到home页
    })
  } else {
    store.dispatch('getUserInfo').then(user => {
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      if (canTurnTo(to.name, user.access, routes)) next() // 有权限，可访问
      else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    })
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
