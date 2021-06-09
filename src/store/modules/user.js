import { login, getUserInfo, getMoveRouter } from '@/api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: [] // 存放路由表
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { loginame, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginame: loginame.trim(), password: password }).then(response => {
        // const { data } = response
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { loginame } = data

        commit('SET_NAME', loginame)
        commit('SET_AVATAR', '../../assets/404_images/mongo.jpg')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取路由列表
  getRouter({commit, state}) {
    return new Promise((resolve, reject) => {
      getMoveRouter().then(res => {
        console.log('res', res)
        const routerMenus = res.data
        routerMenus.push(
          {path: '/404', component: '404', hidden: true},
          {path: '*', redirect: '/404', hidden: true}
        )

        commit('SET_MENUS', routerMenus)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  
  // 退出账号
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

