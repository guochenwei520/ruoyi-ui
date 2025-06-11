<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属学院" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择所属学院"  >
          <el-option
            v-for="item in deptOptions"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
            @click.native="getSelectRoomBydeptId(item.deptId)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级" prop="roomId">
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="sendName">
        <el-input
          v-model="queryParams.sendName"
          placeholder="请输入发布人"
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
          v-hasPermi="['obtain:project:add']"
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
          v-hasPermi="['obtain:project:edit']"
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
          v-hasPermi="['obtain:project:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:project:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目类型" align="center" prop="projectType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_project_type" :value="scope.row.projectType"/>
        </template>
      </el-table-column>
      <el-table-column label="所属学院" align="center" prop="deptName" />
      <el-table-column label="所属班级" align="center" prop="roomName" />
      <el-table-column label="发布人" align="center" prop="sendName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" v-hasPermi="['obtain:project:edit']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleShowDetail(scope.row)"
            v-hasPermi="['obtain:project:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:project:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:project:remove']"
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

    <!-- 添加或修改项目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="form.projectType" placeholder="请选择项目类型">
            <el-option
              v-for="dict in dict.type.t_project_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属学院"  >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              @click.native="getSelectRoomBydeptId(item.deptId)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="roomId">
          <el-select v-model="form.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
            <el-option
              v-for="item in roomOptions"
              :key="item.roomId"
              :label="item.roomName"
              :value="item.roomId"
            ></el-option>
          </el-select>
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
<!--        <el-form-item label="发布人" prop="sendName">
          <el-input v-model="form.sendName" placeholder="请输入发布人" />
        </el-form-item>-->
        <el-form-item label="项目描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入项目描述" maxlength="200"
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
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/obtain/project";
import {getSelectCollege, getSelectRoomBydeptId} from "@/api/obtain/student";
import {getSelectRoom} from "@/api/obtain/room";

export default {
  name: "Project",
  dicts: ['t_status','t_project_type'],
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
      // 项目管理表格数据
      projectList: [],
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        roomId: null,
        sendName: null,

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属学院不能为空", trigger: "change" }
        ],
        roomId: [
          { required: true, message: "所属班级不能为空", trigger: "change" }
        ],
        projectType: [
          { required: true, message: "项目类型不能为空", trigger: "change" }
        ],
        sendName: [
          { required: true, message: "发布人不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getSelectCollege(); //学院
  },
  methods: {
    /** 查询项目管理列表 */
    getList() {
      this.loading = true;
      listProject(this.queryParams).then(response => {
        this.projectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    selectRemind(){
      if(this.roomOptions.length===0){
        this.$modal.msgError("请先选择学院");
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        projectId: null,
        projectName: null,
        projectType: null,
        deptId: null,
        roomId: null,
        status: 0,
        sendName: null,
        createTime:null,
        createBy:null,
        updateBy: null,
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
      this.ids = selection.map(item => item.projectId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getSelectCollege(); //学院
      this.roomOptions=[];
      this.open = true;
      this.title = "添加项目管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getSelectCollege(); //学院
      this.getSelectRoom();
      const projectId = row.projectId || this.ids
      getProject(projectId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目管理";
      });
    },
    /*根据学院筛选班级*/
    getSelectRoomBydeptId(deptId){
      console.log("学院信息加载完成，请求班级信息")
      this.$set(this.form, 'roomId', null);
      this.$set(this.queryParams, 'roomId', null);
      getSelectRoomBydeptId(deptId).then(response => {
        this.roomOptions = response.data.rooms;
      });
    },

    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    getSelectRoom(){
        getSelectRoom().then(response=>{
          this.roomOptions = response.rooms;
        })
    },
    /** 详情按钮操作 */
    handleShowDetail(row) {
      const projectId = row.projectId
      this.$router.push({
        path: '/projectDetail/index',
        query: {
          projectId: projectId
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.projectId != null) {
            updateProject(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProject(this.form).then(response => {
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
      const projectIds = row.projectId || this.ids;
      this.$modal.confirm('是否确认删除项目管理编号为"' + projectIds + '"的数据项？').then(function() {
        return delProject(projectIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/project/export', {
        ...this.queryParams
      }, `project_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
