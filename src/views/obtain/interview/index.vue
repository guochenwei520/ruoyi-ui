<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入企业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.t_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-if="studentShow"
          v-hasPermi="['obtain:interview:add']"
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
          v-hasPermi="['obtain:interview:edit']"
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
          v-hasPermi="['obtain:interview:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:interview:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="interviewList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="enterpriseName" />
      <el-table-column label="最低薪资" align="center" prop="minSalary" />
      <el-table-column label="最高薪资" align="center" prop="maxSalary" />
      <el-table-column label="企业图片" align="center" prop="enterpriseImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.enterpriseImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="面试心得" align="center" prop="interviewExperience" />
      <el-table-column label="面试时间" align="center" prop="recordingTime" />
      <el-table-column label="录音文件" align="center" prop="recordingDuration" width="300" >
        <template slot-scope="scope">
          <audio class="width-full" ref="audios" controls :src="pre+scope.row.recordingDuration" :width="80" :height="30"></audio>
<!--          <audio ref="audio" :src="scope.row.recordingDuration"></audio>-->
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:interview:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:interview:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:interview:remove']"
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

    <!-- 添加或修改面试记录对话框  -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="面试岗位" prop="enterpriseName">
          <el-input v-model="form.postName" placeholder="请输入面试岗位" />
        </el-form-item>
        <el-form-item label="最低薪资" prop="minSalary">
          <el-input v-model="form.minSalary" placeholder="请输入最低薪资" />
        </el-form-item>
        <el-form-item label="最高薪资" prop="maxSalary">
          <el-input v-model="form.maxSalary" placeholder="请输入最高薪资" />
        </el-form-item>
        <el-form-item label="企业图片" prop="enterpriseImage">
          <image-upload v-model="form.enterpriseImage"/>
        </el-form-item>
        <el-form-item label="面试心得" prop="interviewExperience">
          <el-input v-model="form.interviewExperience" placeholder="请输入面试心得" />
        </el-form-item>
        <el-form-item label="面试时间" prop="recordingTime">
          <el-date-picker clearable
                          v-model="form.recordingTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择面试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="录音文件" prop="recordingDuration">
          <interview_upload v-model="form.recordingDuration"/>
        </el-form-item>
<!--          <el-upload
            class="upload-demo"
            ref="upload"
            accept=".m4a, .mp3, swf, .flv, .wav, .wma, .wmv, .mid, .mpg, .amr, .awb"
            :action="upload.url"
            drag
            multiple
            :http-request="HttpUploadFile"
            :headers="upload.headers"
            :file-list="upload.fileList"
            :on-success="handleFileSuccess"
            :on-change="changeFileList"
            :data="getfileData()"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处或点击图标区域</div>
            <div slot="tip" class="el-upload__tip">录音上传支持M4A/mp3等格式</div>
          </el-upload>-->

<!--        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.t_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listInterview, getInterview, delInterview, addInterview, updateInterview } from "@/api/obtain/interview";
import {getToken} from "@/utils/auth";
import interview_upload from "@/views/obtain/interview/interview_upload.vue";

export default {
  name: "Interview",
  components: {interview_upload},
  dicts: ['t_status'],
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
      // 面试记录表格数据
      interviewList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 音频文件路径
      //music_path: require('../../assets/audio/idCard.mp3'),
      // 是否播放音频
      is_play: false,
      studentShow:false,

      /*面试岗位集合*/
      postOptions:[],
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
      pre: process.env.VUE_APP_HOST_PORT,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: null,
        enterpriseName: null,
        minSalary: null,
        maxSalary: null,
        enterpriseImage: null,
        interviewExperience: null,
        recordingDuration: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
          { min: 2, max: 50, message: '企业名称长度必须介于 2 和 50 之间', trigger: 'blur' }
        ],
        enterpriseImage: [
          { required: true, message: "企业图片不能为空", trigger: "blur" }
        ],
        interviewExperience: [
          { required: true, message: "面试心得不能为空", trigger: "blur" },
          { min: 2, max: 200, message: '面试心得长度必须介于 2 和 200 之间', trigger: 'blur' }
        ],
        recordingTime: [
          { required: true, message: "面试时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getQueryStuRoles();
    this.getList();
  },
  mounted() {
  },

  methods: {
    /** 查询面试记录列表 */
    getList() {
      this.loading = true;
      listInterview(this.queryParams).then(response => {
        this.interviewList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /*获取学生角色*/
    getQueryStuRoles(){
      let roles=this.$store.state.user.roles;
      if(roles.includes('student')){
        this.studentShow=true;
      }
    },
    // 播放音频
    aclick(src) {
      this.$refs.audio.src = src;
      if (this.is_play) {
        this.$refs['audio'].pause();
        this.is_play = false
      } else {
        this.$refs['audio'].play();
        this.is_play = true
      }
    },

    // 取消按钮
    cancel() {
      this.upload.isUploading = false;
      this.upload.fileList = [];
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        interviewId: null,
        stuId: null,
        enterpriseName: null,
        recordingReal:null,
        minSalary: null,
        maxSalary: null,
        enterpriseImage: null,
        interviewExperience: null,
        recordingDuration: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.interviewId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();

      this.open = true;
      this.title = "添加面试记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      const interviewId = row.interviewId || this.ids
      getInterview(interviewId).then(response => {
        this.form = response.data;
        this.open = true;
        this.upload.fileList = [{ name: this.form.recordingReal,url: this.form.recordingPath }];
        this.title = "修改面试记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.interviewId != null) {
            updateInterview(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInterview(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
            //创建FormData对象，用于携带数据传递到后端
            /*this.fileData = new FormData();
            this.$refs.upload.submit();
            this.fileData.append("data", JSON.stringify(this.form));
            this.fileData.append("headers", { Authorization: "Bearer " + getToken() });
            this.fileData.append("withCredentials",false);
            this.fileData.append("filename", "file");
            var i = this.upload.fileList.length;
            if(i!==0) {
              addInterview(this.fileData).then(response => {
                this.upload.isUploading = false;
                this.upload.fileList = [];
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }else{
              this.$message({
                message: "失败",
                type: 'error'
              })
            }*/
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const interviewIds = row.interviewId || this.ids;
      this.$modal.confirm('是否确认删除面试记录编号为"' + interviewIds + '"的数据项？').then(function() {
        return delInterview(interviewIds);
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
      this.form.recordingPath = response.url;
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/interview/export', {
        ...this.queryParams
      }, `interview_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
