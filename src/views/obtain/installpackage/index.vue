<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:installpackage:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="installpackageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="安装包版本号" align="center" prop="installpackageName" />
      <el-table-column label="是否停用" align="center" prop="isStop">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.isStop"/>
        </template>
      </el-table-column>
      <el-table-column label="是否强制更新" align="center" prop="isForce">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.isForce"/>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isStop==0" style="color: red"
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:installpackage:edit']"
          >
            停用
          </el-button>

          <el-button v-if="scope.row.isStop==1" style="color: green"
                     size="mini"
                     type="text"
                     icon="el-icon-check"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['obtain:installpackage:edit']"
          >
            启用
          </el-button>
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

    <!-- 添加或修改手机端管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="this.title == '添加手机端管理'" label="安装包版本号" prop="installpackageName">
          <el-input v-model="form.installpackageName" placeholder="请输入安装包版本号" />
        </el-form-item>
        <el-form-item v-if="this.title == '添加手机端管理'" label="安装包路径" prop="installpackagePath">
          <installpackage_upload v-model="form.installpackagePath"/>
        </el-form-item>
        <el-form-item v-if="this.title == '修改手机端管理'" label="是否停用" prop="isStop">
          <el-radio-group v-model="form.isStop">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
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
import { listInstallpackage, getInstallpackage, delInstallpackage, addInstallpackage, updateInstallpackage } from "@/api/obtain/installpackage";
import installpackage_upload from "@/views/obtain/installpackage/installpackage_upload.vue";
export default {
  name: "Installpackage",
  components: {
    installpackage_upload
  },
  dicts: ['sys_normal_disable'],
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
      // 手机端管理表格数据
      installpackageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        installpackageName: [
          { required: true, message: "安装包版本号不能为空", trigger: "blur" }
        ],
        installpackagePath: [
          { required: true, message: "安装包路径不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询手机端管理列表 */
    getList() {
      this.loading = true;
      listInstallpackage(this.queryParams).then(response => {
        this.installpackageList = response.data;
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
        installpackageId: null,
        installpackageName: null,
        installpackagePath: null,
        isStop: null,
        isForce: null,
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
      this.ids = selection.map(item => item.installpackageId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加手机端管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const installpackageId = row.installpackageId || this.ids
      getInstallpackage(installpackageId).then(response => {
        this.form = response.data;
        if(confirm("确定要" + this.form.isStop==0?"停用":"启用" + "此版本吗？")){
          updateInstallpackage(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
            addInstallpackage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const installpackageIds = row.installpackageId || this.ids;
      this.$modal.confirm('是否确认删除手机端管理编号为"' + installpackageIds + '"的数据项？').then(function() {
        return delInstallpackage(installpackageIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/installpackage/export', {
        ...this.queryParams
      }, `installpackage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
