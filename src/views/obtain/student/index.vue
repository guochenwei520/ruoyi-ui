<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="所属学院" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择所属学院" clearable>
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
        <el-select v-model="queryParams.roomId" placeholder="请选择所属班级" @click.native="selectRemind()">
          <el-option
            v-for="item in roomOptions"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学生姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <span v-if="userroleShow">
<!--      <el-form-item label="联系电话" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"

        />
      </el-form-item>-->
      <el-form-item label="考核状态" >
        <el-select v-model="queryParams.obtainStatusA"
                   placeholder="请选择考核状态"
                   @change="firstColumnChangeAction($event)"
                   :style="'width:100%;'">
          <el-option
            v-for="item in firstColumnList"
            :key="item.id"
            :label="item.statusName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就业状态" >
        <el-select v-model="queryParams.obtainStatusB"
                   placeholder="请选择就业状态"
                   value-key="id"
                   @change="secondColumnChangeAction($event)"
                   :style="'width:100%;'">
          <el-option
            v-for="item in secondColumnList"
            :key="item.id"
            :label="item.statusName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就业状态" >
        <el-select v-model="queryParams.obtainStatusC"
                   placeholder="请选择就业状态"
                   value-key="id"
                   :style="'width:100%;'">
          <el-option
            v-for="item in threeColumnList"
            :key="item.id"
            :label="item.statusName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

<!--      <el-form-item label="就业城市" prop="obtainCity">
        <el-input
          v-model="queryParams.obtainCity"
          placeholder="请输入就业城市"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="就业岗位" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入就业岗位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
        <el-form-item label="学生层次" prop="education">
       <el-input
         v-model="queryParams.education"
         placeholder="请输入学生层次"
         clearable
         @keyup.enter.native="handleQuery"
       />
        </el-form-item>
        </span>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obtain:student:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obtain:student:edit']"
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
          v-hasPermi="['obtain:student:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['obtain:student:import']"
        >导入</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportHistory"
          v-hasPermi="['obtain:student:importhistory']"
        >导入历史记录</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obtain:student:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="考核阶段" align="center" prop="statusNames" width="200" >
        <template slot-scope="scope">
             <div >{{scope.row.statusNames==''?'待填报':scope.row.statusNames}}</div>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" align="center" prop="stuName"/>
<!--
      <el-table-column label="所属学院" align="center" prop="deptName" width="110"/>
