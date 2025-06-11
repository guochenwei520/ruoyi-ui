<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item>
        <el-input type="hidden" v-model="queryParams.projectId"  />
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:projectDetail:add']"
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
          v-hasPermi="['obtain:projectDetail:edit']"
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
          v-hasPermi="['obtain:projectDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
        v-hasPermi="['obtain:projectDetail:export']"
      >导出</el-button>
    </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="goBack"
        >返回</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题栏目" align="center" prop="projectColumn" />
      <el-table-column label="附件名称" align="center" prop="columnRealName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:projectDetail:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
            v-hasPermi="['obtain:projectDetail:query']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:projectDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:projectDetail:remove']"
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

    <!-- 添加或修改项目管理详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-input type="hidden" v-model="form.projectId"  />
        <el-form-item label="标题栏目" prop="projectColumn">
          <el-input v-model="form.projectColumn" placeholder="请输入标题栏目" />
        </el-form-item>
        <el-form-item label="附件名称" prop="columnName">
          <project_upload v-model="form.columnName"/>
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
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="200"
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
import { listProjectDetail, getProjectDetail, delProjectDetail, addProjectDetail, updateProjectDetail } from "@/api/obtain/projectDetail";
import project_upload from "@/views/obtain/projectDetail/project_upload.vue";
export default {
  name: "ProjectDetail",
  components: {
    project_upload
  },
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
      // 项目管理详情表格数据
      projectDetailList: [],
      // 弹出层标题
      title: "",
      projectId:0,
      str:'',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId:0
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.projectId=this.$route.query.projectId;
    this.queryParams.projectId=this.projectId;
    this.getList();
  },
  methods: {
    /** 查询项目管理详情列表 */
    getList() {
      this.loading = true;
      this.queryParams.projectId=this.projectId;
      listProjectDetail(this.queryParams).then(response => {
        this.projectDetailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        projectDetailId: null,
        projectId: null,
        projectColumn: null,
        columnName: null,
        columnRealName: null,
        status: 0,
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
      this.ids = selection.map(item => item.projectDetailId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.projectId=this.projectId;
      this.open = true;
      this.title = "添加项目管理详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.projectId=this.projectId;
      const projectDetailId = row.projectDetailId || this.ids
      getProjectDetail(projectDetailId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目管理详情";
      });
    },
    // 文件下载处理
    handleDownload(row){
      /*判断是否是压缩包，下载方式不同*/
      const suffix=this.str.substring(this.str.lastIndexOf('.')+1);
      console.log(suffix);
      if(suffix==="zip"||suffix==="rar"){
        this.$download.zip(row.columnName, row.columnRealName);
      }else{
        this.$download.resource( row.columnName);
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.projectDetailId != null) {
            updateProjectDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProjectDetail(this.form).then(response => {
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
      const projectDetailIds = row.projectDetailId || this.ids;
      this.$modal.confirm('是否确认删除项目管理详情编号为"' + projectDetailIds + '"的数据项？').then(function() {
        return delProjectDetail(projectDetailIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    // 取消按钮 返回学生列表
    goBack() {
      this.$router.push({
        path:'/project',
        query:{
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/projectDetail/export', {
        ...this.queryParams
      }, `projectDetail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
