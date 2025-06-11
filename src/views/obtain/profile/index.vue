<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="简历名称" prop="resumeName">
        <el-input
          v-model="queryParams.resumeName"
          placeholder="请输入简历名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="上传时间" prop="uploadTime">
        <el-date-picker clearable
          v-model="queryParams.uploadTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item label="班级" prop="roomName">
        <el-input
          v-model="queryParams.roomName"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['obtain:profile:add']"
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
          v-hasPermi="['obtain:profile:edit']"
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
          v-hasPermi="['obtain:profile:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:profile:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="profileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属学院" align="center" prop="deptName" />
      <el-table-column label="班级" align="center" prop="roomName" />
      <el-table-column label="学生" align="center" prop="stuName" />
<!--      <el-table-column label="作品集名称" align="center" prop="portfolioRealName" />-->
      <el-table-column label="上传时间" align="center" prop="uploadTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.uploadTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:profile:preview']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:profile:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:profile:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row,1)"
            v-hasPermi="['obtain:profile:downloadjl']"
          >下载简历</el-button>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row,2)"
            v-hasPermi="['obtain:profile:downloadzp']"
          >下载作品集</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePreview(scope.row)"
            v-hasPermi="['obtain:profile:preview']"
          >预览</el-button>
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
        :src="pre+this.form.resumeName"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-dialog :title="viewPdfTitle" :visible.sync="viewPdfOpen" width="1200px" append-to-body>
        <vue-office-pdf
          :src="pre+this.form.resumeName"
          style="height: 100vh;"
          @rendered="renderedHandler"
          @error="errorHandler"
        />
    </el-dialog>
    <el-dialog :title="viewXlsxTitle" :visible.sync="viewXlsxOpen" width="1200px" append-to-body>
      <vue-office-excel
        :src="pre+this.form.resumeName"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <!-- 添加或修改简历档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="简历上传" prop="resumeName">
          <profile_upload v-model="form.resumeName"></profile_upload>
        </el-form-item>
<!--        <el-form-item label="作品集上传" prop="portfolioName">
          <protfolio_upload v-model="form.portfolioName"></protfolio_upload>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProfile, getProfile, delProfile, addProfile, updateProfile,download } from "@/api/obtain/profile";
import {getToken} from "@/utils/auth";
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePdf from '@vue-office/pdf'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/docx/lib/index.css'
//引入上传组件
import profile_upload from "@/views/obtain/profile/profile_upload.vue";
import protfolio_upload from "@/views/obtain/profile/protfolio_upload.vue";



export default {
  name: "Profile",
  components: {
    VueOfficeDocx,VueOfficePdf,VueOfficeExcel,profile_upload,protfolio_upload
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
      // 简历档案表格数据
      profileList: [],
      fileData: '',
      // 弹出层标题
      title: "",
      docx:'',
      viewWordOpen:false,
      viewPdfOpen:false,
      viewXlsxOpen:false,
      studentShow:false,
      viewXlsxTitle:'',
      viewWordTitle:'',
      viewPdfTitle:'',
      // 是否显示弹出层
      open: false,
      previewData:'',
      previewDialogOpen:false,
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
      docxOptions: {
        className: "kaimo-docx-666", // string：默认和文档样式类的类名/前缀
        inWrapper:  true, // boolean：启用围绕文档内容的包装器渲染
        ignoreWidth: false, // boolean：禁用页面的渲染宽度
        ignoreHeight: false, // boolean：禁止渲染页面高度
        ignoreFonts: false, // boolean：禁用字体渲染
        breakPages: true, // boolean：在分页符上启用分页
        ignoreLastRenderedPageBreak: true, // boolean：在 lastRenderedPageBreak 元素上禁用分页
        experimental: false, // boolean：启用实验功能（制表符停止计算）
        trimXmlDeclaration: true, // boolean：如果为true，解析前会从​​ xml 文档中移除 xml 声明
        useBase64URL: false, // boolean：如果为true，图片、字体等会转为base 64 URL，否则使用URL.createObjectURL
        useMathMLPolyfill: false, // boolean：包括用于 chrome、edge 等的 MathML polyfill。
        showChanges: false, // boolean：启用文档更改的实验性渲染（插入/删除）
        debug: false, // boolean：启用额外的日志记录
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: null,
        resumeName: null,
        resumeRealName:null,
        resumePath: null,
        portfolioPath: null,
        uploadTime: null,
        status: null,
        resumeType:null,
        portfolioRealName:null,
        stuName: null
      },
    /*  file:{
        extName:'.docx'
      },*/
      // 表单参数
      form: {
        portfolioName:''
      },
      // 表单校验
      rules: {
        resumeName: [
          { required: true, message: "简历名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getQueryStuRoles();
    this.getList();
  },

  methods: {
    /** 查询简历档案列表 */
    getList() {
      this.loading = true;
      listProfile(this.queryParams).then(response => {
        this.profileList = response.rows;
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
        resumeId: null,
        stuId: null,
        resumeName: null,
        resumePath: null,
        portfolioPath: null,
        uploadTime: null,
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
      this.queryParams.stuName = null;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.resumeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.upload.fileList = [];
      this.title = "添加简历档案";
    },

    handlePreview(row){
        const arrType=row.resumeName.split(".");
        const ftype=arrType[arrType.length-1];
        if(ftype==='docx'){
          this.form.resumeName=row.resumeName;
          this.viewWordOpen = true;
          this.viewWordTitle='文件预览';
        }else if(ftype==='pdf'){
          this.form.resumeName=row.resumeName;
          this.viewPdfOpen = true;
          this.viewPdfTitle='文件预览';
        }else if(ftype==='xlsx'){
          this.form.resumeName=row.resumeName;
          this.viewXlsxOpen = true;
          this.viewXlsxTitle='文件预览';
        }else{
          this.$modal.msgError("文件格式不正确，目前只支持docx、xlsx和pdf文件预览");
        }

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const resumeId = row.resumeId || this.ids
      getProfile(resumeId).then(response => {
        this.form = response.data;
        this.open = true;
       /* if(this.form.resumeType==0){
          this.upload.fileList = [{ name: this.form.resumeRealName, url: this.form.resumePath }];
        }else{
          this.upload.fileList = [{ name: this.form.portfolioRealName, url: this.form.portfolioPath }];
        }
*/
        this.title = "修改简历档案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resumeId != null) {
            updateProfile(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProfile(this.form).then(response => {
              this.$modal.msgSuccess("添加成功");
                this.open = false;
                this.getList();
            });
            //创建FormData对象，用于携带数据传递到后端
            /*this.fileData = new FormData();
            this.$refs.upload.submit();
            this.fileData.append("data", JSON.stringify(this.form));
            this.fileData.append("headers", { Authorization: "Bearer " + getToken() });
            this.fileData.append("withCredentials",false)
            this.fileData.append("filename", "file");
            var i = this.upload.fileList.length;
            if(i!==0){
              addProfile(this.form).then(response => {
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
      const resumeIds = row.resumeId || this.ids;
      this.$modal.confirm('是否确认删除简历档案编号为"' + resumeIds + '"的数据项？').then(function() {
        return delProfile(resumeIds);
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
    renderedHandler() {
      console.log("渲染完成")
    },
    errorHandler() {
      console.log("渲染失败")
    },
    // 文件下载处理
    handleDownload(row,index){
      if(index==1){
        this.$download.resource( row.resumeName);
      }else{
        this.$download.zip(row.portfolioName, row.portfolioRealName);
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/profile/export', {
        ...this.queryParams
      }, `profile_${new Date().getTime()}.xlsx`)
    }
  }


};
</script>

