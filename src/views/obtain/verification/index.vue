<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属学院" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择所属学院"  >
          <el-option
            v-for="item in deptOptions"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
            @click.native="getSelectRoomBydeptId(item.deptId)"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属班级">
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="审核时间" prop="reviewedTime">
        <el-date-picker clearable
          v-model="queryParams.reviewedTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择审核时间">
        </el-date-picker>
      </el-form-item>-->

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:verification:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obtain:verification:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['obtain:verification:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:verification:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="qualityVerification"
          v-hasPermi="['obtain:verification:qualityVerification']"
        >生成就业质量核实确认单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="responsibilityAllowance"
          v-hasPermi="['obtain:verification:responsibilityAllowance']"
        >生成就业责任津贴核实确认单</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="verificationList" height="500" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属班级" fixed align="center" prop="room.roomName" />
      <el-table-column label="学员名称" align="center" prop="stuName" />
      <el-table-column label="就业状态" align="center" prop="statusNames"  width="190"/>
      <el-table-column label="核实结果" align="center" prop="reviewedResult" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.red_result" :value="scope.row.reviewedResult"/>
        </template>
      </el-table-column>
      <el-table-column label="学生电话录音" align="center" prop="followUpRecording" width="300" >
        <template slot-scope="scope">
          <audio class="width-full" ref="audios" controls :src="pre+scope.row.followUpRecording" :width="80" :height="20"></audio>
        </template>
      </el-table-column>

      <el-table-column label="家长电话录音" align="center" prop="parentRecording" width="300" >
        <template slot-scope="scope">
          <audio   ref="audios" controls :src="pre+scope.row.parentRecording" :width="80" :height="20"></audio>
        </template>
      </el-table-column>


      <el-table-column label="核实人" align="center" prop="reviewedBy"/>
      <el-table-column label="核实时间" align="center" prop="reviewedTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reviewedTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核实记录" align="center" prop="schoolRecord"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100" v-hasPermi="['obtain:verification:edit']">
        <template slot-scope="scope">
<!--          <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-hasPermi="['obtain:verification:edit']"
        >查看</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:verification:remove']"
          >删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['obtain:verification:edit']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,1)"
                v-hasPermi="['obtain:verification:warningNote']"
              >生成警示单</el-button><br>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,2)"
                v-hasPermi="['obtain:verification:accidentReport']"
              >生成事故单</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改就业数据审核结果对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="核实方式" prop="checkMethod">
          <el-input v-model="form.checkMethod" placeholder="请输入核实方式" />
        </el-form-item>
        <el-form-item label="考核状态" prop="obtainStatusA">
          <el-select v-model="form.obtainStatusA"
                     placeholder="请选择考核状态"
                     @change="firstColumnChangeAction($event)"
                     :style="'width:100%;'">
            <el-option
              v-for="item in firstColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="就业状态" prop="obtainStatusB">
          <el-select v-model="form.obtainStatusB"
                     placeholder="请选择就业状态"
                     value-key="id"
                     @change="secondColumnChangeAction($event)"
                     :style="'width:100%;'">
            <el-option
              v-for="item in secondColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="就业状态" prop="obtainStatusC">
          <el-select v-model="form.obtainStatusC"
                     placeholder="请选择就业状态"
                     :style="'width:100%;'">
            <el-option
              v-for="(item,index) in threeColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
              @click.native="threeColumnChangeAction(item.id,item.statusName)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话录音上传" prop="followUpRecording">
          <audio_upload v-model="form.followUpRecording"/>
        </el-form-item>
        <el-form-item label="审核结果" prop="reviewedResult">
          <el-radio-group v-model="form.reviewedResult">
            <el-radio
              v-for="dict in dict.type.red_result"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校方核实记录" prop="schoolRecord">
          <el-input v-model="form.schoolRecord" placeholder="请输入校方核实记录" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.t_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入项目描述" maxlength="200"
                    show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVerification, getVerification, delVerification, addVerification, updateVerification,responsibilityAllowance,qualityVerification,getAccidentReport } from "@/api/obtain/verification";
import {
  getSelectCollege,
  getSelectFirst,
  getSelectRoomBydeptId,
  getSelectSecond,
  getSelectThree
} from "@/api/obtain/student";
import {getToken} from "@/utils/auth";
import audio_upload from "@/views/obtain/student/detail/audio_upload.vue";

