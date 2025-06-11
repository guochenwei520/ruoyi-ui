<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getOrderData} from "@/api/obtain/order";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getOrderData(){
      getOrderData().then(response => {
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['已完结', '处理中', '待处理']
          },
          series: [
            {
              name: '工单状态统计',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: response.data.orders,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
    //获取工单分组数据
      this.getOrderData();
      /*this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['工单已完成', '工单处理中', '工单待处理']
        },
        series: [
          {
            name: '状态统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data:
              [

              { value: 320, name: '工单已完成' },
              { value: 240, name: '工单处理中' },
              { value: 149, name: '工单待处理' },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })*/
    }
  }
}
</script>
