import request from '@/utils/request'

// 查询面试题库管理列表
export function listBank(query) {
  return request({
    url: '/obtain/bank/list',
    method: 'get',
    params: query
  })
}

// 查询面试题库管理详细
export function getBank(topicId) {
  return request({
    url: '/obtain/bank/' + topicId,
    method: 'get'
  })
}
// 点赞
export function updateBankLikeNumber(topicId) {
  return request({
    url: '/obtain/bank/updateBankLikeNumber/' + topicId,
    method: 'get'
  })
}
// 是否点赞
export function getIsLike(topicId) {
  return request({
    url: '/obtain/bank/getIsLikes/' + topicId,
    method: 'get'
  })
}
// 是否收藏
export function getIsCollect(topicId) {
  return request({
    url: '/obtain/bank/getIsCollects/' + topicId,
    method: 'get'
  })
}

// 点赞
export function updateBankCollectNumber(topicId) {
  return request({
    url: '/obtain/bank/updateBankCollectNumber/' + topicId,
    method: 'get'
  })
}

// 新增面试题库管理
export function addBank(data) {
  return request({
    url: '/obtain/bank',
    method: 'post',
    data: data
  })
}

// 修改面试题库管理
export function updateBank(data) {
  return request({
    url: '/obtain/bank',
    method: 'put',
    data: data
  })
}

// 删除面试题库管理
export function delBank(topicId) {
  return request({
    url: '/obtain/bank/' + topicId,
    method: 'delete'
  })
}
