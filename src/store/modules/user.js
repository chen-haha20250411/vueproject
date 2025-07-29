import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
/* Layout */
import Layout from '@/views/layout/Layout'

const state = {
  duser: [],
  permis: [],
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  addRouters: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_DUSER: (state, duser) => {
    state.duser = duser
  },
  SET_PERMIS: (state, permis) => {
    state.permis = permis
  },
  SET_ROUTERS: (state, addRouters) => {
    state.addRouters = addRouters
  }
}

const actions = {
  // 用户名登录
  LoginByUsername({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      loginByUsername(username, userInfo.password, userInfo.verifyCode,userInfo.uucode,userInfo.oldyzmuuid,userInfo.yzm).then(response => {
        const data = response
        //console.log("2333:"+JSON.stringify(data))
        if (data.success) {
          commit('SET_TOKEN', data.data.accessToken)
          // console.log( data.data.accessToken);
          setToken(data.data.accessToken)
          resolve()
        }else{
          reject(data.data.msg)
        }
      }).catch(error => {
        reject(error)
      })
    }).then(res => {
      },err =>{
        Message.error(err)
      })
  },

  // 获取用户信息
  GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        if (!response || !response.success) {
          reject('用户获取失败,请重新登录')
        }
        const data = response.data
        const duser = data.user
        const permis = data.permissions
        if (duser) {
          commit('SET_DUSER', duser)
        } else {
          reject('用户不能为空 !')
        }
        const rot = []
        generaMenu(rot, permis)
        //console.log(JSON.stringify(rot));
        //filterAsyncRoutes(rot)
        commit('SET_ROUTERS', rot)
        commit('SET_NAME', duser.realName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 第三方验证登录
  // LoginByThirdparty({ commit, state }, code) {
  //   return new Promise((resolve, reject) => {
  //     commit('SET_CODE', code)
  //     loginByThirdparty(state.status, state.email, state.code).then(response => {
  //       commit('SET_TOKEN', response.data.token)
  //       setToken(response.data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_DUSER', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // 动态修改权限
  ChangeRoles({ commit, dispatch }, role) {
    return new Promise(resolve => {
      commit('SET_TOKEN', role)
      setToken(role)
      getUserInfo(role).then(response => {
        const data = response
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
function generaMenu(rt, data) {
  data.forEach(item => {
    const menu = {
      path: item.menuURL === '#' ? '/'+ item.menuId: item.menuURL,
      component: item.menuURL === '#' ? Layout : () => import(`@/views/${item.menuURL}`),
      //hidden: false,
      children: [],
      name: 'menu_' + item.menuId,
      meta: { title: item.menuName, id: item.menuId,btnPermissions: item.btnList,nocache:false}
    }
    if (item.subMenuList) {
      generaMenu(menu.children, item.subMenuList)
    }
    rt.push(menu)
  })
}

