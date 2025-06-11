import request from '@/utils/request'

// 查询资讯文章类型列表
export function listArticleType(query) {
  return request({
    url: '/obtain/articleType/list',
    method: 'get',
    params: query
  })
}

// 查询资讯文章类型详细
export function getArticleType(typeId) {
  return request({
    url: '/obtain/articleType/' + typeId,
    method: 'get'
  })
}

// 新增资讯文章类型
export function addArticleType(data) {
  return request({
    url: '/obtain/articleType',
    method: 'post',
    data: data
  })
}

// 修改资讯文章类型
export function updateArticleType(data) {
  return request({
    url: '/obtain/articleType',
    method: 'put',
    data: data
  })
}

// 删除资讯文章类型
export function delArticleType(typeId) {
  return request({
    url: '/obtain/articleType/' + typeId,
    method: 'delete'
  })
}
