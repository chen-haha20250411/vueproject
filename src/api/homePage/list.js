import request from '@/utils/request'

export function getStatistic() {
  return request({
    url: '/admin/homePage/getStatistic',
    method: 'get',
    params: {}
  })
}

export function getStatisticAdmin() {
  return request({
    url: '/admin/homePage/getStatisticAdmin',
    method: 'get',
    params: {}
  })
}
