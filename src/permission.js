import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import _ from 'lodash'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
const _import = require('./router/_import_' + process.env.NODE_ENV)

router.beforeEach(async(to, from, next) => {
  // 进度条
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 获取路由
          await store.dispatch('user/getRouter')
          if(store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }
          routerGo(to, next)
          // next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error({type:'error', message: error || 'Has Error'})
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters =_.filter(asyncRouterMap, route => {
    if (route.component) {
      if (route.component === 'Layout') { //Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

function routerGo(to, next) {
  const getRouter = filterAsyncRouter(store.getters.menus) // 过滤路由
  router.addRoutes(getRouter) // 动态添加路由
  global.antRouter = getRouter // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({...to, replace: true})
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
