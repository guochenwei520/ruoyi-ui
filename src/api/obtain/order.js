import request from '@/utils/request'

// 查询工单管理列表
export function listOrder(query) {
  return request({
    url: '/obtain/order/list',
    method: 'get',
    params: query
  })
}
//根据工单状态分组统计工单数量
export function getOrderData() {
  return request({
    url: '/obtain/order/getOrderDatas',
    method: 'get'
  })
}
// 查询工单管理详细
export function getOrder(orderId) {
  return request({
    url: '/obtain/order/' + orderId,
    method: 'get'
  })
}

// 新增工单管理
export function addOrder(data) {
  return request({
    url: '/obtain/order',
    method: 'post',
    data: data
  })
}

// 修改工单管理
export function updateOrder(data) {
  return request({
    url: '/obtain/order',
    method: 'put',
    data: data
  })
}

export function updateRecommend(orderId,orderRecommend) {
  return request({
    url: '/obtain/order/updateRecommend/'+orderId+"/"+orderRecommend,
    method: 'get'
  })
}
// 工单处理
export function updateProcessOrder(data) {
  return request({
    url: '/obtain/order/updateProcessOrder',
    method: 'put',
    data: data
  })
}

// 删除工单管理
export function delOrder(orderId) {
  return request({
    url: '/obtain/order/' + orderId,
    method: 'delete'
  })
}
