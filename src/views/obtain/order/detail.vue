<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <div style="font-size: 20px;color: #626765;display: flex;">
        <div  v-if="form.orderStatus==0">待处理</div>
        <div  v-if="form.orderStatus==1">处理中</div>
        <div  v-if="form.orderStatus==2">已完结</div>  |  <div>{{form.orderTitle}}</div>
       <div align="right"><el-button
         size="20px"
         type="text"
         icon="el-icon-edit"
         @click="handleProcess()"
         v-hasPermi="['obtain:order:process']"
         v-if="form.orderStatus!=2"
       >处理</el-button></div>
      </div><br>
      <span style="color: #808585">
        {{form.presenter}}  {{form.presenterPhone}}
        <span  v-if="form.orderType==0">技术类</span>
        <span  v-if="form.orderType==1">面试类</span>
        <span  v-if="form.orderType==2">职场类</span>
        <span  v-if="form.orderType==3">其他</span>
        {{form.releaseTime}}</span><br>
      <span style="display: flex;">
        <span style="color: #0000ff;">问题描述:
            <span style="color: #474948;" v-html="form.remark"></span>
        </span></span><br>
      <hr>
      <order_img v-model="form.screenshot" disabled="disabled"/>
    </el-form>
    <hr>
    <span style="color: #0000ff">
      处理结果：<span style="color: #474948;" v-html="form.orderDesc"></span>
    </span>
    <hr>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitForm"
        v-hasPermi="['obtain:order:over']"
      >完结</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
    <!-- 工单处理对话框 -->
    <el-dialog :title="processTitle" :visible.sync="processOpen" width="500px" append-to-body>
      <el-form ref="processForm" :model="processForm" :rules="processRules" label-width="120px">
        <el-input type="hidden" v-model="processForm.orderStatus" ></el-input>
        <el-form-item label="处理描述" prop="orderDesc">
          <editor v-model="processForm.orderDesc" :min-height="192"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProcessForm">确 定</el-button>
        <el-button @click="cancelProcess">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import order_img from "@/views/obtain/order/order_img.vue";
import {addOrder, getOrder, listOrder, updateOrder,updateProcessOrder} from "@/api/obtain/order";

export default {
  name: "detail",
  components: {
    order_img
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
      // 弹出层标题
      title: "",
      processTitle:"",
      showButton:false,
      // 是否显示弹出层
      open: false,
      processOpen:false,
      orderId:0,
      form: {
        orderId: null,
        orderTitle: null,
        orderType: null,
        orderStatus: 0,
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
      },
      processForm:{
        orderStatus: 1,
        orderDesc:'',
        remark:''
      },
      rules:{},
      processRules:{}

    }
  },
  created() {
    this.orderId=this.$route.query.orderId;
    this.handleUpdate(this.orderId);
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$router.go(-1);
      /*this.$router.push({
        path:'/order',
        query:{
        }
      })*/
    },

    cancelProcess(){
      this.processOpen=false;
      this.resetProcess();
    },

    resetProcess(){
      this.processForm={
        orderId: null,
        orderTitle: null,
        orderDesc: null,
        orderType: null,
        orderStatus: 1,
        presenter: null,
        presenterPhone: null,
        publisher: null,
        releaseTime: null,
        screenshot: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      }
    },
    /** 回显数据 */
    handleUpdate(orderId) {
      getOrder(orderId).then(response => {
        this.form = response.data;
        this.title = "工单详情查看";
      });
    },
    /** 处理按钮操作 */
    handleProcess() {
      const orderId = this.orderId
      getOrder(orderId).then(response => {
        this.processForm = response.data;
        this.processOpen = true;
        this.processTitle = "工单处理";
      });
    },
    submitProcessForm(){
      if (this.processForm.orderId != null) {
        this.processForm.orderStatus=1;
        updateProcessOrder(this.processForm).then(response => {
          this.$modal.msgSuccess("处理成功，待确认！");
          this.processOpen = false;
          this.handleUpdate(this.orderId);
        });
      }
    },
    /** 完结按钮 */
    submitForm() {
      console.log(this.form.orderId)
      if (this.form.orderId != null) {
        this.processForm.orderId=this.form.orderId;
        this.processForm.orderStatus=2;
        updateOrder(this.processForm).then(response => {
          this.$modal.msgSuccess("确认完结!");
          this.cancel();
        });
      }

    }
  }
}
</script>

<style scoped>

</style>