-->
      <el-table-column label="所属班级" align="center" prop="room.roomName"/>

      <el-table-column label="就业薪资" align="center" prop="obtainSalary"  />
      <el-table-column label="学生层次" align="center" prop="education"  />

      <el-table-column label="就业时间" align="center" prop="obtainTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.obtainTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场部" align="center" prop="market.marketName" />
      <el-table-column label="核实状态" align="center" prop="checkStatus" v-if="userroleShow">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.red_result" :value="scope.row.checkStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obtain:student:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obtain:student:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-detail"
            @click="handleShowDetail(scope.row)"
            v-hasPermi="['obtain:student:detail']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-detail"
            @click="handleReport(scope.row)"
            v-hasPermi="['obtain:student:report']"
          >生成报告</el-button>
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

    <!-- 添加或修改学员管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <span v-if="isUpdate">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
        <el-form-item label="所属班级" prop="roomId">
          <el-select v-model="form.roomId" placeholder="请选择所属班级"  @click.native="selectRemind()">
            <el-option
              v-for="item in roomOptions"
              :key="item.roomId"
              :label="item.roomName"
              :value="item.roomId"
              @click="checkDeptIdSelected"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="所属市场部" prop="marketId">
          <el-select v-model="form.marketId" placeholder="请选择所属市场部"  >
            <el-option
              v-for="item in marketOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="form.stuName" placeholder="请输入学生姓名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="入学学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入入学学历" />
        </el-form-item>
          </el-col>
            </span>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idenNum">
              <el-input v-model="form.idenNum" placeholder="请输入身份证号"  />
            </el-form-item>
          </el-col>
          <span v-if="isUpdate">
          <el-col :span="12">
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"  auto-complete="off"/>
        </el-form-item>
          </el-col>
            </span>
          <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="微信号" prop="wxNumber">
          <el-input v-model="form.wxNumber" placeholder="请输入微信号"  />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="入学日期" prop="intakeDate">
          <el-date-picker clearable
                          v-model="form.intakeDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerEffective"
                          placeholder="请选择入学日期">
          </el-date-picker>
        </el-form-item>
          </el-col>
          <span v-if="isUpdate">
          <el-col :span="12">
        <el-form-item label="毕业日期" prop="gradTime">
          <el-date-picker clearable
                          v-model="form.gradTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerInvalid"
                          placeholder="请选择毕业日期">
          </el-date-picker>
        </el-form-item>
          </el-col>

          <el-col :span="12">
        <el-form-item label="考核状态"  v-model="isUpdate" v-if="isUpdate">
          <el-select v-model="form.obtainStatusA"
                     placeholder="请选择考核状态"
                     @change="firstColumnChangeAction($event)"
                     :style="'width:100%;'">
            <el-option
              v-for="item in firstColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="就业状态"  v-model="isUpdate" v-if="isUpdate">
          <el-select v-model="form.obtainStatusB"
                     placeholder="请选择就业状态"
                     value-key="id"
                     @change="secondColumnChangeAction($event)"
                     :style="'width:100%;'">
            <el-option
              v-for="item in secondColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="就业状态" v-model="isUpdate" v-if="isUpdate">
          <el-select v-model="form.obtainStatusC"
                     placeholder="请选择就业状态"
                     value-key="id"
                     :style="'width:100%;'">
            <el-option
              v-for="item in threeColumnList"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
              @click.native="threeColumnChangeAction(item.id,item.statusName)"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="就业城市" prop="obtainCity" v-model="isStatus" v-if="isStatus" >
          <el-input v-model="form.obtainCity" placeholder="请输入就业城市" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就职岗位" prop="postName"  v-model="isStatus" v-if="isStatus">
              <el-input v-model="form.postName" placeholder="请输入就职岗位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

        <el-form-item label="就业薪资" prop="obtainSalary"  v-model="isStatus" v-if="isStatus">
          <el-input v-model="form.obtainSalary" placeholder="请输入就业薪资" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭住址" />
        </el-form-item>
          </el-col>
            </span>
          <el-col :span="12">
        <el-form-item label="现住址" prop="currentAddress">
          <el-input v-model="form.currentAddress" placeholder="请输入现住址" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
          <el-col :span="12">
            <el-form-item label="家长联系电话" prop="linkTelphone">
              <el-input v-model="form.linkTelphone" placeholder="请输入家长联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="与本人关系" prop="linkName">
          <el-input v-model="form.linkName" placeholder="请输入与本人关系" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属市场部" prop="marketId">
              <el-select v-model="form.marketId" placeholder="请选择所属市场部"  >
                <el-option
                  v-for="item in marketOptions"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
      <!-- 学员导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip text-center" slot="tip">
            <div class="el-upload__tip" slot="tip">
<!--              <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的学生数据-->
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </el-dialog>
    <!-- 学员历史记录导入对话框 -->
    <el-dialog :title="uploadhistory.title" :visible.sync="uploadhistory.open" width="400px" append-to-body>
      <el-upload
        ref="uploadhistory"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadhistory.headers"
        :action="uploadhistory.url + '?updateSupport=' + uploadhistory.updateSupport"
        :disabled="uploadhistory.isUploading"
        :on-progress="handleFileUploadProgressHistory"
        :on-success="handleFileSuccessHistory"
        :on-error="handleFileErrorHistory"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <!--              <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的学生数据-->
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplateHistory">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileFormHistory">确 定</el-button>
        <el-button @click="uploadhistory.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStudent,
  getStudent,
  getSelectRoomBydeptId,
  getSelectFirst,
  getSelectSecond,
  getSelectThree,
  delStudent,
  addStudent,
  updateStudent,
  getCheckTelCode,
  getCheckIdenNum,
  getWordTemplate,
  getSelectCollege,
  getSelectMarket
} from "@/api/obtain/student";
import {getToken} from "@/utils/auth";
import Cookies from "js-cookie";
import {getSelectRoom} from "@/api/obtain/room";

