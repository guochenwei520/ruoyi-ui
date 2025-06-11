<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属学院" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择所属学院"  clearable>
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
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectRemind()" clearable>
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学生姓名" prop="studentName" clearable>
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="市场部" prop="marketId">
        <el-select v-model="queryParams.marketId" placeholder="请选择所属市场部"  clearable>
          <el-option
            v-for="item in marketOptions"
            :key="item.marketId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="毕业时间" prop="endDate">
        <el-date-picker clearable
                        v-model="queryParams.endDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择毕业月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="showHandleQuery" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" v-show="showLoading" size="mini" :loading="loading">加载中</el-button>
        <!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
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
          v-hasPermi="['obtain:goodnews:goodnews']"
        >操作</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="" id="box">
      <ul>
        <li v-for="v in goodnewsList" :key="v.value">
          <image-preview :src="v.goodnewsPath" :width="100" :height="100"/>
          <h5>{{ v.studentName }}：{{v.obtainSalary}}元</h5>
          <!--          <img v-bind:src="v.goodnewsPath" alt="">-->
          <!--          <h4>{{v.des}}</h4>
                    <p>{{v.price}}</p>-->
        </li>
      </ul>
    </div>

    <!-- 添加或修改就业喜报对话框 -->
    <!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="喜报路径集合" prop="goodnewsPath">
              <image-upload v-model="form.goodnewsPath"/>
            </el-form-item>
            <el-form-item label="学生外键" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学生外键" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      style="margin-top: 530px"
    />
  </div>

</template>

<script>
import { listGoodnews, getGoodnews, delGoodnews, addGoodnews, updateGoodnews } from "@/api/obtain/goodnews";
import {getSelectCollege,getSelectMarket, getSelectRoomBydeptId} from "@/api/obtain/student";
import {getSelectRoom} from "@/api/obtain/room";

export default {
  name: "Goodnews",
  data() {
    return {
      showHandleQuery: true,
      showLoading: false,
      // 遮罩层
      loading: false,
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
      // 就业喜报表格数据
      goodnewsList: [],
      /*部门树*/
      deptOptions:[],
      /*市场部下拉*/
      marketOptions:[],
      //班级下拉
      roomOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30, //展示图片的行数
        studentId: null,
        studentName: null,
        collegeId: null,
        roomId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    this.getSelectCollege(); //学院
    this.getSelectMarket();//市场部
  },
  methods: {
    /** 查询就业喜报列表 */
    getList() {
      this.loading = true;
      this.showHandleQuery = false;
      this.showLoading = true;
      listGoodnews(this.queryParams).then(response => {
        this.goodnewsList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.showHandleQuery = true;
        this.showLoading = false;
      });
    },
    /*获取市场部下拉*/
    getSelectMarket(){
      getSelectMarket().then(response => {
        this.marketOptions= response.data.markets;
      });
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    selectRemind(){
      if(this.roomOptions.length===0){
        this.$modal.msgError("请先选择学院");
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
    getSelectRoom(){
      getSelectRoom().then(response=>{
        this.roomOptions = response.rooms;
      })
    },
    checkDeptIdSelected(){
      if(this.form.deptId==null){
        this.$modal.msgError("请先选择学院!");
      }
    },
    checkQDeptIdSelected(){
      if(this.queryParams.deptId==null){
        this.$modal.msgError("请先选择学院!");
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
        goodnewsId: null,
        goodnewsPath: null,
        studentId: null,
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
      this.ids = selection.map(item => item.goodnewsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      /*this.reset();
      this.open = true;
      this.title = "操作就业喜报";*/
      this.$router.push({
        path: '/goodnews_detail/goodnews_detail'
        /*query: {
          obtainStudentId: obtainStudentId
        }*/
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
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
<style scoped>
#box ul{
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 100px;
}
#box li{
  padding: 3px;
  list-style: none;
  margin-right: 10px;
  border: 1px solid #eee;
}
#box img{
  width: 200px;
  height: 150px;
}
.pagination{
  top: 1000px;
}

.mask-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
