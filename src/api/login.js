import request from '@/utils/request'

export function loginByUsername(userName, password,verifyCode,uucode,oldyzmuuid,yzm) {
  const data = {
    userName,
    password,
    verifyCode,
    uucode,oldyzmuuid,yzm
  }
  //console.log(data)
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/getUserInfo',
    method: 'get'
  })
}
export function checkPwd() {
  return request({
    url: '/admin/checkPwd',
    method: 'get'
  })
}

export function getCaptcha() {
  return request({
    url: '/admin/captcha',
    method: 'post'
  })
}
// export function sendmms(params) {
//   return request({
//     url: '/admin/sendmms',
//     method: 'post',
//     params
//   })
// }
