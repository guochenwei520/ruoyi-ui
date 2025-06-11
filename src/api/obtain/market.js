import request from '@/utils/request'

// 查询市场部管理列表
export function listMarket(query) {
  return request({
    url: '/obtain/market/list',
    method: 'get',
    params: query
  })
}

// 查询市场部管理详细
export function getMarket(marketId) {
  return request({
    url: '/obtain/market/' + marketId,
    method: 'get'
  })
}

// 新增市场部管理
export function addMarket(data) {
  return request({
    url: '/obtain/market',
    method: 'post',
    data: data
  })
}

// 修改市场部管理
export function updateMarket(data) {
  return request({
    url: '/obtain/market',
    method: 'put',
    data: data
  })
}

// 删除市场部管理
export function delMarket(marketId) {
  return request({
    url: '/obtain/market/' + marketId,
    method: 'delete'
  })
}
