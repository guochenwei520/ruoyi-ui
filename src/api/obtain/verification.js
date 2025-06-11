import request from '@/utils/request'

// 查询就业数据审核结果列表
export function listVerification(query) {
  return request({
    url: '/obtain/verification/list',
    method: 'get',
    params: query
  })
}

// 查询就业数据审核结果详细
export function getVerification(verifId) {
  return request({
    url: '/obtain/verification/' + verifId,
    method: 'get'
  })
}
/*生成就业责任津贴核实确认单*/
export function responsibilityAllowance(deptId,roomId) {
  return request({
    url: '/obtain/verification/getAllowance/' + deptId+"/"+roomId,
    method: 'get'
  })

}
/*生成就业质量核实确认单*/
export function qualityVerification(deptId,roomId) {
  return request({
    url: '/obtain/verification/getVerification/' + deptId+"/"+roomId,
    method: 'get'
  })

}
// 新增就业数据审核结果
export function addVerification(data) {
  return request({
    url: '/obtain/verification',
    method: 'post',
    data: data
  })
}

// 修改就业数据审核结果
export function updateVerification(data) {
  return request({
    url: '/obtain/verification',
    method: 'put',
    data: data
  })
}

// 删除就业数据审核结果
export function delVerification(verifId) {
  return request({
    url: '/obtain/verification/' + verifId,
    method: 'delete'
  })
}
// 删除就业数据审核结果
export function getAccidentReport(verifId,index) {
  return request({
    url: '/obtain/verification/getAccidentReport/' + verifId+'/'+index,
    method: 'get'
  })
}
