import request from '@/utils/request'

// 查询就业喜报列表
export function listGoodnews(query) {
  return request({
    url: '/obtain/goodnews/list',
    method: 'get',
    params: query
  })
}

// 查询就业喜报详细
export function getGoodnews(goodnewsId) {
  return request({
    url: '/obtain/goodnews/' + goodnewsId,
    method: 'get'
  })
}

// 新增就业喜报
export function addGoodnews(data) {
  return request({
    url: '/obtain/goodnews',
    method: 'post',
    data: data
  })
}

// 修改就业喜报
export function updateGoodnews(data) {
  return request({
    url: '/obtain/goodnews',
    method: 'put',
    data: data
  })
}

// 删除就业喜报
export function delGoodnews(goodnewsId) {
  return request({
    url: '/obtain/goodnews/' + goodnewsId,
    method: 'delete'
  })
}
