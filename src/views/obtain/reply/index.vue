<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="要回复的工单外键" prop="workId">
        <el-input
          v-model="queryParams.workId"
          placeholder="请输入要回复的工单外键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复人外键" prop="empId">
        <el-input
          v-model="queryParams.empId"
          placeholder="请输入回复人外键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复时间" prop="replyDate">
        <el-date-picker clearable
          v-model="queryParams.replyDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择回复时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="满意度外键" prop="degreeId">
        <el-input
          v-model="queryParams.degreeId"
          placeholder="请输入满意度外键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复类型：类型外键" prop="typeId">
        <el-input
          v-model="queryParams.typeId"
          placeholder="请输入回复类型：类型外键"
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
          v-hasPermi="['obtain:reply:add']"
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
          v-hasPermi="['obtain:reply:edit']"
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
          v-hasPermi="['obtain:reply:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:reply:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="replyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="replyId" />
      <el-table-column label="要回复的工单外键" align="center" prop="workId" />
      <el-table-column label="回复内容" align="center" prop="replyContent" />
      <el-table-column label="回复人外键" align="center" prop="empId" />
      <el-table-column label="回复时间" align="center" prop="replyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.replyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="满意度外键" align="center" prop="degreeId" />
      <el-table-column label="回复类型：类型外键" align="center" prop="typeId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:reply:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:reply:remove']"
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

    <!-- 添加或修改工单回复对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="要回复的工单外键" prop="workId">
          <el-input v-model="form.workId" placeholder="请输入要回复的工单外键" />
        </el-form-item>
        <el-form-item label="回复内容">
          <editor v-model="form.replyContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="回复人外键" prop="empId">
          <el-input v-model="form.empId" placeholder="请输入回复人外键" />
        </el-form-item>
        <el-form-item label="回复时间" prop="replyDate">
          <el-date-picker clearable
            v-model="form.replyDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择回复时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="满意度外键" prop="degreeId">
          <el-input v-model="form.degreeId" placeholder="请输入满意度外键" />
        </el-form-item>
        <el-form-item label="回复类型：类型外键" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入回复类型：类型外键" />
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
import { listReply, getReply, delReply, addReply, updateReply } from "@/api/obtain/reply";

export default {
  name: "Reply",
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
      // 工单回复表格数据
      replyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workId: null,
        replyContent: null,
        empId: null,
        replyDate: null,
        degreeId: null,
        typeId: null
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
    /** 查询工单回复列表 */
    getList() {
      this.loading = true;
      listReply(this.queryParams).then(response => {
        this.replyList = response.rows;
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
        replyId: null,
        workId: null,
        replyContent: null,
        empId: null,
        replyDate: null,
        degreeId: null,
        typeId: null
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
      this.ids = selection.map(item => item.replyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工单回复";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const replyId = row.replyId || this.ids
      getReply(replyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工单回复";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.replyId != null) {
            updateReply(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReply(this.form).then(response => {
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
      const replyIds = row.replyId || this.ids;
      this.$modal.confirm('是否确认删除工单回复编号为"' + replyIds + '"的数据项？').then(function() {
        return delReply(replyIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/reply/export', {
        ...this.queryParams
      }, `reply_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
