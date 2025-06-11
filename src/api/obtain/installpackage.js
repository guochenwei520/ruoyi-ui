import request from '@/utils/request'

// 查询手机端管理列表
export function listInstallpackage(query) {
  return request({
    url: '/obtain/installpackage/list',
    method: 'get',
    params: query
  })
}

// 查询手机端管理详细
export function getInstallpackage(installpackageId) {
  return request({
    url: '/obtain/installpackage/' + installpackageId,
    method: 'get'
  })
}

// 新增手机端管理
export function addInstallpackage(data) {
  return request({
    url: '/obtain/installpackage',
    method: 'post',
    data: data
  })
}

// 修改手机端管理
export function updateInstallpackage(data) {
  return request({
    url: '/obtain/installpackage/startOrStopInstallpackage',
    method: 'put',
    data: data
  })
}

// 删除手机端管理
export function delInstallpackage(installpackageId) {
  return request({
    url: '/obtain/installpackage/' + installpackageId,
    method: 'delete'
  })
}
