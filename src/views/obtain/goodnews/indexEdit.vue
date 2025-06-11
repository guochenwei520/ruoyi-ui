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

      <el-form-item label="所属班级">
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectQueryRemind()">
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学生姓名" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入学生姓名"
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
          v-hasPermi="['obtain:goodnews:add']"
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
          v-hasPermi="['obtain:goodnews:edit']"
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
          v-hasPermi="['obtain:goodnews:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="goback"
        >返回</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="goodnewsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="喜报" align="center" prop="goodnewsPath" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.goodnewsPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" prop="deptName" />
      <el-table-column label="班级" align="center" prop="roomName" />
      <el-table-column label="市场部" align="center" prop="marketName" />
      <el-table-column label="学生姓名" align="center" prop="studentName" />
      <el-table-column label="学生工资" align="center" prop="obtainSalary" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:goodnews:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:goodnews:remove']"
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

    <!-- 添加或修改就业喜报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :before-close="cancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
          <el-col :span="12">
            <strong v-if="!show" >当前选择学生为:{{form.deptName}}-{{form.roomName}}-{{form.studentName}}</strong>

            <el-form-item label="所属学院" prop="deptId" v-if="show">
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
              </el-col>
              <el-col :span="12">
            <el-form-item label="所属班级" prop="roomId" v-if="show">
              <el-select v-model="form.roomId" placeholder="请选择所属班级"  @click.native="selectRemind()">
                <el-option
                  v-for="item in roomOptions"
                  :key="item.roomId"
                  :label="item.roomName"
                  :value="item.roomId"
                  @click.native="getSelectStuByRoomId(item.roomId)"
                ></el-option>
              </el-select>
            </el-form-item>

          </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学生名称" prop="studentId" v-if="show">
                <el-select v-model="form.studentId" placeholder="请选择学生名称"  @click.native="selectStuRemind()">
                  <el-option
                    v-for="item in stuOptions"
                    :key="item.studentId"
                    :label="item.studentName"
                    :value="item.studentId"
                  ></el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="请选择喜报上传" prop="goodnewsPath">
              <image-upload v-model="form.goodnewsPath"/>
            </el-form-item>

            </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGoodnews, getGoodnews, delGoodnews, addGoodnews, updateGoodnews } from "@/api/obtain/goodnews";
import {getSelectCollege, getSelectRoomBydeptId,getSelectStuByRoomId} from "@/api/obtain/student";
import {getSelectRoom} from "@/api/obtain/room";

export default {
  name: "Goodnews",
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
      //是否显示
      show: true,
      // 总条数
      total: 0,
      // 就业喜报表格数据
      goodnewsList: [],
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      //学生下拉
      stuOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentId: null,
        studentName: null,
        collegeId: null,
        roomId: null,
        deptId: null
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        goodnewsPath: [
          { required: true, message: "上传喜报不能为空", trigger: "blur" }
        ],
        studentId: [
          { required: true, message: "学生外键不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getSelectCollege(); //学院
  },
  methods: {
    /** 查询就业喜报列表 */
    getList() {
      this.loading = true;
      listGoodnews(this.queryParams).then(response => {
        this.goodnewsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    //查询学院选择判断
    selectQueryRemind(){
      if(this.queryParams.deptId==null){
        this.$modal.msgError("请先选择学院");
      }
    },
    //添加学院选择判断
    selectRemind(){
      if(this.form.deptId==null){
        this.$modal.msgError("请先选择学院");
      }
    },
    //添加班级选择判断
    selectStuRemind(){
      if(this.form.roomId==null){
        this.$modal.msgError("请先选择班级");
      }
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
    /*根据班级筛选学生*/
    getSelectStuByRoomId(roomId){
      console.log("班级信息加载完成，请求学生信息")
      this.$set(this.form, 'studentId', null);
      this.$set(this.queryParams, 'studentId', null);
      getSelectStuByRoomId(roomId).then(response => {
        this.stuOptions = response.data;
      });
    },
    getSelectRoom(){
      getSelectRoom().then(response=>{
        this.roomOptions = response.rooms;
      })
    },
    goback() {
      this.$router.go(-1);
      /*this.$router.push({
        path:'/order',
        query:{
        }
      })*/
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      //清空三级联动下拉
      this.roomOptions.splice(0, this.roomOptions.length);
      this.stuOptions.splice(0, this.stuOptions.length);
    },
    // 表单重置
    reset() {
      this.form = {
        goodnewsId: null,
        goodnewsPath: null,
        studentId: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null,
        roomId: null,
        deptId: null
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
      this.ids = selection.map(item => item.goodnewsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.show=true;
      this.open = true;
      this.title = "添加就业喜报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.show=false;
      const goodnewsId = row.goodnewsId || this.ids
      getGoodnews(goodnewsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改就业喜报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.goodnewsId != null) {
            updateGoodnews(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoodnews(this.form).then(response => {
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
      const goodnewsIds = row.goodnewsId || this.ids;
      this.$modal.confirm('是否确认删除就业喜报编号为"' + goodnewsIds + '"的数据项？').then(function() {
        return delGoodnews(goodnewsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/goodnews/export', {
        ...this.queryParams
      }, `goodnews_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

