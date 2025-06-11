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
      <el-form-item label="技术类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择技术类型" clearable>
          <el-option
            v-for="dict in dict.type.t_order_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择工单状态" clearable>
          <el-option
            v-for="dict in dict.type.t_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提问人" prop="presenter">
        <el-input
          v-model="queryParams.presenter"
          placeholder="请输入提问人"
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
          v-hasPermi="['obtain:order:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obtain:order:edit']"
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
          v-hasPermi="['obtain:order:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="orderTitle" />
      <el-table-column label="技术类型" align="center" prop="orderType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column>
      <el-table-column label="工单状态" align="center" prop="orderStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.t_order_status" :value="scope.row.orderStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="提问人" align="center" prop="presenter" />
      <el-table-column label="发布时间" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-hasPermi="['obtain:order:detail']">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-hasPermi="['obtain:order:detail']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.orderStatus==0"
            v-hasPermi="['obtain:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.orderStatus==0"
            v-hasPermi="['obtain:order:remove']"
          >撤销</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRecommend(scope.row,1)"
            v-if="scope.row.orderRecommend==0"
            v-hasPermi="['obtain:order:recommend']"
          >推荐</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRecommend(scope.row,0)"
            v-if="scope.row.orderRecommend==1"
            v-hasPermi="['obtain:order:unrecommend']"
          >撤销推荐</el-button>
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

    <!-- 添加或修改工单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="提问问题" prop="orderTitle">
          <el-input type="textarea" v-model="form.orderTitle" placeholder="请输入标题"  show-word-limit  maxlength="200"/>
        </el-form-item>
        <el-form-item label="技术类型" prop="orderType">
          <el-select v-model="form.orderType" placeholder="请选择技术类型">
            <el-option
              v-for="dict in dict.type.t_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="工单状态" prop="orderStatus">
          <el-radio-group v-model="form.orderStatus">
            <el-radio
              v-for="dict in dict.type.t_order_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="图文描述上传" prop="screenshot">
          <image-upload v-model="form.screenshot"/>
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder,updateRecommend } from "@/api/obtain/order";
import order_upload from "@/views/obtain/order/order_upload.vue";
import {getSelectCollege, getSelectRoomBydeptId} from "@/api/obtain/student";
import {getSelectRoom} from "@/api/obtain/room";

export default {
  name: "Order",
  components: {
    order_upload
  },
  dicts: ['t_order_status', 't_order_type', 't_status'],
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
      // 工单管理表格数据
      orderList: [],
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      // 弹出层标题
      title: "",
      processTitle:"",
      // 是否显示弹出层
      open: false,
      processOpen:false,
      showButton:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderType: null,
        orderStatus: null,
        presenter: null,
        orderRecommend: null
      },
      // 表单参数
      form: {},
      processForm:{
        orderStatus: 1,
        orderDesc:'',
        remark:''
      },
      processRules:{

      },
      // 表单校验
      rules: {
        orderTitle: [
          { required: true, message: "提问问题不能为空", trigger: "change" },
          { min: 2, max: 200, message: '标题长度必须介于 2 和 200 之间', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: "工单类型不能为空", trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    // 刷新
    this.getList();
    this.getSelectCollege(); //学院
  },
  watch: {
    $route(to, from) {
      window.location.reload(); //监测到路由发生跳转时刷新一次页面
    },
  },
  methods: {
    /** 查询工单管理列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        orderId: null,
        orderTitle: null,
        orderDesc: null,
        orderType: null,
        orderStatus: 0,
        orderRecommend: 0,
        presenter: null,
        presenterPhone: null,
        publisher: null,
        releaseTime: null,
        screenshot: null,
        status: 0,
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
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.roomOptions=[];
      this.open = true;
      this.title = "添加工单管理";
    },
    handleDetail(row){
      const orderId = row.orderId;
      this.$router.push({
        path: '/orders/detail',
        query: {
          orderId: orderId
        }
      })
    },
    handleRecommend(row,index){
      updateRecommend(row.orderId,index).then(response=>{
        this.getList();
        this.$modal.msgSuccess("操作成功");
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.orderId || this.ids
      getOrder(orderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工单管理";
      });
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
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
    getSelectRoom(){
      getSelectRoom().then(response=>{
        this.roomOptions = response.rooms;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orderId != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      const orderIds = row.orderId || this.ids;
      this.$modal.confirm('是否确认撤销工单管理编号为"' + orderIds + '"的数据项？').then(function() {
        return delOrder(orderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("撤销成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('obtain/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