export default {
  name: "Verification",
  dicts: ['t_status','red_result'],
  components: {audio_upload},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 就业数据审核结果表格数据
      verificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      //一级状态下拉数据
      firstColumnList:[],
      // 二级状态下拉数据
      secondColumnList: [],
      // 三级状态下拉数据
      threeColumnList: [],
      obtainStatusA:'',
      obtainStatusB:'',
      obtainStatusC:'',
      pre: process.env.VUE_APP_HOST_PORT,
      pid:0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: null,
        roomId:null,
        deptId:null,
        checkMethod: null,
        followUpRealName: null,
        parentRecording: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        reviewedBy: null,
        reviewedTime: null,
        reviewedResult: null,
        status:"0"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {

      }
    };
  },
  created() {
    this.getList();
    this.getSelectCollege();
  },
  methods: {
    /** 查询就业数据审核结果列表 */
    getList() {
      this.loading = true;
      listVerification(this.queryParams).then(response => {
        this.verificationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    responsibilityAllowance(){
      if(this.queryParams.deptId!=null&&this.queryParams.roomId!=null){
        responsibilityAllowance(this.queryParams.deptId,this.queryParams.roomId).then(response=>{
          const msg=response.msg;
          console.log(msg)
          this.$download.resource(this.pre+'/profile/upload/'+msg);
          this.$modal.msgSuccess("生成就业责任津贴核实确认单成功！");
        });
      }else{
        this.$modal.msgError("请选择学院、班级");
      }
    },
    qualityVerification(){
        if(this.queryParams.deptId!=null&&this.queryParams.roomId!=null){
          qualityVerification(this.queryParams.deptId,this.queryParams.roomId).then(response=>{
            const msg=response.msg;
            console.log(msg)
            this.$download.resource(this.pre+'/profile/upload/'+msg);
            this.$modal.msgSuccess("生成就业质量核实确认单成功！");
          });
        }else{
          this.$modal.msgError("请选择学院、班级");
        }
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    /*根据学院筛选班级*/
    getSelectRoomBydeptId(deptId){
      console.log("学院信息加载完成，请求班级信息")
      this.$set(this.form, 'roomId', null);
      this.$set(this.queryParams, 'roomId', null);
      getSelectRoomBydeptId(deptId).then(response => {
        this.roomOptions = response.data.rooms;
      });
    },
    // 一级改动
    firstColumnChangeAction(e) {
      console.log("加载一级下拉数据")
      // 初始化二三级的列表
      //根据一级下拉框选择的id当做二级下拉框的父节点id查询二级下拉框的id
      this.getSelectSecond(e);
    },
    // 二级改动
    secondColumnChangeAction(e) {
      console.log("根据一级下拉id：" + e + "加载二级下拉数据")
      this.$set(this.queryParams, 'obtainStatusC', null);
      // 清空三级下拉
      // 根据二级下拉框选择的id当做三级下拉框的父节点id查询三级下拉框的id
      this.getSelectThree(e);
    },
    getSelectFirst(pid) {
      getSelectFirst(pid).then(Response => {
        this.firstColumnList = Response.data.statuss;
      })
    },
    getSelectSecond(pid) {
      getSelectSecond(pid).then(Response => {
        this.secondColumnList = Response.data.statuss;
      })
    },
    getSelectThree(pid) {
      getSelectThree(pid).then(Response => {
        this.threeColumnList = Response.data.statuss;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        stuId: null,
        trackId: null,
        trackDetailId: null,
        checkMethod: null,
        followUpRecording: null,
        followUpRealName: null,
        parentRecording: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        obtainSalary: null,
        reviewedBy: null,
        reviewedTime: null,
        reviewedResult: null,
        schoolRecord: null,
        status: "0",
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null,
        pid:0
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.roomId=null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.verifId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加就业数据审核结果";
    },
    /** 修改按钮操作 */
    handleUpdate(row,index) {
      const verifId = row.verifId;
      getAccidentReport(verifId,index).then(response => {
        const msg=response.msg;
        console.log(msg)
        this.$download.resource(this.pre+'/profile/upload/'+msg);
        if(index===1){
          this.$modal.msgSuccess("生成警示单成功！");
        }else{
          this.$modal.msgSuccess("生成事故单成功！");
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.verifId != null) {
            updateVerification(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVerification(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const verifIds = row.verifId || this.ids;
      this.$modal.confirm('是否确认删除就业数据审核结果编号为"' + verifIds + '"的数据项？').then(function() {
        return delVerification(verifIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /**是否先选择学院*/
    selectRemind(){
      if(this.roomOptions.length===0){
        this.$modal.msgError("请先选择学院");
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/verification/export', {
        ...this.queryParams
      }, `verification_${new Date().getTime()}.xlsx`)
    }
  }



};
</script>
