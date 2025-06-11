<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <span style="font-weight:bold;">{{form.topicName}}</span>
      <br><br>
      <span style="color: #808585">
        所属学院:{{form.deptName}}  创建人:{{form.createBy}} 创建时间:{{form.createTime}}  点赞:{{form.likeNumber}}  收藏:{{form.collectNumber}}
       </span><br><hr>
      <span style="font-weight:bold;">解题思路:</span><span style="color: #6b6c6b;">{{form.ideaContent}}</span>
        <br>
      <hr>

      <span style="font-weight:bold;">
        答案1:
         </span><span style="color: #2b332f;" v-html="form.scriptCases"></span>
        <br>
      <span style="font-weight:bold;">
        答案2:
         </span><span style="color: #2b332f;" v-html="form.scriptCasess"></span>
      <br>
      <hr>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-tooltip content="点赞" effect="dark" placement="bottom">
      <el-button
        type="primary"
        @click="submitLike"
        icon="el-icon-thumb"
        circle
        v-if="isLike==0"
      ></el-button>
      </el-tooltip>
        <el-tooltip content="点赞" effect="dark" placement="bottom">
          <el-button
            type="danger"
            @click="submitLike"
            icon="el-icon-thumb"
            circle
            v-if="isLike==1"
          ></el-button>
        </el-tooltip>
      <el-tooltip content="收藏" effect="dark" placement="bottom">
      <el-button
        type="primary"
        @click="submitCollect"
        icon="el-icon-star-off"
        circle
        v-if="isCollect==0"
      ></el-button>
      </el-tooltip>
      <el-tooltip content="收藏" effect="dark" placement="bottom">
      <el-button
        type="danger"
        @click="submitCollect"
        icon="el-icon-star-on"
        circle
        v-if="isCollect==1"
      ></el-button>
      </el-tooltip>
      <el-button @click="cancel">返回</el-button>
    </div>

  </div>
</template>

<script>
import { getIsLike, getBank, updateBankLikeNumber, updateBankCollectNumber, getIsCollect } from "@/api/obtain/bank";

export default {
  name: "detail",
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
      isLike:0,
      isCollect:0,
      form: {
        topicId: null,
        deptId: null,
        deptName: null,
        topicName: null,
        ideaContent: null,
        scriptCases: null,
        collectNumber: null,
        likeNumber: null,
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
    this.topicId=this.$route.query.topicId;
    this.handleUpdate(this.topicId);

  },
  methods: {
    // 取消按钮
    cancel() {
      this.$router.go(-1);
    },
    getIsLike(topicId) {
      getIsLike(topicId).then(response => {
        this.isLike = response.data.isLikes;
        console.log(response.data.isLikes)
      });
    },
    getIsCollect(topicId) {
      getIsCollect(topicId).then(response => {
        this.isCollect = response.data.isCollects;
      });
    },
    cancelProcess(){
      this.processOpen=false;
      this.resetProcess();
    },

    resetProcess(){
      this.processForm={
        topicId: null,
        deptId: null,
        deptName: null,
        topicName: null,
        ideaContent: null,
        scriptCases: null,
        collectNumber: null,
        likeNumber: null,
        status: 0,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      }
    },
    /** 回显数据 */
    handleUpdate(topicId) {
      getBank(topicId).then(response => {
        this.form = response.data;
        this.title = "面试题详情";
        /*获取是否点赞收藏*/
        this.getIsLike(this.topicId);
        this.getIsCollect(this.topicId);
      });
    },

    /** 点赞按钮 */
    submitLike() {
      console.log(this.form.topicId)
      if (this.form.topicId != null) {
        updateBankLikeNumber(this.form.topicId).then(response => {
          this.$modal.msgSuccess("点赞+1");
          this.handleUpdate(this.form.topicId);
        });
      }

    },
    /** 收藏按钮 */
    submitCollect() {
      console.log(this.form.topicId)
      if (this.form.topicId != null) {
        updateBankCollectNumber(this.form.topicId).then(response => {
          this.$modal.msgSuccess("已收藏");
          this.handleUpdate(this.form.topicId);
        });
      }

    }
  }
}
</script>

<style scoped>

</style>