export default {
  name: "Student",
  dicts: ['sys_user_sex', 't_status','red_result'],
  data() {
    /*电话唯一校验*/
    const checkTelCode = async (rule, value, callback) => {
      if (value) {
        await getCheckTelCode(value).then((response) => {
          if(response.msg==='操作成功'){
            callback();
          }else{
            callback(new Error(response.msg));
          }
        });
      }
    };
    /*/!*身份证唯一校验*!/
    const checkIdenNum = async (rule, value, callback) => {
      if (value) {
        await getCheckIdenNum(value).then((response) => {
          if(response.msg==='操作成功'){
            callback();
          }else{
            callback(new Error(response.msg));
          }
        });
      }
    };*/

    return {
      token: '',
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
      //三级联动一级菜单初始化参数
      pid:0,
      // 学员管理表格数据
      studentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      /*部门树*/
      deptOptions:[],
      //班级下拉
      roomOptions:[],
      //所属市场部
      marketOptions:[],
      //一级状态下拉数据
      firstColumnList:[],
      // 二级状态下拉数据
      secondColumnList: [],
      // 三级状态下拉数据
      threeColumnList: [],
      isStatus: false, //隐藏就业信息
      isUpdate: false,//修改隐藏学生就业状态信息
      obtainStatusA:'',
      obtainStatusB:'',
      obtainStatusC:'',
      userroleShow:true,
      checkStatus:'',
      session:'',
      pickerEffective:'',
      pickerInvalid:'',
      pre: process.env.VUE_APP_HOST_PORT,
      firstPlayFlag:true,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/obtain/student/importStudent",
        //上传文件进度条数据
        percentage: 0
      },
      // 用户导入参数
      uploadhistory: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/obtain/student/importStudentHistory",
        //上传文件进度条数据
        percentage: 0
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuName: null,
        collegeId: null,
        roomId: null,
        deptId: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        mobile: null,
        obtainCity: null,
        postName: null,
        obtainSalary: null,
        education: null
      },
      // 表单参数
      form: {
        collegeId: null,
        roomId: null,
        deptId:null,
        marketId: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        obtainCity:null,
        postName:null,
        obtainSalary:null,
        idenNum:null,
        //一级状态下拉数据
        firstColumnList:[],
        // 二级状态下拉数据
        secondColumnList: [],
        // 三级状态下拉数据
        threeColumnList: [],
        gradTime:'',
        intakeDate:''
      },

      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "学院不能为空", trigger: "change" }
        ],
        stuName: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '学生姓名长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        roomId: [
          { required: true, message: "所属班级不能为空", trigger: "change" }
        ],
        marketId: [
          { required: true, message: "所属市场部不能为空", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTelCode, trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        //idenNum: [
          //{ required: true, message: "请输入身份证号", trigger: "blur" },
         // { validator: checkIdenNum, trigger: "blur" },
          /*{
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
            message: "请输入正确的身份证号",
            trigger: "blur"
          }*/
       // ],
        wxNumber: [
          { required: true, message: "微信号不能为空", trigger: "blur" },
          { min: 2, max: 50, message: '学生姓名长度必须介于 2 和 50 之间', trigger: 'blur' }
        ],
        gradTime: [
          { required: true, message: "毕业日期不能为空", trigger: "blur" }
        ],
        obtainStatusA: [
          { required: true, message: "就业考核阶段不能为空", trigger: "change" }
        ],
        obtainStatusB: [
          { required: true, message: "就业状态是否已就业不能为空", trigger: "change" }
        ],
        linkTelphone: [
          { required: true, message: "家长联系电话不能为空", trigger: "change" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        linkName:[{required: true, message: "与本人关系不能为空", trigger: "change"}],
        idenNum:[{required: true, message: "身份证号不能为空", trigger: "change"}],
        intakeDate:[{required: true, message: "入学日期不能为空", trigger: "change"}],
      }
    };
  },
  created() {
    this.getQueryStuRoles();
    this.getList();
    this.getSelectCollege(); //学院
    this.getSelectMarket(); //市场部

  },
  mounted() {
    this.pickerEffective = this.effectiveDate()
    this.pickerInvalid = this.invalidDate()
  },
  methods: {
    // 失效日期大于生效日期
    effectiveDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.form.gradTime) {
            return new Date(self.form.gradTime).getTime() < time.getTime()
          }
        }
      }
    },
    // 失效日期大于生效日期
    invalidDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.form.intakeDate) {
            return new Date(self.form.intakeDate).getTime() > time.getTime()
          }
        }
      }
    },
    /*获取市场部老师登录角色*/
    getQueryStuRoles(){
       let roles=this.$store.state.user.roles;
       if(roles.includes('marketing')){
              this.userroleShow=false;
       }
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
    /*获取市场部下拉*/
    getSelectMarket(){
      this.form.roomId = null;
      getSelectMarket().then(response => {
        this.marketOptions = response.data.markets;
      });
    },
    /*获取学院下拉*/
    getSelectCollege(){
      this.form.roomId = null;
      getSelectCollege().then(response => {
        this.deptOptions= response.data.colleges;
      });
    },
    // 一级改动
    firstColumnChangeAction(e) {
      console.log("加载一级下拉数据")
      // 初始化二三级的列表
      //根据一级下拉框选择的id当做二级下拉框的父节点id查询二级下拉框的id
      this.getSelectSecond(e);
    },
    // 二级改动
    secondColumnChangeAction(e) {
      console.log("根据一级下拉id：" + e + "加载二级下拉数据")
      this.$set(this.queryParams, 'obtainStatusC', null);
      // 清空三级下拉
      // 根据二级下拉框选择的id当做三级下拉框的父节点id查询三级下拉框的id
      this.getSelectThree(e);
    },
    getSelectFirst(pid) {
      getSelectFirst(pid).then(Response => {
        this.firstColumnList = Response.data.statuss;
      })
    },
    getSelectSecond(pid) {
      getSelectSecond(pid).then(Response => {
        this.secondColumnList = Response.data.statuss;
      })
    },
    getSelectThree(pid) {
      getSelectThree(pid).then(Response => {
        this.threeColumnList = Response.data.statuss;
      })
    },
    //根据下拉选项显示隐藏信息
    threeColumnChangeAction(val,index) {
      if(index.includes("正常就业")){
        this.isStatus =true;
      }else if(index.includes("以往")){
        this.isStatus =false;
      }else if(index.includes("返回")){
        this.isStatus =false;
      }
    },
    /** 查询学员管理列表 */
    getList() {
      this.loading = true;
      listStudent(this.queryParams).then(response => {
        this.getSelectFirst(this.pid);//初始化就业状态一级下拉框数据
        this.studentList = response.rows;
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
        obtainStudentId: null,
        stuName: null,
        roomId: null,
        marketId: null,
        postName: null,
        mobile: null,
        sex: null,
        address: null,
        currentAddress: null,
        status: null,
        linkName: null,
        linkTelphone: null,
        wxNumber: null,
        intakeDate: null,
        gradTime: null,
        obtainStatusA: null,
        obtainStatusB: null,
        obtainStatusC: null,
        obtainCity: null,
        obtainSalary: null,
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
      this.queryParams.roomId='';
      // this.handleQuery();
    },


    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.obtainStudentId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isUpdate = true;
      this.reset();
      this.getSelectCollege(); //学院
      this.getSelectMarket(); //市场部
      this.roomOptions=[];
      this.getSelectFirst(this.pid);//初始化就业状态一级下拉框数据
      this.open = true;
      this.title = "添加学员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isUpdate = false; //修改的时候隐藏就业状态信息
      this.isStatus = false;
      this.reset();
      const obtainStudentId = row.obtainStudentId || this.ids
      getStudent(obtainStudentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学员信息";
      });
    },
    /*生成报告按钮操作*/
    handleReport(row){
      const obtainStudentId = row.obtainStudentId;
      getWordTemplate(obtainStudentId).then(response=>{
        const msg=response.msg;
        console.log(this.pre+'/profile/upload/'+msg);
        //this.download('/obtain/student/importTemplate', {}, `student_template_${new Date().getTime()}.doc`)
        console.log(msg);
        this.$download.resource(this.pre+'/profile/upload/'+msg);
      });
    },
    /** 详情按钮操作 */
    handleShowDetail(row) {
      this.reset();
      const obtainStudentId = row.obtainStudentId
      this.$router.push({
        path: '/detail/detail',
        query: {
          obtainStudentId: obtainStudentId
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.obtainStudentId != null) {
            updateStudent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudent(this.form).then(response => {
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
      const obtainStudentIds = row.obtainStudentId || this.ids;
      this.$modal.confirm('是否确认删除学员管理编号为"' + obtainStudentIds + '"的数据项？').then(function () {
        return delStudent(obtainStudentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      if (confirm("您确定要导出学生数据么?")) {
        this.download('obtain/student/export', {
          ...this.queryParams
        }, `student_${new Date().getTime()}.xlsx`)
      }
    },


    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "学员导入";
      this.upload.open = true;
    },
    /** 导入按钮操作 */
    handleImportHistory() {
      this.uploadhistory.title = "学员历史记录导入";
      this.uploadhistory.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/obtain/student/importTemplate', {}, `student_template_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作历史 */
    importTemplateHistory() {
      this.download('/obtain/student/importTemplateHistory', {}, `history_student_template_${new Date().getTime()}.xlsx`)
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    //上传失败处理
    handleFileError(err,file, fileList){

    },
    // 文件上传中处理
    handleFileUploadProgressHistory(event, file, fileList) {
      this.uploadhistory.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccessHistory(response, file, fileList) {
      this.uploadhistory.open = false;
      this.uploadhistory.isUploading = false;
      this.$refs.uploadhistory.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    //上传失败处理
    handleFileErrorHistory(err,file, fileList){

    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 提交上传文件-历史记录
    submitFileFormHistory() {
      this.$refs.uploadhistory.submit();
    }
  }
};
</script>
