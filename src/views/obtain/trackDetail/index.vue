<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="就业时间" prop="obtainTime">
        <el-date-picker clearable
          v-model="queryParams.obtainTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择就业时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="面试录音" prop="interviewRecording">
        <el-input
          v-model="queryParams.interviewRecording"
          placeholder="请输入面试录音"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="跟踪回访电话录音" prop="followUpRecording">
        <el-input
          v-model="queryParams.followUpRecording"
          placeholder="请输入跟踪回访电话录音"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简历投递数" prop="submittedNumber">
        <el-input
          v-model="queryParams.submittedNumber"
          placeholder="请输入简历投递数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司邀约数" prop="invitationNumber">
        <el-input
          v-model="queryParams.invitationNumber"
          placeholder="请输入公司邀约数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="面试量" prop="interviewVolume">
        <el-input
          v-model="queryParams.interviewVolume"
          placeholder="请输入面试量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="面试次数" prop="interviewNumber">
        <el-input
          v-model="queryParams.interviewNumber"
          placeholder="请输入面试次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="offer数" prop="offerNumber">
        <el-input
          v-model="queryParams.offerNumber"
          placeholder="请输入offer数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就业考核阶段" prop="obtainStatusA">
        <el-input
          v-model="queryParams.obtainStatusA"
          placeholder="请输入就业考核阶段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就业状态是否已就业" prop="obtainStatusB">
        <el-input
          v-model="queryParams.obtainStatusB"
          placeholder="请输入就业状态是否已就业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就业状态以往返回" prop="obtainStatusC">
        <el-input
          v-model="queryParams.obtainStatusC"
          placeholder="请输入就业状态以往返回"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就业城市" prop="obtainCity">
        <el-input
          v-model="queryParams.obtainCity"
          placeholder="请输入就业城市"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试用薪资" prop="probationSalary">
        <el-input
          v-model="queryParams.probationSalary"
          placeholder="请输入试用薪资"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就业薪资" prop="obtainSalary">
        <el-input
          v-model="queryParams.obtainSalary"
          placeholder="请输入就业薪资"
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
          v-hasPermi="['obtain:trackDetail:add']"
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
          v-hasPermi="['obtain:trackDetail:edit']"
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
          v-hasPermi="['obtain:trackDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:trackDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trackDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学员就业状态明细编号" align="center" prop="trackDetailId" />
      <el-table-column label="学员外键" align="center" prop="stuId" />
      <el-table-column label="就业企业外键" align="center" prop="enterpriseId" />
      <el-table-column label="就业岗位名称外键" align="center" prop="postId" />
      <el-table-column label="就业时间" align="center" prop="obtainTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.obtainTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面试录音" align="center" prop="interviewRecording" />
      <el-table-column label="跟踪回访电话录音" align="center" prop="followUpRecording" />
      <el-table-column label="简历投递数" align="center" prop="submittedNumber" />
      <el-table-column label="公司邀约数" align="center" prop="invitationNumber" />
      <el-table-column label="面试量" align="center" prop="interviewVolume" />
      <el-table-column label="面试次数" align="center" prop="interviewNumber" />
      <el-table-column label="offer数" align="center" prop="offerNumber" />
      <el-table-column label="就业考核阶段" align="center" prop="obtainStatusA" />
      <el-table-column label="就业状态是否已就业" align="center" prop="obtainStatusB" />
      <el-table-column label="就业状态以往返回" align="center" prop="obtainStatusC" />
      <el-table-column label="就业城市" align="center" prop="obtainCity" />
      <el-table-column label="试用薪资" align="center" prop="probationSalary" />
      <el-table-column label="就业薪资" align="center" prop="obtainSalary" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:trackDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:trackDetail:remove']"
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

    <!-- 添加或修改跟踪记录明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="就业时间" prop="obtainTime">
          <el-date-picker clearable
            v-model="form.obtainTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择就业时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面试录音" prop="interviewRecording">
          <el-input v-model="form.interviewRecording" placeholder="请输入面试录音" />
        </el-form-item>
        <el-form-item label="跟踪回访电话录音" prop="followUpRecording">
          <el-input v-model="form.followUpRecording" placeholder="请输入跟踪回访电话录音" />
        </el-form-item>
        <el-form-item label="简历投递数" prop="submittedNumber">
          <el-input v-model="form.submittedNumber" placeholder="请输入简历投递数" />
        </el-form-item>
        <el-form-item label="公司邀约数" prop="invitationNumber">
          <el-input v-model="form.invitationNumber" placeholder="请输入公司邀约数" />
        </el-form-item>
        <el-form-item label="面试量" prop="interviewVolume">
          <el-input v-model="form.interviewVolume" placeholder="请输入面试量" />
        </el-form-item>
        <el-form-item label="面试次数" prop="interviewNumber">
          <el-input v-model="form.interviewNumber" placeholder="请输入面试次数" />
        </el-form-item>
        <el-form-item label="offer数" prop="offerNumber">
          <el-input v-model="form.offerNumber" placeholder="请输入offer数" />
        </el-form-item>
        <el-form-item label="就业考核阶段" prop="obtainStatusA">
          <el-input v-model="form.obtainStatusA" placeholder="请输入就业考核阶段" />
        </el-form-item>
        <el-form-item label="就业状态是否已就业" prop="obtainStatusB">
          <el-input v-model="form.obtainStatusB" placeholder="请输入就业状态是否已就业" />
        </el-form-item>
        <el-form-item label="就业状态以往返回" prop="obtainStatusC">
          <el-input v-model="form.obtainStatusC" placeholder="请输入就业状态以往返回" />
        </el-form-item>
        <el-form-item label="就业城市" prop="obtainCity">
          <el-input v-model="form.obtainCity" placeholder="请输入就业城市" />
        </el-form-item>
        <el-form-item label="试用薪资" prop="probationSalary">
          <el-input v-model="form.probationSalary" placeholder="请输入试用薪资" />
        </el-form-item>
        <el-form-item label="就业薪资" prop="obtainSalary">
          <el-input v-model="form.obtainSalary" placeholder="请输入就业薪资" />
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
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
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
import { listTrackDetail, getTrackDetail, delTrackDetail, addTrackDetail, updateTrackDetail } from "@/api/obtain/trackDetail";

