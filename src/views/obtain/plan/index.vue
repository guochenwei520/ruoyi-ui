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
      <el-form-item label="所属班级" prop="roomId">
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obtain:plan:edit']"
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
          v-hasPermi="['obtain:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院名称" align="center" prop="sysDept.deptName" />
      <el-table-column label="班级名称" align="center" prop="room.roomName" />
      <el-table-column label="课程计划" align="center" prop="planRealName" />
      <el-table-column label="项目经理" align="center" prop="sysUser.nickName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" v-hasPermi="['obtain:plan:preview']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePreview(scope.row)"
            v-hasPermi="['obtain:plan:preview']"
          >预览</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:plan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
            v-hasPermi="['obtain:plan:download']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:plan:remove']"
          >删除</el-button>
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
    <el-dialog :title="viewWordTitle" :visible.sync="viewWordOpen" width="1200px" append-to-body>
      <vue-office-docx
        :src="pre+this.form.planName"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-dialog :title="viewPdfTitle" :visible.sync="viewPdfOpen" width="1200px" append-to-body>
      <vue-office-pdf
        :src="pre+this.form.planName"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-dialog :title="viewXlsxTitle" :visible.sync="viewXlsxOpen" width="1200px" append-to-body>
      <vue-office-excel
        :src="pre+this.form.planName"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <!-- 添加或修改课程计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="所属学院" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属学院"  >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              @click.native="getSelectRoomBydeptId(item.deptId)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="roomId">
          <el-select v-model="form.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
            <el-option
              v-for="item in roomOptions"
              :key="item.roomId"
              :label="item.roomName"
              :value="item.roomId"
              @click="checkDeptIdSelected"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程计划" prop="planName">
          <plan_upload v-model="form.planName"></plan_upload>
        </el-form-item>
        <el-form-item label="计划时间段" prop="planTime">
          <el-input v-model="form.planTime" placeholder="请输入上课时间" />
        </el-form-item>
<!--        <el-form-item label="上课老师" prop="roomId">
          <el-select v-model="form.userId" placeholder="请选择项目经理">
            <el-option
              v-for="item in teacherOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>-->
<!--        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.t_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入描述" maxlength="200"
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
import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/obtain/plan";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getSelectCollege, getSelectRoomBydeptId} from "@/api/obtain/student";
import {deptTreeSelect} from "@/api/system/user";
import {getToken} from "@/utils/auth";
import {addProfile} from "@/api/obtain/profile";

//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePdf from '@vue-office/pdf'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/docx/lib/index.css'

import plan_upload from "@/views/obtain/plan/plan_upload.vue"
import {getSelectRoom} from "@/api/obtain/room";
export default {
  name: "Plan",
  dicts: ['t_status'],
  components: {
    VueOfficeDocx,VueOfficePdf,VueOfficeExcel,Treeselect,plan_upload
  },
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
      // 课程计划表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      /*讲师下拉*/
      teacherOptions:[],
      viewWordOpen:false,
      viewPdfOpen:false,
      viewXlsxOpen:false,
      viewXlsxTitle:'',
      viewWordTitle:'',
      viewPdfTitle:'',
      pre: process.env.VUE_APP_HOST_PORT,
      //上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/obtain/common/upload",
        // 上传的文件列表
        fileList: [],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: null,
        deptId: null,
        deptName: null,
        roomId: null,
        roomName: null,
        userId: null,
        nickName: null,
      },
      // 表单参数
      form: {
        planId:'',
        planName:'',
        planRealName:'',
        planPath:'',
        deptId:'',
        roomId:'',
        userId:'',
        planTime:'',
        room:{roomId:'',roomName:''},
        sysDept:{deptId:'',deptName:''},
        sysUser:{userId:'',userName:''},

        status:''
      },
      // 表单校验
      rules: {
        planName: [
          { required: true, message: "课程计划不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属学院不能为空", trigger: "change" }
        ],
        roomId: [
          { required: true, message: "所属班级不能为空", trigger: "change" }
        ],
        userId: [
          { required: true, message: "项目经理不能为空", trigger: "change" }
        ],
        planTime: [
          { required: true, message: "计划时间段不能为空", trigger: "change" },
          { min: 2, max: 50, message: '计划时间段长度必须介于 2 和 50 之间', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getSelectCollege(); //学院

  },
  methods: {
    /** 查询课程计划列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then(response => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;

      });
    },
    selectRemind(){
      if(this.roomOptions.length===0){
        this.$modal.msgError("请先选择学院");
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        planId: null,
        planName: null,
        planRealName: null,
        planPath: null,
        deptId: null,
        roomId: null,
        userId: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },


    // 文件下载处理
    handleDownload(row){
        this.$download.resource( row.planName);
    },
    //文件预览
    handlePreview(row){
      const arrType=row.planName.split(".");
      const ftype=arrType[arrType.length-1];
      if(ftype==='docx'){
        this.form.planName=row.planName;
        this.viewWordOpen = true;
        this.viewWordTitle='文件预览';
      }else if(ftype==='pdf'){
        this.form.planName=row.planName;
        this.viewPdfOpen = true;
        this.viewPdfTitle='文件预览';
      }else if(ftype==='xlsx'){
        this.form.planName=row.planName;
        this.viewXlsxOpen = true;
        this.viewXlsxTitle='文件预览';
      }else{
        this.$modal.msgError("文件格式不正确，目前只支持docx、xlsx和pdf文件预览");
      }

    },
    renderedHandler() {
      console.log("渲染完成")
    },
    errorHandler() {
      console.log("渲染失败")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.planId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    getSelectRoom(){
      getSelectRoom().then(response=>{
        this.roomOptions = response.rooms;
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getSelectCollege(); //学院
      this.roomOptions=[];
      this.open = true;
      this.title = "添加课程计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getSelectCollege(); //学院
      this.getSelectRoom();//班级回显
      const planId = row.planId || this.ids
      getPlan(planId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.planId != null) {
            updatePlan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlan(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
            /*this.fileData = new FormData();
            this.$refs.upload.submit();
            this.fileData.append("data", JSON.stringify(this.form));
            this.fileData.append("headers", { Authorization: "Bearer " + getToken() });
            this.fileData.append("withCredentials",false)
            this.fileData.append("filename", "file");
            var i = this.upload.fileList.length;
            if(i!==0){
              addPlan(this.fileData).then(response => {
                if(response.code===200){
                  this.upload.isUploading = false;
                  this.upload.fileList = [];
                  this.open = false;
                  this.getList();
                }else{
                  this.$message({
                    message: "失败",
                    type: 'error'
                  })
                }
              });
            }*/
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const planIds = row.planId || this.ids;
      this.$modal.confirm('是否确认删除课程计划编号为"' + planIds + '"的数据项？').then(function() {
        return delPlan(planIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /********************************文件上传***************************************/
// 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
// 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.upload.fileList = [];
      this.form.resumePath = response.url;
      this.msgSuccess(response.msg);
    },
    //fileList长度改变时触发
    changeFileList(file, fileList) {
      this.upload.fileList = fileList
    },

    getfileData() {
      //此处的form是表单中的其它绑定值
      return this.form
    },
    HttpUploadFile(file) {
      this.fileData.append('files', file.file); // append增加数据
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
    checkDeptIdSelected(){
      if(this.form.deptId==null){
        this.$modal.msgError("请先选择学院!");
      }
    },

    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      if (confirm("您确定要导出课程计划数据么?")) {
        this.download('obtain/plan/export', {
          ...this.queryParams
        }, `plan_${new Date().getTime()}.xlsx`)
      }
    }
  }
};
</script>
