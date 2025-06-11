<template>
  <div class="app-container" >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <span style="font-weight:bold;">{{article.articleTitle}}</span>
      <br><br>
      <span style="color: #808585">
        创建人:{{article.createBy}} 创建时间:{{article.createTime}}
       </span><br><hr>
      <span style="font-weight:bold;">详情:</span><span style="color: #6b6c6b;" v-html="article.articleContent"></span>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
  import {getArticle, getArticleTypes } from "@/api/obtain/article";
  export default {
    name: "article_detail",
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
        articleId:null,
        article:null
      }
    },
    created() {
      this.articleId=this.$route.query.articleId;
      this.handleUpdate(this.articleId);
    },
    methods: {
      // 取消按钮
      cancel() {
        this.$router.go(-1);
      },
      /** 回显数据 */
      handleUpdate(articleId) {
        getArticle(articleId).then(response => {
          this.article = response.data;
          this.title = "资讯详情";
        });
      }
    }
  }
</script>

<style scoped>

</style>
