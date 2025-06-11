import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

//就业统计数据(日报)
export  function selectObtainCount(countParam){
    return request({
      url: '/obtain/count/list',
      method: 'post',
      data: countParam
    })
}
//就业统计数据(月报)
export  function selectObtainCountMonth(countParamMonth){
  return request({
    url: '/obtain/count/listMonth',
    method: 'post',
    data: countParamMonth
  })
}
//面板图
export  function selectPanelGroup(){
  return request({
    url: '/obtain/count/selectPanelGroup',
    method: 'get'
  })
}
//线型图：每月应就业人数和就业人数对比
export  function selectObtainCountDiff(){
  return request({
    url: '/obtain/count/obtainCountDiff',
    method: 'get'
  })
}
