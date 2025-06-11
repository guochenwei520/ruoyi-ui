import request from '@/utils/request'

// 查询资讯文章列表
export function listArticle(query) {
  return request({
    url: '/obtain/article/list',
    method: 'get',
    params: query
  })
}

// 查询资讯文章详细
export function getArticle(articleId) {
  return request({
    url: '/obtain/article/' + articleId,
    method: 'get'
  })
}

// 新增资讯文章
export function addArticle(data) {
  return request({
    url: '/obtain/article',
    method: 'post',
    data: data
  })
}

// 修改资讯文章
export function updateArticle(data) {
  return request({
    url: '/obtain/article',
    method: 'put',
    data: data
  })
}

// 删除资讯文章
export function delArticle(articleId) {
  return request({
    url: '/obtain/article/' + articleId,
    method: 'delete'
  })
}
// 查询资讯文章类型
export function getArticleTypes() {
  return request({
    url: '/obtain/article/getArticleTypes',
    method: 'get'
  })
}
