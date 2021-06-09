
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/admin/api/login',
    method: 'post',
    data
  })
}

// 获取用户详情
export function getUserInfo(data) {
  return request({
    url: '/admin/api/boss/detail',
    method: 'post',
    data
  })
}

// 获取路由列表
export function getMoveRouter() {
  return request({
    url: '/aoaoe/api/getMoveRouter',
    method: 'get'
  })
}

// 退出账号
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
