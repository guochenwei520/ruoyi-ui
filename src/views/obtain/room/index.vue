<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--        <el-form-item label="所属学院" prop="deptId" label-width="68px">
          <el-select v-model="queryParams.deptId" placeholder="请选择所属学院"  >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              @click.native="getSelectTeacherBydeptId(item.deptId)"
            ></el-option>
          </el-select>
        </el-form-item>-->
      <el-form-item label="班级名称" prop="roomName">
        <el-input
          v-model="queryParams.roomName"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

<!--        <el-form-item label="所属学院">
          <el-select v-model="queryParams.collegeId" placeholder="请选择所属学院">
            <el-option
              v-for="item in collegeOptions"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId"
              @keyup.enter.native="handleQuery"
            ></el-option>
          </el-select>
        </el-form-item>-->
<!--      <el-form-item label="项目经理">
        <el-select v-model="queryParams.teacherId" placeholder="请选择项目经理">
          <el-option
            v-for="item in teacherOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就业指导">
        <el-select v-model="queryParams.daoyuanId" placeholder="请选择就业指导">
          <el-option
            v-for="item in daoyuanOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>-->
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
          v-hasPermi="['obtain:room:add']"
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
          v-hasPermi="['obtain:room:edit']"
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
          v-hasPermi="['obtain:room:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:room:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属学院" align="center" prop="sysDept.deptName" />
      <el-table-column label="班级名称" align="center" prop="roomName" />
      <el-table-column label="班级讲师" align="center" prop="sysUsert.nickName" />
      <el-table-column label="就业指导" align="center" prop="sysUserd.daoyuanName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="实训结束时间" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" ></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:room:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:room:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:room:remove']"
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

    <!-- 添加或修改班级管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班级名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入班级名称" />
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
        <el-form-item label="所属学院" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属学院"  >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              @click.native="getSelectTeacherBydeptId(item.deptId)"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="项目经理"  prop="teacherId">
            <el-select v-model="form.teacherId" placeholder="请选择项目经理">
              <el-option
                v-for="item in teacherOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="就业指导" prop="daoyuanId">
            <el-select v-model="form.daoyuanId" placeholder="请选择就业指导">
              <el-option
                v-for="item in daoyuanOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>

        <el-form-item label="实训开始时间" prop="beginDate">
          <el-date-picker clearable
            v-model="form.beginDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerEffective"
            placeholder="请选择实训开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实训结束时间" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerInvalid"
            placeholder="请选择实训结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入描述"  show-word-limit  maxlength="200"/>
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
import { listRoom, getRoom, delRoom, addRoom, updateRoom,getSelectTeacherByDeptId } from "@/api/obtain/room";

import {getSelectCollege} from "@/api/obtain/student";

export default {
  name: "Room",
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
      // 班级管理表格数据
      roomList: [],
      // 学院树树选项
      deptOptions:[],
      // 学院树选项
      collegeOptions: [],
      // 项目经理树选项
      teacherOptions: [],
      // 就业指导树选项
      daoyuanOptions: [],
      pickerEffective:'',
      pickerInvalid:'',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roomName: null,
        collegeId: null,
        teacherId: null,
        deptId:null,
        daoyuanId: null,
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        roomName: [
          { required: true, message: "班级名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '班级名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        deptId:[
          {required: true, message: "所属学院不能为空", trigger: "blur"}
        ],
        beginDate:[
          {required: true, message: "实训结束时间不能为空", trigger: "blur"}
        ],
        endDate:[
          {required: true, message: "实训结束时间不能为空", trigger: "blur"}
        ],
        teacherId:[
          {required: true, message: "项目经理不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getSelectCollege();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
/*  watch: {
    $route(to, from) {
      window.location.reload(); //监测到路由发生跳转时刷新一次页面
    },
  },*/
  mounted() {
    this.pickerEffective = this.effectiveDate()
    this.pickerInvalid = this.invalidDate()
  },
  methods: {
    /** 查询班级管理列表 */
    getList() {
      this.loading = true;
      listRoom(this.queryParams).then(response => {
        this.roomList = response.rows;
        console.log(this.roomList)
        this.total = response.total;
        this.loading = false;
      });
    },
    /*根据学院筛选班级*/
    getSelectTeacherBydeptId(deptId){
      if(deptId!=null){
      console.log("学院信息加载完成，请求项目经理信息")
      this.$set(this.form, 'teacherId', null);
      this.$set(this.form, 'daoyuanId', null);
      this.$set(this.queryParams, 'teacherId', null);
      this.$set(this.queryParams, 'daoyuanId', null);
      getSelectTeacherByDeptId(deptId).then(response => {
        this.teacherOptions = response.data.teachers;
        this.daoyuanOptions = response.data.daoyuans;
      });
      }
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    /*获取项目经理登录角色*/
   /* getQueryStuRoles(){
      let roles=this.$store.state.user.roles;
      if(roles.includes('marketing')){
        this.userroleShow=false;
      }
    },*/
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        roomId: '',
        roomName:  '',
        status: 0,
        teacherId:'',
        daoyuanId:'',
        beginDate:  '',
        endDate:  '',
        createBy: '',
        updateBy: '',
        createTime: '',
        updateTime: '',
        remark: ''
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
      this.ids = selection.map(item => item.roomId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getSelectCollege();
      this.open = true;
      this.title = "添加班级管理";
    },

    // 失效日期大于生效日期
    effectiveDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.form.endDate) {
            return new Date(self.form.endDate).getTime() < time.getTime()
          }
        }
      }
    },
    // 失效日期大于生效日期
    invalidDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.form.beginDate) {
            return new Date(self.form.beginDate).getTime() > time.getTime()
          }
        }
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getSelectCollege();
      const roomId = row.roomId || this.ids
      getRoom(roomId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级管理";
        getSelectTeacherByDeptId(this.form.deptId).then(response => {
          this.teacherOptions = response.data.teachers;
          this.daoyuanOptions = response.data.daoyuans;
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roomId != null) {
            updateRoom(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRoom(this.form).then(response => {
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
      const roomIds = row.roomId || this.ids;
      this.$modal.confirm('是否确认删除班级管理编号为"' + roomIds + '"的数据项？').then(function() {
        return delRoom(roomIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
        if (confirm("您确定要导出班级数据么?")){
          this.download('obtain/room/export', {
            ...this.queryParams
          }, `room_${new Date().getTime()}.xlsx`)
          console.log("----------------1")
        }
    }
  }
};
</script>
