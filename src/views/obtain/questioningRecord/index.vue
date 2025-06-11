<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item>
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
          v-if="studentShow"
          v-hasPermi="['obtain:QuestioningRecord:add']"
        >新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:QuestioningRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="QuestioningRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提问问题" align="center" prop="questioningTitle" />
      <el-table-column label="提问截图" align="center" prop="questioningImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.questioningImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="questioningStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_questioning_status" :value="scope.row.questioningStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="提问时间" align="center" prop="questioningTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.questioningTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="processingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.processingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" prop="processinger" />
      <el-table-column label="处理内容" align="center" prop="processingContent" >
        <template slot-scope="scope">
            <span v-html="scope.row.processingContent"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:QuestioningRecord:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetailUpdate(scope.row)"
            v-hasPermi="['obtain:QuestioningRecord:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:QuestioningRecord:edit']"
            v-if="scope.row.questioningStatus==0"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:QuestioningRecord:remove']"
            v-if="scope.row.questioningStatus==0"
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
    <!--   详情 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="500px" append-to-body>
      <el-form ref="detailForm" :model="detailForm" :rules="detailRules" label-width="80px">
        <el-form-item label="提问问题" prop="questioningTitle">
          {{detailForm.questioningTitle}}
        </el-form-item>
        <el-form-item label="提问截图" prop="questioningImage" >
          <image-upload v-model="detailForm.questioningImage" />
        </el-form-item>
        <el-form-item label="处理记录" prop="questioningImage" >
          <editor v-model="detailForm.processingContent" :min-height="192" read-only />
        </el-form-item>
        <div align="center">
          <el-button
            type="primary"
            @click="submitDetailForm"
            v-if="detailForm.questioningStatus==1"
          >确认完结</el-button>
          <el-button @click="cancelDetail">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加或修改提问记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="提问问题" prop="questioningTitle">
          <el-input v-model="form.questioningTitle"  :min-height="192"/>
        </el-form-item>
        <el-form-item label="提问截图" prop="questioningImage" >
          <image-upload v-model="form.questioningImage" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listQuestioningRecord,
  getQuestioningRecord,
  delQuestioningRecord,
  addQuestioningRecord,
  updateQuestioning,
  updateQuestioningRecord, overQuestioningRecord
} from "@/api/obtain/questioningRecord";

export default {
  name: "QuestioningRecord",
  dicts: ['t_status','t_questioning_status'],
  filters: {//限制文本显示字数,超出部分用...代替
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 5) {
        return value.slice(0,5) + '...'//0:下标,从第一个字开始显示,50:显示字数,多余用...代替
      }
      return value
    }
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
      studentShow:false,
      // 总条数
      total: 0,
      // 提问记录表格数据
      QuestioningRecordList: [],
      // 弹出层标题
      title: "",
      detailTitle: "",
      // 是否显示弹出层
      open: false,
      detailOpen: false,
      sysUser:[],
      nickName:'',
      processingContent:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      detailForm: {},
      // 表单校验
      detailRules: {},
      rules: {
        questioningTitle: [
          { required: true, message: "问题不能为空", trigger: "blur" }
        ],
        processingContent: [
          { min: 0, max: 200, message: '内容长度必须介于 0 和 200 之间', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getQueryStuRoles();
    this.getList();
  },
  methods: {
    /** 查询提问记录列表 */
    getList() {
      this.loading = true;
      listQuestioningRecord(this.queryParams).then(response => {
        this.QuestioningRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    delTag(str){
      return str.replace(/<[^>]+>/g,"");
    },
    /*获取学生角色*/
    getQueryStuRoles(){
      let roles=this.$store.state.user.roles;
      if(roles.includes('student')){
        this.studentShow=true;
      }
    },
    cancelDetail() {
      this.detailOpen = false;
      this.resetDetail();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        questioningId: null,
        stuId: null,
        questioningTitle: null,
        questioningStatus: null,
        questioningTime: null,
        processingTime: null,
        processingContent: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 表单重置
    resetDetail() {
      this.detailForm = {
        questioningId: null,
        stuId: null,
        questioningTitle: null,
        questioningStatus: null,
        questioningTime: null,
        processingTime: null,
        processingContent: null,
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
      this.ids = selection.map(item => item.questioningId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "输入问题";
    },
    /** 详情 */
    handleDetailUpdate(row) {
      this.resetDetail();
      const questioningId = row.questioningId || this.ids
      getQuestioningRecord(questioningId).then(response => {
        this.detailForm = response.data;
        this.detailOpen = true;
        this.detailTitle = "处理详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const questioningId = row.questioningId || this.ids
      getQuestioningRecord(questioningId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提问记录";
      });
    },
    /*确认完结*/
    submitDetailForm(){
      if (this.detailForm.questioningId != null) {
        this.detailForm.questioningStatus=2;
        overQuestioningRecord(this.detailForm).then(response => {
          this.$modal.msgSuccess("确认完结");
          this.detailOpen = false;
          this.getList();
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.questioningId != null) {
            updateQuestioning(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestioningRecord(this.form).then(response => {
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
      const questioningIds = row.questioningId || this.ids;
      this.$modal.confirm('是否确认删除提问记录编号为"' + questioningIds + '"的数据项？').then(function() {
        return delQuestioningRecord(questioningIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/QuestioningRecord/export', {
        ...this.queryParams
      }, `QuestioningRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
