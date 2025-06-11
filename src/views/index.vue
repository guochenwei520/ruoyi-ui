<template>

  <div class="dashboard-editor-container">
      <span v-if="showStuIndex">
       <span   style="color: #000066;font-size: larger;">欢迎光临</span>
    </span>
    <span v-if="showIndex">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图形统计" name="first">
        <panel-group @handleSetLineChartData="handleSetLineChartData" />

        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData" />
        </el-row>

        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <pie-chart />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <bar-chart />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="数据统计(日报)" name="second">
        <el-form :model="countParam" ref="countQueryForm" size="small" :inline="true" label-width="68px">
          <el-form-item label="学院" prop="deptId">
            <el-select v-model="countParam.deptId" placeholder="学院">
              <el-option
                v-for="dept in this.depts"
                :key="dept.deptId"
                :label="dept.deptName"
                :value="dept.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="createTime">
            <el-date-picker clearable
                            v-model="countParam.countDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <table class="table0 table1" align="center" style="text-align: center; border: #1c84c6; line-height:20px;margin-bottom: 30px; border-collapse: collapse;" border="1" cellspacing="0" cellpadding="0">
          <tr>
            <th colspan="50">振涛教育就业日统计表 {{this.cdate}}</th>
          </tr>
          <tr>
            <th>学院</th>
            <th>当期数据</th>
            <th>返回数据</th>
            <th>以往数据</th>
          </tr>
          <tr v-for="(d,i) in countDeptResults">
            <th>{{d.deptName}}</th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th>班级</th></tr>
                  <tr><th>应就业总人数</th></tr>
                  <tr><th>当日就业人数</th></tr>
                  <tr><th>累计就业人数</th></tr>
                  <tr><th>当期就业率</th></tr>
                </table>
                <table class="table0 table2" v-for="(r,i) in d.roomResults" border="1" cellspacing="0" cellpadding="0">
                  <tr><th>{{r.roomName}}</th></tr>
                  <tr><th>{{r.dqTotal}}</th></tr>
                  <tr><th>{{r.dqCurrentDay}}</th></tr>
                  <tr><th>{{r.dqObtainCount}}</th></tr>
                  <tr><th>{{r.dqEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th colspan="2">全院数据</th></tr>
                  <tr><th>返回总人数</th><th>{{d.returnTotal}}</th></tr>
                  <tr><th>当日新增返回</th><th>{{d.returnCurrentDay}}</th></tr>
                  <tr><th>累计就业人数</th><th>{{d.returnObtainCount}}</th></tr>
                  <tr><th>返回就业率</th><th>{{d.returnEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th colspan="2">全院数据</th></tr>
                  <tr><th>以往总人数</th><th>{{d.beforeTotal}}</th></tr>
                  <tr><th>返回转以往人数</th><th>0</th></tr>
                  <tr><th>已就业人数</th><th>{{d.beforeObtainCount}}</th></tr>
                  <tr><th>以往就业率</th><th>{{d.beforeEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
          </tr>
        </table>
      </el-tab-pane>

      <el-tab-pane label="数据统计(月报)" name="three">
        <el-form :model="countParamMonth" ref="countQueryMonthForm" size="small" :inline="true" label-width="68px">
          <el-form-item label="学院" prop="deptId">
            <el-select v-model="countParamMonth.deptId" placeholder="学院">
              <el-option
                v-for="dept in this.depts"
                :key="dept.deptId"
                :label="dept.deptName"
                :value="dept.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月份" prop="createTime">
            <el-date-picker clearable
                            v-model="countParamMonth.countDate"
                            type="month"
                            value-format="yyyy-MM"
                            placeholder="请选择月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryMonth">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQueryMonth">重置</el-button>
          </el-form-item>
        </el-form>

        <table class="table0 table1" align="center" style="text-align: center; border: #1c84c6; line-height:20px;margin-bottom: 30px; border-collapse: collapse;" border="1" cellspacing="0" cellpadding="0">
          <tr>
            <th colspan="50">振涛教育就业月统计表 {{this.dateMonth}}</th>
          </tr>
          <tr>
            <th>学院</th>
            <th>当期数据</th>
            <th>返回数据</th>
            <th>以往数据</th>
            <th>月数据汇总</th>
          </tr>
          <tr v-for="(d,i) in countDeptResultsMonth">
            <th>{{d.deptName}}</th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th>班级</th></tr>
                  <tr><th>应就业总人数</th></tr>
                  <tr><th>实就业人数</th></tr>
                  <tr><th>当期转以往</th></tr>
                  <tr><th>就业质量</th></tr>
                  <tr><th>当期就业率</th></tr>
                </table>
                <table class="table0 table2" v-for="(r,i) in d.roomResults" border="1" cellspacing="0" cellpadding="0">
                  <tr><th>{{r.roomName}}</th></tr>
                  <tr><th>{{r.dqTotal}}</th></tr>
                  <tr><th>{{r.dqObtainCount}}</th></tr>
                  <tr><th>{{r.dqTotal - r.dqObtainCount}}</th></tr>
                  <tr><th>{{r.dqObtainQuality}}</th></tr>
                  <tr><th>{{r.dqEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th colspan="2">全院数据</th></tr>
                  <tr><th>学院上报返回人数</th><th>{{d.returnFromCollege}}</th></tr>
                  <tr><th>就业处核实返回人数</th><th>{{d.returnFromEmployment}}</th></tr>
                  <tr><th>返回人数总量</th><th>{{d.returnTotal}}</th></tr>
                  <tr><th>返回就业总人数</th><th>{{d.returnObtainCount}}</th></tr>
                  <tr><th>返回就业率</th><th>{{d.returnEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th colspan="2">全院数据</th></tr>
                  <tr><th>返回转以往</th><th>{{d.returnToBefore}}</th></tr>
                  <tr><th>当期转以往</th><th>{{d.currentToBefore}}</th></tr>
                  <tr><th>以往总人数</th><th>{{d.beforeTotal}}</th></tr>
                  <tr><th>已就业人数</th><th>{{d.beforeObtainCount}}</th></tr>
                  <tr><th>以往就业率</th><th>{{d.beforeEmploymentRate}}%</th></tr>
                </table>
              </div>
            </th>
            <th>
              <div style="display: flex;">
                <table class="table0 table2" border="1" cellspacing="0" cellpadding="0">
                  <tr><th colspan="2">全院数据</th></tr>
                  <tr><th>应就业人数</th><th></th></tr>
                  <tr><th>实就业人数</th><th></th></tr>
                  <tr><th>总就业率</th><th></th></tr>
                </table>
              </div>
            </th>
          </tr>
        </table>
      </el-tab-pane>
    </el-tabs>
    <!--<el-dialog :title="remindTitle" :visible.sync="remindOpen" width="260px" height="80px" append-to-body>
      <span>您有{{this.orderNum}}条待处理工单</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">去处理</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
      </span>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {selectObtainCount, selectObtainCountMonth, selectObtainCountDiff} from "../api/obtain/obtainCount"
import {getSelectCollege} from "../api/obtain/student";


const lineChartData = {
  /*newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [98, 102, 161, 129, 100, 149, 165]
  },*/
  messages: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [98, 102, 161, 129, 100, 149, 165]
  },
  purchases: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [98, 102, 161, 129, 100, 149, 165]
  },
  shoppings: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [98, 102, 161, 129, 100, 149, 165]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      newVisitis: {
        expectedData: [100, 100, 100, 100, 100, 100, 200],
        actualData: [100, 100, 100, 100, 100, 100, 200]
      },
      countParam: {
        deptId:null,
        roomId:null,
        countDate:null
      },
      countParamMonth: {
        deptId:null,
        roomId:null,
        countDate:null
      },
      activeName: 'first',
      cdate: '',
      dateMonth: '',
      countDeptResults: [],
      countDeptResultsMonth: [],
      depts:[],
      roomsByDeptId:[],
      lineChartData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      remindOpen:false,
      showStuIndex:false,
      showIndex:true,
      remindTitle:'',
      orderNum:''
    }
  },
  mounted() {
    this.getSelectCollege();
    this.obtainCount();
    this.obtainCountMonth();
    this.getQueryStuRoles();
    this.handleSetLineChartData();
  },
  methods: {
    /*获取学员登录角色*/
    getQueryStuRoles(){
      let roles=this.$store.state.user.roles;
      if(roles.includes('student')){
        this.showIndex=false;
        this.showStuIndex=true;
      }
    },
    /*线型图：每月应就业人数和就业人数对比*/
    handleSetLineChartData() {
      selectObtainCountDiff().then(response => {
        const expectedData = new Array();
        const actualData = new Array();
        const data = response.data;
        for(const i in data){
          const da = data[i];
          expectedData[i] = da.allStudent;
          actualData[i] = da.obtianStudent;
          console.log(expectedData);
          console.log(actualData);
        }

        this.lineChartData = {
          expectedData: expectedData,
            actualData: actualData
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getSelectCollege() {
      getSelectCollege().then(response => {
          this.depts = response.data.colleges;
      });
    },
    obtainCount(){
      selectObtainCount(this.countParam).then(response => {
        if (response){
          this.countDeptResults = response.data.deptResults;
          this.cdate = response.data.countDate;
        }
      });
    },
    obtainCountMonth(){
      selectObtainCountMonth(this.countParamMonth).then(response => {
        if (response){
          this.countDeptResultsMonth = response.data.deptResults;
          this.dateMonth = response.data.countDate;
        }
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.obtainCount();
    },
    /** 搜索按钮操作 */
    handleQueryMonth() {
      this.obtainCountMonth();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.countParam = {
        deptId:null,
        roomId:null,
        countDate:null
      };
    },
    /** 重置按钮操作 */
    resetQueryMonth() {
      this.countParamMonth = {
        deptId:null,
          roomId:null,
          countDate:null
      };
    }
  }
}
</script>

<style lang="scss" scoped>

  .table0 {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  .table0 th,td {
    border: 1px solid #999;
  }

  .table1 {
    min-width: 1200px;
  }
  .table2 tr td:nth-child(1) {
    border-left: 0;
  }
  .table2 tr:nth-child(1) td {
    border-top: 0;
  }
  .table2 tr:nth-child(1) td {
    border-right: 0;
  }
  .table3 tr:nth-last-child(1) td{
    border-bottom: 0;
  }
  .table2 tr:nth-last-child(1)>td{
    border-bottom: 0;
  }
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

th {
  padding: 20px;
}

</style>
