<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入学院名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工名称" prop="teacherName">
        <el-input
          v-model="queryParams.teacherName"
          placeholder="请输入员工名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入职位名称"
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
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:accident:add']"
        >新增</el-button>
      </el-col>-->
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obtain:accident:edit']"
        >修改</el-button>
      </el-col>-->
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['obtain:accident:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:accident:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accidentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院名称" align="center" prop="deptName" />
      <el-table-column label="员工名称" align="center" prop="teacherName" />
      <el-table-column label="职位名称" align="center" prop="postName" />
      <el-table-column label="事故报告人" align="center" prop="reportedBy" />
      <el-table-column label="发单日期" align="center" prop="reportedTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reportedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核实记录" align="center" prop="schoolRecord" />
      <el-table-column label="事故单类型" align="center" prop="reportedType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_reported_type" :value="scope.row.reportedType"/>
        </template>
      </el-table-column>
      <el-table-column label="事故单状态" align="center" prop="reportedStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_reported_status" :value="scope.row.reportedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:accident:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:accident:edit']"
          >修改状态</el-button>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:accident:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改事故单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学院名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入学院名称" />
        </el-form-item>
        <el-form-item label="员工名称" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入员工名称" />
        </el-form-item>
        <el-form-item label="职位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="发单部门" prop="issuingDepartment">
          <el-input v-model="form.issuingDepartment" placeholder="请输入发单部门" />
        </el-form-item>
        <el-form-item label="事故报告人" prop="reportedBy">
          <el-input v-model="form.reportedBy" placeholder="请输入事故报告人" />
        </el-form-item>
        <el-form-item label="发单日期" prop="reportedTime">
          <el-date-picker clearable
            v-model="form.reportedTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核实记录" prop="schoolRecord">
          <el-input v-model="form.schoolRecord" placeholder="请输入核实记录" />
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
import { listAccident, getAccident, delAccident, addAccident, updateAccident } from "@/api/obtain/accident";

export default {
  name: "Accident",
  dicts: ['t_reported_status', 't_reported_type'],
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
      // 事故单表格数据
      accidentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: null,
        teacherName: null,
        postName: null,
        reportedType: null,
        reportedStatus: null,
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
  },
  methods: {
    /** 查询事故单列表 */
    getList() {
      this.loading = true;
      listAccident(this.queryParams).then(response => {
        this.accidentList = response.rows;
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
        accidentId: null,
        deptId: null,
        deptName: null,
        teacherId: null,
        teacherName: null,
        postId: null,
        postName: null,
        isRegular: null,
        issuingDepartment: null,
        reportedBy: null,
        reportedTime: null,
        schoolRecord: null,
        reportedType: null,
        reportedStatus: null,
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
      this.ids = selection.map(item => item.accidentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加事故单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const reportedStatus = row.reportedStatus;
      const accidentId = row.accidentId;
      getAccident(reportedStatus,accidentId).then(response => {
        this.$modal.msgSuccess("状态修改成功");
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.accidentId != null) {
            updateAccident(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccident(this.form).then(response => {
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
      const accidentIds = row.accidentId || this.ids;
      this.$modal.confirm('是否确认删除事故单编号为"' + accidentIds + '"的数据项？').then(function() {
        return delAccident(accidentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/accident/export', {
        ...this.queryParams
      }, `accident_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
