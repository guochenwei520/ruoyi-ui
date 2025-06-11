import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询跟踪记录列表
export function listTrack(query) {
  return request({
    url: '/obtain/track/list',
    method: 'get',
    params: query
  })
}
// 根据学生id查询跟踪记录列表
export function listTracks(stuId) {
  return request({
    url: '/obtain/track/listTracks/'+stuId,
    method: 'get'
  })
}
// 根据学生id查询跟踪记录预核实信息
export function getTracksByStuId(stuId) {
  return request({
    url: '/obtain/track/getTracksByStuId/'+stuId,
    method: 'get'
  })
}
// 根据学生id查询跟踪记录最新信息
export function getLastTrackByStuId(stuId) {
  return request({
    url: '/obtain/track/getLastTrackByStuId/'+parseStrEmpty(stuId),
    method: 'get'
  })
}

// 查询跟踪记录详细
export function getTrack(trackId) {
  return request({
    url: '/obtain/track/' + trackId,
    method: 'get'
  })
}

// 新增跟踪记录
export function addTrack(data) {
  return request({
    url: '/obtain/track',
    method: 'post',
    data: data
  })
}

// 修改跟踪记录
export function updateTrack(data) {
  return request({
    url: '/obtain/track',
    method: 'put',
    data: data
  })
}

// 删除跟踪记录
export function delTrack(trackId) {
  return request({
    url: '/obtain/track/' + trackId,
    method: 'delete'
  })
}
