import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/sys_dict/toList',
    method: 'post',
    params: query
  })
}

export function fetchdelete(id) {
  return request({
    url: '/admin/sys_dict/deletevalue',
    method: 'post',
    params:{dict_id:id}
  })
}

export function getInfo(id) {
  return request({
    url: '/admin/sys_dict/queryById',
    method: 'post',
    params:{dict_id:id}
  })
}

export function saveOrupdate(data) {
  return request({
    url: '/admin/sys_dict/insertOupdate',
    method: 'post',
    params:data
  })
}

export function uploadFile(data) {
  return request({
    url: '/admin/sys_dict/uploadFile',
    method: 'post',
    data
  })
}

export function queryCList(query) {
  return request({
    url: '/admin/sys_dict/queryList',
    method: 'post',
    params: { dict_type: 1 }
  })
}

export function queryBList(query) {
  return request({
    url: '/admin/sys_dict/queryList',
    method: 'post',
    params: { dict_type: 2 }
  })
}

export function queryTypeList(type) {
  return request({
    url: '/admin/sys_dict/queryList',
    method: 'post',
    params: { dict_type: type }
  })
}

export function quyerDictTree(dict_type) {
  return request({
    url: '/admin/sys_dict/quyerDictTree',
    method: 'post',
    params: {dict_type:dict_type}
  })
}

export function queryAllList(dict_type){
  return request({
    url: '/admin/sys_dict/quyerAllList',
    method: 'get',
    params:{dict_type:dict_type}
  })
}