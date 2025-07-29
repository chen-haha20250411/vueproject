import request from '@/utils/request'

export function fetchList(query) {
    return request({
      url: '/admin/oper/list',
      method: 'post',
      params: query
    })
  }

export function fetchroleinfoAll(){
  return request({
      url: '/admin/oper/getroleinfoAll',
      method: 'post',
    })
}

export function fetchdelete(id){
  return request({
      url: '/admin/oper/delOper',
      method: 'post',
      params:{operatorId:id}
    })
}

export function getInfo(id){
  return request({
      url: '/admin/oper/toUpdateOper',
      method: 'post',
      params:{operatorId:id}
    })
}

export function saveOrupdate(data){
  return request({
      url: '/admin/oper/addOper',
      method: 'post',
      params:data
    })
}
export function updateOper(data){
  return request({
    url: '/admin/oper/updateOper',
    method: 'post',
    data
  })
}
export function updatePwd(params) {
  return request({
    url: '/admin/oper/updatePwd',
    method: 'post',
    params
  })
}

export function updateSave(data){
  return request({
      url: '/admin/oper/Grant',
      method: 'post',
      params:data
    })
}
  
export function getfpUser(){
  return request({
      url: '/admin/oper/getjguser',
      method: 'get',
    })
}

export function getpgUser(){
  return request({
      url: '/admin/oper/getpguser',
      method: 'get',
    })
}
  
export function resetPassword(operatorId){
  return request({
      url: '/admin/oper/resetPassword',
      method: 'post',
      params:{operatorId:operatorId}
    })
}

export function removeLimit(operatorId){
  return request({
    url: '/admin/oper/removeLimit',
    method: 'post',
    params:{operatorId:operatorId}
  })
}