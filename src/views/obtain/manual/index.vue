<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模块名称" prop="manualName">
        <el-input
          v-model="queryParams.manualName"
          placeholder="请输入模块名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块角色" prop="manualRole">
        <el-input
          v-model="queryParams.manualRole"
          placeholder="请输入模块角色"
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
          v-hasPermi="['obtain:manual:add']"
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
          v-hasPermi="['obtain:manual:edit']"
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
          v-hasPermi="['obtain:manual:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:manual:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-dialog :title="viewWordTitle" :visible.sync="viewWordOpen" width="1200px" append-to-body>
      <vue-office-docx
        :src="pre+this.form.operationProcess"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-dialog :title="viewPdfTitle" :visible.sync="viewPdfOpen" width="1200px" append-to-body>
      <vue-office-pdf
        :src="pre+this.form.operationProcess"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-dialog :title="viewXlsxTitle" :visible.sync="viewXlsxOpen" width="1200px" append-to-body>
      <vue-office-excel
        :src="pre+this.form.operationProcess"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-dialog>
    <el-table v-loading="loading" :data="manualList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模块名称" align="center" prop="manualName" />
      <el-table-column label="模块角色" align="center" prop="manualRole" />
      <el-table-column label="操作流程" align="center" prop="manualDoc" />
      <el-table-column label="操作录屏" align="center" prop="screenUpload" >
          <template slot-scope="scope">
            <video class="width-full" controls="controls" :src="pre+scope.row.screenUpload" :width="80" :height="30"></video>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:manual:preview']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:manual:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePreview(scope.row)"
            v-hasPermi="['obtain:manual:preview']"
          >预览</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
            v-hasPermi="['obtain:manual:download']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:manual:remove']"
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

    <!-- 添加或修改用户手册对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模块名称" prop="manualName">
          <el-input v-model="form.manualName" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="模块角色" prop="manualRole">
          <el-input v-model="form.manualRole" placeholder="请输入模块角色" />
        </el-form-item>
        <el-form-item label="操作流程" prop="operationProcess">
          <manual_doc v-model="form.operationProcess"></manual_doc>
<!--          <el-input type="textarea" v-model="form.operationProcess" placeholder="请输入操作流程" maxlength="200"
                    show-word-limit />-->
        </el-form-item>
        <el-form-item label="操作录屏" prop="screenUpload">
          <manual_upload v-model="form.screenUpload"/>
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
import { listManual, getManual, delManual, addManual, updateManual } from "@/api/obtain/manual";
import manual_doc from "@/views/obtain/manual/manual_doc.vue";
import manual_upload from "@/views/obtain/manual/manual_upload.vue";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficePdf from "@vue-office/pdf";
import VueOfficeExcel from "@vue-office/excel";
import profile_upload from "@/views/obtain/profile/profile_upload.vue";
//引入相关样式
import '@vue-office/docx/lib/index.css'
export default {
  name: "Manual",
  components: {
    VueOfficeDocx,VueOfficePdf,VueOfficeExcel,manual_upload,manual_doc
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
      // 用户手册表格数据
      manualList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      docx:'',
      viewWordOpen:false,
      viewPdfOpen:false,
      viewXlsxOpen:false,
      studentShow:false,
      viewXlsxTitle:'',
      viewWordTitle:'',
      viewPdfTitle:'',
      previewData:'',
      previewDialogOpen:false,
      pre: process.env.VUE_APP_HOST_PORT,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        manualName: null,
        manualRole: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户手册列表 */
    getList() {
      this.loading = true;
      listManual(this.queryParams).then(response => {
        this.manualList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handlePreview(row){
      const arrType=row.operationProcess.split(".");
      const ftype=arrType[arrType.length-1];
      if(ftype==='docx'){
        this.form.operationProcess=row.operationProcess;
        this.viewWordOpen = true;
        this.viewWordTitle='文件预览';
      }else if(ftype==='pdf'){
        this.form.operationProcess=row.operationProcess;
        this.viewPdfOpen = true;
        this.viewPdfTitle='文件预览';
      }else if(ftype==='xlsx'){
        this.form.operationProcess=row.operationProcess;
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
    handleDownload(row){
      this.$download.resource(row.operationProcess);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        manualId: null,
        manualName: null,
        manualRole: null,
        operationProcess: null,
        manualDoc: null,
        screenUpload: null,
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
      this.ids = selection.map(item => item.manualId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户手册";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const manualId = row.manualId || this.ids
      getManual(manualId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户手册";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.manualId != null) {
            updateManual(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManual(this.form).then(response => {
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
      const manualIds = row.manualId || this.ids;
      this.$modal.confirm('是否确认删除用户手册编号为"' + manualIds + '"的数据项？').then(function() {
        return delManual(manualIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/manual/export', {
        ...this.queryParams
      }, `manual_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
