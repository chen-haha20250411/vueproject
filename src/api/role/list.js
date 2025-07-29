import request from '@/utils/request'

export function fetchList(query) {
    return request({
      url: '/admin/role/list',
      method: 'post',
      params: query
    })
  }

export function fetchdelete(id){
  return request({
      url: '/admin/role/delRole',
      method: 'post',
      params:{roleInfoId:id}
    })
}

export function getInfo(id){
  return request({
      url: '/admin/role/getRoleTreeEdit',
      method: 'post',
      params:{roleInfoId:id}
    })
}

export function saveOrupdate(data){
  return request({
      url: '/admin/role/addRole',
      method: 'post',
      data
    })
}

export function updateSave(data,msg){
  return request({
      url: '/admin/role/updateroleinfo',
      method: 'post',
      params:{role:data,authStr:msg}
    })
}
  