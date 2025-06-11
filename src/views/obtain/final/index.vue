<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入学院名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          v-model="queryParams.studentName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历层次">
        <el-input
          v-model="queryParams.education"
          placeholder="请输入学历层次"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭住址">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入家庭住址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市场部">
        <el-input
          v-model="queryParams.marketName"
          placeholder="请输入市场部"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否就业">
        <el-select v-model="queryParams.obtainStatus" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item label="就业城市" prop="obtainCity">
        <el-input
          v-model="queryParams.obtainCity"
          placeholder="请输入就业城市"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="就业企业" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入就业企业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="入学时间" prop="intakeDate">
        <el-date-picker
          v-model="queryParams.intakeDateRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="毕业时间" prop="intakeDate">
        <el-date-picker
          v-model="queryParams.endDateRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="就业时间" prop="intakeDate">
        <el-date-picker
          v-model="queryParams.obtainDateRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          align="right">
        </el-date-picker>
      </el-form-item>
<!--      <el-form-item label="就业岗位" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入就业岗位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="最低薪资" prop="obtainSalary">
        <el-input
          v-model="queryParams.obtainSalary"
          placeholder="请输入最低就业薪资"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高薪资" prop="obtainSalary">
        <el-input
          v-model="queryParams.obtainSalaryHigh"
          placeholder="请输入最高就业薪资"
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
          v-hasPermi="['obtain:final:add']"
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
          v-hasPermi="['obtain:final:edit']"
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
          v-hasPermi="['obtain:final:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:final:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finalList" height="500" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="学生姓名" fixed align="center" prop="studentName" />
      <el-table-column label="学生层次" align="center" prop="education" />
      <el-table-column label="手机号" align="center" prop="mobile" width="110"/>
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex"/>
        </template>
      </el-table-column>
      <el-table-column label="市场部" align="center" prop="marketName" />
      <el-table-column label="学院" align="center" prop="deptName" width="110"/>
      <el-table-column label="班级" align="center" prop="roomName" width="100"/>
      <el-table-column label="项目经理" align="center" prop="teacherName" />
      <el-table-column label="就业指导" align="center" prop="daoyuanName" />
      <el-table-column label="是否就业" align="center" prop="obtainStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.yes_no" :value="scope.row.obtainStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="就业企业" align="center" prop="enterpriseName" width="180"/>
      <el-table-column label="就业薪资" align="center" prop="obtainSalary"/>
      <el-table-column label="家庭住址" align="center" prop="address" width="260"/>
      <el-table-column label="就业城市" align="center" prop="obtainCity" />
      <el-table-column label="就业岗位" align="center" prop="postName" width="120"/>
      <el-table-column v-if="roleName!='marketing'" label="公司地址" align="center" prop="companyAddress" width="120"/>
      <el-table-column label="入学时间" align="center" prop="intakeDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.intakeDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毕业时间" align="center" prop="endDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="就业时间" align="center" prop="obtainDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.obtainDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="岗位性质" align="center" prop="nature">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_nature" :value="scope.row.nature"/>
        </template>
      </el-table-column>
      <el-table-column label="面试次数" align="center" prop="interviewNumber" />
      <el-table-column label="offer数" align="center" prop="offerNumber" />
      <el-table-column label="备注" align="center" prop="remark" width="350"/>
<!--      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:final:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:final:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学生就业信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFinal, getFinal, delFinal, addFinal, updateFinal } from "@/api/obtain/final";
import store from "@/store";

export default {
  name: "Final",
  dicts: ['sys_user_sex', 'yes_no',"t_nature"],
  data() {
    return {
      //用户角色
      roleName: '',
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
      // 学生就业信息表格数据
      finalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentName: null,
        education: null,
        mobile: null,
        sex: null,
        marketName: null,
        deptName: null,
        roomName: null,
        intakeDate: null,
        endDate: null,
        obtainDate: null,
        obtainCity: null,
        enterpriseName: null,
        postName: null,
        obtainSalary: null,
        obtainSalaryHigh: null,
        intakeDateRange: [],
        endDateRange: [],
        obtainDateRange: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        studentId: [
          { required: true, message: "学生外键不能为空", trigger: "blur" }
        ],
        studentName: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学生就业信息列表 */
    getList() {
      if(store.getters.roles.length > 0){
        this.roleName = store.getters.roles[0];
      }
      this.loading = true;
      listFinal(this.queryParams).then(response => {
        this.finalList = response.rows;
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
        obtainFinalId: null,
        studentId: null,
        studentName: null,
        education: null,
        mobile: null,
        idenNum: null,
        address: null,
        sex: null,
        marketId: null,
        marketName: null,
        deptId: null,
        deptName: null,
        roomId: null,
        roomName: null,
        teacherId: null,
        teacherName: null,
        daoyuanId: null,
        daoyuanName: null,
        intakeDate: null,
        endDate: null,
        interviewNumber: null,
        offerNumber: null,
        obtainStatus: null,
        obtainDate: null,
        obtainCity: null,
        enterpriseName: null,
        postName: null,
        companyAddress: null,
        probationSalary: null,
        obtainSalary: null,
        isfirsttierCity: null,
        nature: null,
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
      this.queryParams.obtainSalaryHigh = null;
      this.queryParams.intakeDateRange = [];
      this.queryParams.endDateRange = [];
      this.queryParams.obtainDateRange = [];
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.obtainFinalId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生就业信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const obtainFinalId = row.obtainFinalId || this.ids
      getFinal(obtainFinalId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生就业信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.obtainFinalId != null) {
            updateFinal(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinal(this.form).then(response => {
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
      const obtainFinalIds = row.obtainFinalId || this.ids;
      this.$modal.confirm('是否确认删除学生就业信息编号为"' + obtainFinalIds + '"的数据项？').then(function() {
        return delFinal(obtainFinalIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/final/export', {
        ...this.queryParams
      }, `final_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
