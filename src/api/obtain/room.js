import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询班级管理列表
export function listRoom(query) {
  return request({
    url: '/obtain/room/list',
    method: 'get',
    params: query
  })
}

// 查询班级管理详细
export function getRoom(roomId) {
  return request({
    url: '/obtain/room/' + parseStrEmpty(roomId),
    method: 'get'
  })
}
export function getSelectRoom() {
  return request({
    url: '/obtain/room/getSelectRoomAll',
    method: 'get'
  })
}
// 查询下拉数据
export function getSelectTeacherByDeptId(deptId) {
  return request({
    url: '/obtain/room/getRoomSelect/'+parseStrEmpty(deptId),
    method: 'get'
  })
}

// 新增班级管理
export function addRoom(data) {
  return request({
    url: '/obtain/room',
    method: 'post',
    data: data
  })
}

// 修改班级管理
export function updateRoom(data) {
  return request({
    url: '/obtain/room',
    method: 'put',
    data: data
  })
}



// 删除班级管理
export function delRoom(roomId) {
  return request({
    url: '/obtain/room/' + roomId,
    method: 'delete'
  })
}