export default {
  name: "TrackDetail",
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
      // 跟踪记录明细表格数据
      trackDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: null,
        enterpriseId: null,
        postId: null,
        obtainTime: null,
        interviewRecording: null,
        followUpRecording: null,
        submittedNumber: null,
        invitationNumber: null,
        interviewVolume: null,
        interviewNumber: null,
        offerNumber: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        obtainCity: null,
        probationSalary: null,
        obtainSalary: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stuId: [
          { required: true, message: "学员外键不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跟踪记录明细列表 */
    getList() {
      this.loading = true;
      listTrackDetail(this.queryParams).then(response => {
        this.trackDetailList = response.rows;
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
        trackDetailId: null,
        stuId: null,
        enterpriseId: null,
        postId: null,
        obtainTime: null,
        interviewRecording: null,
        followUpRecording: null,
        submittedNumber: null,
        invitationNumber: null,
        interviewVolume: null,
        interviewNumber: null,
        offerNumber: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        obtainCity: null,
        probationSalary: null,
        obtainSalary: null,
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
      this.ids = selection.map(item => item.trackDetailId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加跟踪记录明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const trackDetailId = row.trackDetailId || this.ids
      getTrackDetail(trackDetailId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改跟踪记录明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.trackDetailId != null) {
            updateTrackDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrackDetail(this.form).then(response => {
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
      const trackDetailIds = row.trackDetailId || this.ids;
      this.$modal.confirm('是否确认删除跟踪记录明细编号为"' + trackDetailIds + '"的数据项？').then(function() {
        return delTrackDetail(trackDetailIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/trackDetail/export', {
        ...this.queryParams
      }, `trackDetail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
