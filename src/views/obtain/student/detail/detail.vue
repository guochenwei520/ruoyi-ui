<template>
  <div  class="app-container">
    <!--  详情页面 -->
      <el-form ref="form" :model="form">
          {{form.pic}}
          {{form.stuName}}
          {{form.statusNames}}<br>
        <el-link type="primary"  @click="resetPwd" v-if="userroleShow">修改密码</el-link>&nbsp;&nbsp;
        <span v-if="userroleShow">
        <el-tag style="color: green;" v-if="form.status==0"><el-link type="primary"  @click="lockUserName">冻结账号</el-link></el-tag>&nbsp;&nbsp;
        <el-tag style="color: red" v-if="form.status==1"><el-link type="primary"  @click="unLockUserName">解冻账号</el-link></el-tag>&nbsp;&nbsp;
        </span>
          <el-tag style="color: green;background-color: #13ce66" v-if="form.status==0">正常</el-tag>
          <el-tag style="color: red" v-if="form.status==1">冻结账号</el-tag>

        <el-row>
          <el-col :span="6">
        <el-form-item label="联系电话" prop="mobile">
          {{form.mobile}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="账号状态" prop="status">
          <el-tag style="color: green;background-color: #13ce66" v-if="form.status==0">正常</el-tag>
          <el-tag style="color: #C03639;background-color: red" v-if="form.status==1">禁用</el-tag>
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="所属学院" >
          {{form.sysDept.deptName}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="所属班级" >
          {{form.room.roomName}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="微信号" prop="wxNumber">
          {{form.wxNumber}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="入学学历" prop="education">
          {{form.education}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="入学日期" prop="intakeDate">
          {{form.intakeDate}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
        <el-form-item label="毕业日期" prop="gradTime">
          {{form.gradTime}}
        </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="家长联系电话" prop="linkTelphone">
              {{form.linkTelphone}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="与本人关系" prop="linkName">
              {{form.linkName}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
      <el-form-item label="备注" prop="remark">
        {{form.remark}}
      </el-form-item>
          </el-col>
        </el-row>
      </el-form>
<!--修改密码-->
    <el-dialog :title="userTitle" :visible.sync="userOpen" width="500px" append-to-body>
      <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="userForm.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="userForm.newPassword" placeholder="请输入新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="userSubmit">保存</el-button>
          <el-button type="danger" size="mini" @click="userClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div>

      <!-- 这里是标签页 -->
      <div class="main">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="简历档案"  name="resumes">
            <el-tabs v-model="activeNames"  @tab-click="handleClicks">
              <el-tab-pane label="简历" name="resume" id="resume">
                <el-table  :data="resumeList">
                  <el-table-column label="简历名称" prop="resumeRealName" align="center">
<!--                    <template slot-scope="scope">
                      <span>{{scope.row.resumeRealName}}</span>
                      <el-link type="primary"  @click="handleUploadFile">上传</el-link>
                    </template>-->
                  </el-table-column>
                  <el-table-column label="上传时间" prop="createTime" align="center"/>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handlePreview(scope.row)"
                      >预览</el-button>
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleDownload(scope.row,1)"
                      >下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="resumeTotal>0"
                  :total="resumeTotal"
                  :page.sync="resumePage.pageNum"
                  :limit.sync="resumePage.pageSize"
                  @pagination="pbSel(activeNames)"
                />
              </el-tab-pane>
              <el-tab-pane label="作品集" name="portfolio" id="portfolio">
                <el-table  :data="resumeList" @tab-click="handleClicks">
                  <el-table-column label="作品名称" prop="portfolioRealName" align="center">
<!--                    <template slot-scope="scope">
                      <span>{{scope.row.portfolioRealName}}</span>
                      <el-link type="primary"  @click="handleUploadFile">上传</el-link>
                    </template>-->
                  </el-table-column>
                  <el-table-column label="上传时间" prop="createTime" align="center"/>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
<!--                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handlePreview(scope.row)"
                      >预览</el-button>-->
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleDownload(scope.row,2)"
                      >下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="resumeTotal>0"
                  :total="resumeTotal"
                  :page.sync="resumePage.pageNum"
                  :limit.sync="resumePage.pageSize"
                  @pagination="pbSel(activeNames)"
                />
              </el-tab-pane>
            </el-tabs>
            <el-dialog :title="viewWordTitle" :visible.sync="viewWordOpen" width="1200px" append-to-body>
              <vue-office-docx
                :src="pre+this.form.resumeName"
                style="height: 100vh;"
                @rendered="renderedHandler"
                @error="errorHandler"
              />
            </el-dialog>
            <el-dialog :title="viewPdfTitle" :visible.sync="viewPdfOpen" width="1200px" append-to-body>
              <vue-office-pdf
                :src="pre+this.form.resumeName"
                style="height: 100vh;"
                @rendered="renderedHandler"
                @error="errorHandler"
              />
            </el-dialog>
            <el-dialog :title="viewXlsxTitle" :visible.sync="viewXlsxOpen" width="1200px" append-to-body>
              <vue-office-excel
                :src="pre+this.form.resumeName"
                style="height: 100vh;"
                @rendered="renderedHandler"
                @error="errorHandler"
              />
            </el-dialog>

          </el-tab-pane>

          <el-tab-pane label="面试记录" name="interview">
             <el-table :data="interviewList">
               <el-table-column label="企业名称" align="center" prop="enterpriseName" />
               <el-table-column label="最低薪资" align="center" prop="minSalary" />
               <el-table-column label="最高薪资" align="center" prop="maxSalary" />
               <el-table-column label="企业图片" align="center" prop="enterpriseImage" width="100">
                 <template slot-scope="scope">
                   <image-preview :src="scope.row.enterpriseImage" :width="50" :height="50"/>
                 </template>
               </el-table-column>
               <el-table-column label="面试心得" align="center" prop="interviewExperience" />
               <el-table-column label="面试时间" align="center" prop="recordingTime" />
               <el-table-column label="录音文件" align="center" prop="recordingDuration"  width="300" >
                 <template slot-scope="scope">
                   <audio class="width-full" controls :src="pre+scope.row.recordingDuration" :width="80" :height="30"></audio>
                   <!--          <video class="width-full video" autoplay controls :src="scope.row.recordingDuration"></video>-->
                 </template>
               </el-table-column>
               <el-table-column label="描述" align="center" prop="remark" />
               <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                 <template slot-scope="scope">
                   <el-button
                     size="mini"
                     type="text"
                     icon="el-icon-delete"
                   >转文字</el-button>
                 </template>
               </el-table-column>
            </el-table>

            <pagination
              v-show="interviewTotal>0"
              :total="interviewTotal"
              :page.sync="interviewFrom.pageNum"
              :limit.sync="interviewFrom.pageSize"
              @pagination="pbSel(activeName)"
            />
          </el-tab-pane>

          <el-tab-pane label="跟踪记录" name="track">
            <div ><!--style="height: 300px;" 自适应目前  可以自己设置高度-->
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    v-if="userroleShow"
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="trackHandleAdd"
                    v-hasPermi="['obtain:track:follow']"
                  >添加跟进记录</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="departmentCheck"
                    v-hasPermi="['obtain:track:check']"
                  >就业数据核实</el-button>
                </el-col>
              </el-row>
              <el-steps  direction="vertical" :active="1" >

                <el-step  v-for="(item,index) in trackList" :key="index"
                         :title="item.trackTime+' '+item.trackDetail.student.stuName+' | '+item.trackMethod"
                         :description="item.trackDetail.statusNames+'  '+item.trackDetail.enterpriseName+
                         ' | '+item.trackDetail.postName+' | '+item.trackDetail.obtainSalary+
                         ' | '+item.trackDetail.obtainTime+'  '+item.trackDetail.remark+' '+
                         item.trackDetail.interviewRecording+' '+item.trackDetail.followUpRecording"
                >
                  <template slot="title">
                    <div style="display: flex;">{{item.trackTime}} {{item.trackDetail.student.stuName}} | {{item.trackMethod}}
                      <div class="chart-wrapper" v-if="userroleShow">
                        &nbsp;&nbsp;&nbsp;&nbsp;<dict-tag :options="dict.type.red_result" :value="item.checkStatus"/>
                      </div>
                    </div>
                  </template>
                  <template slot="description" >

                    <span v-if="item.trackDetail.statusNames.includes('就业中')">
                      {{item.statusNames}}  {{item.trackDetail.enterpriseName}} |
                      {{item.trackDetail.postName}} | {{item.trackDetail.obtainSalary}} |
                      {{item.trackDetail.obtainTime}} |
                      {{item.trackDetail.nature==0?'专业':'非专业'}} | {{item.trackDetail.companyAddress}}
                      <br/> {{item.trackDetail.remark}} <br/>
                      <audio class="width-full" controls :src="pre+item.trackDetail.interviewRecording" :width="80" :height="30"></audio>
                       <el-button type="primary" plain @click="HandleConvert(item.trackDetail.interviewRecording)">转文字</el-button>
                      <br>
                       <audio class="width-full" controls :src="pre+item.trackDetail.followUpRecording" :width="80" :height="30"></audio>
                       <el-button type="primary" plain @click="HandleConvert(item.trackDetail.interviewRecording)">转文字</el-button>
                    </span>
                    <span v-else="item.trackDetail.statusNames.includes('未就业')">
                      {{item.statusNames}} | 简历投递数{{item.trackDetail.submittedNumber}}
                      | 邀约公司数{{item.trackDetail.invitationNumber}}
                      |  面试量{{item.trackDetail.interviewVolume}}
                      | 面试次数{{item.trackDetail.interviewNumber}}
                      | offer数{{item.trackDetail.offerNumber}} <br/>
                      {{item.trackDetail.remark}}<br/>
                      <audio class="width-full" controls :src="pre+item.trackDetail.interviewRecording" :width="80" :height="30"></audio>
                       <el-button type="primary" plain @click="HandleConvert(item.trackDetail.interviewRecording)">转文字</el-button>
                      <br>
                       <audio class="width-full" controls :src="pre+item.trackDetail.followUpRecording" :width="80" :height="30"></audio>
                       <el-button type="primary" plain @click="HandleConvert(item.trackDetail.interviewRecording)">转文字</el-button>
                    </span>
                  </template>
                </el-step>
              </el-steps>
            </div>
            <!-- 就业数据核实记录对话框 -->
            <el-dialog :title="checkTitle" :visible.sync="checkOpen" width="800px" append-to-body>
              <el-form ref="checkForm" :model="checkForm" :rules="checkRules" label-width="130px">
                <el-input type="hidden" v-model="checkForm.stuId"  />
                <el-form-item label="核实方式" prop="checkMethod">
                  <el-input v-model="checkForm.checkMethod" placeholder="请输入核实方式" style="width: 240px;"/>
                </el-form-item>
                <el-form-item label="考核状态" prop="obtainStatusA">
                  <el-select v-model="checkForm.obtainStatusA"
                             placeholder="请选择考核状态"
                             @change="firstColumnChangeActions($event)"
                             style="width: 240px;">
                    <el-option
                      v-for="item in firstColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  原:<el-select v-model="trackForm.trackDetail.obtainStatusA"
                             placeholder="请选择考核状态"
                             style="width: 240px;"
                                disabled
                    >
                    <el-option
                      v-for="item in firstColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="就业状态" prop="obtainStatusB">
                  <el-select v-model="checkForm.obtainStatusB"
                             placeholder="请选择就业状态"
                             value-key="id"
                             @change="secondColumnChangeActions($event)"
                             style="width: 240px;">
                    <el-option
                      v-for="item in secondColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  原:<el-select v-model="trackForm.trackDetail.obtainStatusB"
                             placeholder="请选择就业状态"
                             value-key="id"
                             style="width: 240px;"
                                disabled
                             >
                    <el-option
                      v-for="item in secondColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="就业状态" prop="obtainStatusC">
                  <el-select v-model="checkForm.obtainStatusC"
                             placeholder="请选择就业状态"
                             style="width: 240px;">
                    <el-option
                      v-for="(item,index) in threeColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                      @click.native="threeColumnChangeAction(item.id,item.statusName)"
                    ></el-option>
                  </el-select>
                  原:<el-select v-model="trackForm.trackDetail.obtainStatusC"
                             placeholder="请选择就业状态"
                             style="width: 240px;"
                                disabled
                             >
                    <el-option
                      v-for="(item,index) in threeColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <span v-if="isObtain">
                <el-form-item label="岗位性质" prop="nature">
                  <el-radio-group v-model="checkForm.nature">
                    <el-radio
                      v-for="dict in dict.type.t_nature"
                      :key="dict.value"
                      :label="parseInt(dict.value)"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                  <el-form-item label="就职岗位" prop="postName">
                  <el-input v-model="checkForm.postName" placeholder="请输入就职岗位" style="width: 240px;"  />
                  原:<el-input v-model="trackForm.trackDetail.postName" placeholder="请输入就职岗位" style="width: 240px;" disabled />
                </el-form-item>
                <el-form-item label="入职时间" prop="entryTime">
                    <el-date-picker clearable
                                    v-model="checkForm.entryTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 240px;"
                                    placeholder="请选择入职时间">
                    </el-date-picker>
                   原:<el-date-picker clearable
                                   v-model="trackForm.trackDetail.obtainTime"
                                   type="date"
                                   value-format="yyyy-MM-dd"
                                   style="width: 240px;"
                                   placeholder="请选择入职时间"
                                      disabled
                                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="就业城市" prop="employmentCity">
                  <el-input v-model="checkForm.employmentCity" placeholder="请输入就业城市" style="width: 240px;" />
                  原:<el-input v-model="trackForm.trackDetail.obtainCity" placeholder="请输入就业城市" style="width: 240px;" disabled/>
                </el-form-item>
<!--                <el-form-item label="是否一线城市" prop="isfirsttierCity">
                  <el-radio-group v-model="checkForm.isfirsttierCity">
                    <el-radio
                      v-for="dict in dict.type.t_isfirsttier_city"
                      :key="dict.value"
                      :label="parseInt(dict.value)"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>-->
                <el-form-item label="核实薪资" prop="obtainSalary">
                  <el-input type="number" v-model="checkForm.obtainSalary" placeholder="请输入核实薪资,只能输入数字" style="width: 240px;" />
                  原:<el-input v-model="trackForm.trackDetail.obtainSalary" placeholder="请输入核实薪资" style="width: 240px;" disabled/>
                </el-form-item>
                <el-form-item label="就业企业" prop="employmentCompany">
                  <el-input v-model="checkForm.employmentCompany" placeholder="请输入就业企业" style="width: 240px;" />
                  原:<el-input v-model="trackForm.trackDetail.enterpriseName" placeholder="请输入就业企业" style="width: 240px;" disabled/>
                </el-form-item>

                <el-form-item label="公司地址" prop="companyAddress">
                  <el-input v-model="checkForm.companyAddress" placeholder="请输入公司地址" style="width: 500px;" /><br>
                  原:<el-input v-model="trackForm.trackDetail.companyAddress" placeholder="请输入公司地址" style="width: 500px;" disabled/>
                </el-form-item>
                  </span>
                <el-form-item label="核实结果" prop="reviewedResult">
                  <el-radio-group v-model="checkForm.reviewedResult">
                    <el-radio
                      v-for="dict in dict.type.red_result"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="学生核实录音" prop="followUpRecording">
                  <audio_upload v-model="checkForm.followUpRecording"/>
                </el-form-item>
                <el-form-item label="家长核实录音" prop="parentRecording">
                  <audio_upload v-model="checkForm.parentRecording"/>
                </el-form-item>
                <el-form-item label="校方核实记录" prop="schoolRecord">
                  <el-input type="textarea" v-model="checkForm.schoolRecord" placeholder="请输入校方核实记录" maxlength="200"
                            show-word-limit />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="checkSubmitForm">确 定</el-button>
                <el-button @click="checkCancel">取 消</el-button>
              </div>
            </el-dialog>

            <!-- 添加或修改跟踪记录对话框 -->
            <el-dialog :title="trackTitle" :visible.sync="trackOpen" width="500px" append-to-body>
              <el-form ref="trackForm" :model="trackForm" :rules="trackRules" label-width="130px">
                <el-input type="hidden" v-model="trackForm.stuId"  />
                <el-form-item label="跟踪方式" prop="trackMethod">
                  <el-input v-model="trackForm.trackMethod" placeholder="请输入跟踪方式" />
                </el-form-item>
                <el-form-item label="考核状态" prop="trackDetail.obtainStatusA">
                  <el-select v-model="trackForm.trackDetail.obtainStatusA"
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
                <el-form-item label="就业状态" prop="trackDetail.obtainStatusB">
                  <el-select v-model="trackForm.trackDetail.obtainStatusB"
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
                <el-form-item label="就业状态" prop="trackDetail.obtainStatusC">
                  <el-select v-model="trackForm.trackDetail.obtainStatusC"
                             placeholder="请选择就业状态"
                             :style="'width:100%;'">
                    <el-option
                      v-for="(item,index) in threeColumnList"
                      :key="item.id"
                      :label="item.statusName"
                      :value="item.id"
                      @click.native="threeColumnChangeAction(item.id,item.statusName)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <span v-if="trackForm.isZcjyShow">
                   <el-form-item label="就业城市" prop="probationSalary">
                  <el-input v-model="trackForm.trackDetail.obtainCity" placeholder="请输入就业城市" />
                </el-form-item>
                  <el-form-item label="就职企业" prop="enterpriseName">
                  <el-input v-model="trackForm.trackDetail.enterpriseName" placeholder="请输入就职企业" />
                </el-form-item>
                  <el-form-item label="公司地址" prop="companyAddress">
                  <el-input v-model="trackForm.trackDetail.companyAddress" placeholder="请输入公司地址" />
                </el-form-item>
                   <el-form-item label="就职岗位" prop="postName">
                  <el-input v-model="trackForm.trackDetail.postName" placeholder="请输入就职岗位" />
                </el-form-item>
                <el-form-item label="转正薪资" prop="obtainSalary">
                  <el-input type="number" v-model="trackForm.trackDetail.obtainSalary" placeholder="请输入转正薪资,只能输入数字" />
                </el-form-item>
                   <el-form-item label="岗位性质" prop="nature">
                      <el-radio-group v-model="trackForm.trackDetail.nature">
                        <el-radio
                          v-for="dict in dict.type.t_nature"
                          :key="dict.value"
                          :label="parseInt(dict.value)"
                        >{{dict.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
<!--                  <el-form-item label="是否一线城市" prop="isfirsttierCity">
                  <el-radio-group v-model="trackForm.trackDetail.isfirsttierCity">
                    <el-radio
                      v-for="dict in dict.type.t_isfirsttier_city"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>-->
                 <el-form-item label="入职时间" prop="obtainTime">
                  <el-date-picker clearable
                                  v-model="trackForm.trackDetail.obtainTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="请选择入职时间">
                  </el-date-picker>
                </el-form-item>
                  <el-form-item label="面试录音上传" prop="interviewRecording">
                    <audio_upload v-model="trackForm.trackDetail.interviewRecording"/>
                </el-form-item>
                   <el-form-item label="回访录音上传" prop="followUpRecording">
                     <audio_upload v-model="trackForm.trackDetail.followUpRecording"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="trackForm.remark" placeholder="请输入备注" maxlength="200"
                            show-word-limit />
                </el-form-item>
                  </span>
                <span v-if="trackForm.isFhShow">
                 <el-form-item label="面试录音上传" prop="interviewRecording">
                    <audio_upload v-model="trackForm.trackDetail.interviewRecording"/>
                </el-form-item>
                   <el-form-item label="回访录音上传" prop="followUpRecording">
                     <audio_upload v-model="trackForm.trackDetail.followUpRecording"/>
                </el-form-item>
                 <el-form-item label="返回原因" prop="remark">
                   <el-input type="textarea" v-model="trackForm.remark" placeholder="请输入备注" maxlength="200"
                             show-word-limit />
                </el-form-item>
                </span>
                <span v-if="trackForm.isYwShow">
                  <el-form-item label="简历投递数" prop="submittedNumber">
                  <el-input v-model="trackForm.trackDetail.submittedNumber" placeholder="请输入简历投递数" />
                </el-form-item>
                   <el-form-item label="邀约公司数" prop="invitationNumber">
                  <el-input v-model="trackForm.trackDetail.invitationNumber" placeholder="请输入邀约公司数" />
                </el-form-item>
                   <el-form-item label="面试量" prop="interviewVolume">
                  <el-input v-model="trackForm.trackDetail.interviewVolume" placeholder="请输入面试量" />
                </el-form-item>
                   <el-form-item label="面试次数" prop="interviewNumber">
                  <el-input v-model="trackForm.trackDetail.interviewNumber" placeholder="面试次数" />
                </el-form-item>
                   <el-form-item label="offer数量" prop="offerNumber">
                  <el-input v-model="trackForm.trackDetail.offerNumber" placeholder="offer数量" />
                </el-form-item>
                  <el-form-item label="面试录音上传" prop="interviewRecording" >
                     <audio_upload v-model="trackForm.trackDetail.interviewRecording"/>
                </el-form-item>
                  <el-form-item label="回访录音上传" prop="followUpRecording">
                    <audio_upload v-model="trackForm.trackDetail.followUpRecording"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="trackForm.remark" placeholder="请输入备注" maxlength="200"
                            show-word-limit />
                </el-form-item>
                </span>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="trackSubmitForm">确 定</el-button>
                <el-button @click="trackCancel">取 消</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="提问记录" name="questioning">
            <el-table :data="questioningList">
              <el-table-column label="标题" prop="questioningTitle"/>
              <el-table-column label="提问截图" align="center" prop="questioningImage" width="100">
                <template slot-scope="scope">
                  <image-preview :src="scope.row.questioningImage" :width="50" :height="50"/>
                </template>
              </el-table-column>
              <el-table-column label="处理状态" align="center" prop="questioningStatus">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.t_questioning_status" :value="scope.row.questioningStatus"/>
                </template>
              </el-table-column>
              <el-table-column label="提问时间" prop="questioningTime"/>
              <el-table-column label="处理内容" align="center" prop="processingContent" >
                <template slot-scope="scope">
                  <span v-html="scope.row.processingContent"></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="questioningUpdate(scope.row)"
                    v-if="scope.row.questioningStatus!=2"
                  >处理</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="questioningDelete(scope.row)"
                  >详情</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="questioningTotal>0"
              :total="questioningTotal"
              :page.sync="questioningFrom.pageNum"
              :limit.sync="questioningFrom.pageSize"
              @pagination="pbSel(activeName)"
            />
          </el-tab-pane>

          <!-- 添加或修改提问记录对话框 -->
          <el-dialog :title="title" :visible.sync="questioningOpen" width="500px" append-to-body>
            <el-form ref="questioningForm" :model="questioningForm" :rules="questioningRules" label-width="80px">
              <el-form-item label="提问问题" prop="questioningTitle">
                {{questioningForm.questioningTitle}}
              </el-form-item>
              <el-form-item label="提问截图" prop="questioningImage">
                <questioning_img v-model="questioningForm.questioningImage" />
              </el-form-item>
              <el-form-item label="内容">
                <editor v-model="questioningForm.processingContent" :min-height="192"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="questioningCheckOpen">
              <el-button type="primary" @click="questioningSubmitForm">确 定</el-button>
              <el-button @click="questioningCancel">取 消</el-button>
            </div>
          </el-dialog>
        </el-tabs>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">返 回</el-button>
      </div>
      <!-- 触发加载数据函数-->
      <span v-if="show_ds ==true && implement == false">
        {{ LoadData(this.form) }}
    </span>
    </div>


  </div>
</template>

<script>
import {
  getSelect,
  getSelectFirst, getSelectSecond, getSelectThree,
  getSelectFirstById,getSelectSecondById,getSelectThreeById,
  getStudent,unLockUserName,lockUserName,
  listStudent, updateStudent
} from "@/api/obtain/student";
import {addProfile, listResume, updateProfile} from "@/api/obtain/profile";
import {listInterviews} from "@/api/obtain/interview";
import {addTrack, listTracks, updateTrack,getTracksByStuId,getLastTrackByStuId} from "@/api/obtain/track";
import {
  addQuestioningRecord, delQuestioningRecord,
  getQuestioningRecord,
  getlistQuestioning,
  updateQuestioningRecord
} from "@/api/obtain/questioningRecord";
import {getPrevieweFile} from "@/api/file/file";

import {updateUserPwds} from "@/api/system/user";
import {getToken} from "@/utils/auth";
import audio_upload from "@/views/obtain/student/detail/audio_upload.vue";
import questioning_img from "@/views/obtain/student/detail/questioning_img.vue";

//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePdf from '@vue-office/pdf'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/docx/lib/index.css'
import ScrollPane from "@/layout/components/TagsView/ScrollPane.vue";
import {addVerification} from "@/api/obtain/verification";





export default {
  components: {ScrollPane, audio_upload,VueOfficeDocx,VueOfficePdf,VueOfficeExcel,questioning_img},
  props: {
    show_ds: Boolean,//当前界面是否显示
    implement: Boolean,//编辑时加载是否 已执行

  },
  name: "detail",
  dicts: ['sys_user_sex', 't_status','t_questioning_status','red_result','t_nature','t_isfirsttier_city'],
  filters: {//限制文本显示字数,超出部分用...代替
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 5) {
        return value.slice(0,5) + '...'//0:下标,从第一个字开始显示,50:显示字数,多余用...代替
      }
      return value
    }
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userForm.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //取状态拼接字符串
      statusNames:'',
      //跟踪记录拼接字符串
      trackStr:'',
      //用户对象
      sysUser:{
        userName:''
      },
      //头像
      pic:'',
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

      questioningOpen: false,
      trackOpen: false, //跟踪记录增加修改页
      checkOpen: false, //就业数据核实页面
      questioningCheckOpen:true,
      education: true,
      probationSalary: true,
      userOpen:false,
      resumeOpen:false,
      //文件预览
      viewWordOpen:false,
      viewPdfOpen:false,
      viewXlsxOpen:false,
      viewXlsxTitle:'',
      viewWordTitle:'',
      viewPdfTitle:'',
      recordFileData:'',
      followUpFileData:'',
      userroleShow:true,
      //followUpFileData: new FormData(),
      //上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/obtain/common/upload",
        // 上传的文件列表
        fileList: [],
        /*跟踪上传录音文件列表*/
        recordFileList: [],
        followUpRecorFileList: []
      },
      // 表单参数
      form: {
        pic:'',
        stuName:'',
        mobile:'',
        postName:'',
        sysDept:{
          deptName:''
        },
        //学院对象
        college:{
          collegeName: ''
        },
        room:{
          roomName:''
        },

      },

      userForm: {
        phonenumber:undefined,
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      userRules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      },
      // 表单校验
      rules: {
      },
      // 表单参数
      questioningForm:{
        questioningImage:''
      },
      // 表单校验
      questioningRules: {
        processingContent: [
          { required: true, message: "问题处理不能为空", trigger: "change" },
          { min: 2, max: 20, message: '问题处理长度必须介于 2 和 200 之间', trigger: 'blur' }
        ]
      },
      //一级状态下拉数据
      firstColumnList:[],
      // 二级状态下拉数据
      secondColumnList: [],
      // 三级状态下拉数据
      threeColumnList: [],
      //就业处核实是否就业
      isObtain:true,
      checkForm:{
        stuId: null,
        trackId: null,
        trackDetailId: null,
        checkMethod: null,
        nature: null,
        isfirsttierCity: null,
        entryTime: null,
        employmentCity: null,
        employmentCompany: null,
        companyAddress: null,
        obtainStatusA:null,
        obtainStatusB:null,
        obtainStatusC:null,
        obtainSalary:null,
        reviewedResult:"0",
        followUpRecording:null,
        followUpRealName:null,
        schoolRecord:null,
        parentRecording:null,
        student:{
          stuName:null
        },
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      },
      checkRules:{
        obtainStatusA: [
          { required: true, message: "考核阶段不能为空", trigger: "blur" }
        ],
        obtainStatusB: [
          { required: true, message: "就业状态不能为空", trigger: "blur" }
        ],
        obtainStatusC: [
          { required: true, message: "就业状态不能为空", trigger: "blur" }
        ],
        schoolRecord: [
          { required: true, message: "核实记录不能为空", trigger: "blur" }
        ],
        reviewedResult: [
          { required: true, message: "核实结果不能为空", trigger: "blur" }
        ]

      },
      // 表单参数
      trackForm:{
        trackId: null,
        stuId: null,
        trackTime: null,
        trackMethod: null,
        trackDetail:{
          nature: 0,
          companyAddress:null,
          isfirsttierCity:0,
          obtainStatusA:null,
          obtainStatusB:null,
          obtainStatusC:null,
          probationSalary:null,
          obtainSalary:null,
          interviewRecording:null,
          recordRealName:null,
          recordPath:null,
          followUpRecording:null,
          followUpRealName:null,
          followUppath:null,
          submittedNumber:null,
          invitationNumber:null,
          interviewVolume:null,
          interviewNumber:null,
          offerNumber:null,
          obtainCity:null,
          enterpriseName:null,
          postName:null,
          student:{
            stuName:null
          }

        },
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      },
      // 表单校验
      trackRules: {
        trackMethod: [
          { required: true, message: "跟踪方式不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '跟踪方式长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        'trackDetail.obtainStatusA': [
            { required: true, message: "考核阶段不能为空", trigger: "blur" },
          ],
        'trackDetail.obtainStatusB': [
            { required: true, message: "就业状态不能为空", trigger: "blur" },
          ],
         'trackDetail.obtainStatusC': [
            { required: true, message: "就业状态不能为空", trigger: "blur" },
          ],
      },
      // 表单参数
      interviewForm:{

      },
      // 表单校验
      interviewRules: {
      },
      // 表单参数
      resumeForm:{

      },
      // 表单校验
      resumeRules: {
      },
      activeName: "success",//选择那个表格
      activeNames: "success",//选择那个表格
      resumeList: [],//面试档案数组
      interviewList: [],//面试记录数组
      trackList: [],//跟踪记录数组
      questioningList: [],//提问记录数组
      isShowDetail:false,


      createTime:'',
      resumeName:'',
      trackTitle:'',
      checkTitle:'',
      userTitle:'',
      resumeTitle:'',

    //  档案分页参数
      resumeTotal:0,
      resumePage: {
        pageNum: 1,
        pageSize: 10
      },
      //  面试分页参数
      interviewTotal:0,
      interviewFrom: {
        pageNum: 1,
        pageSize: 10
      },
      //  跟踪分页参数
      trackTotal:0,
      trackFrom: {
        pageNum: 1,
        pageSize: 10
      },
      //  提问分页参数
      questioningTotal:0,
      questioningFrom: {
        pageNum: 1,
        pageSize: 10
      },
      pre: process.env.VUE_APP_HOST_PORT
      // exportLoading:false,//控制成功导出
      // exportFail:false,//控制失败导出
      // exportPending:false,//控制待处理导出

      /*whether_loadSuccess:false,是否加载  【成功】
      whether_loadFail:false,是否加载  【失败】
      whether_loadPending:false,是否加载  【待处理】*/
    }
  },
  created() {
    this.obtainStudentId=this.$route.query.obtainStudentId;
    this.handleUpdate(this.obtainStudentId);
    this.getQueryStuRoles();
  },
  // 自定义挂载函数  钩子函数
  mounted() {
    /*
      因为我们是直接把参数拼接在二级页面路由的后面,
      那么接收的时候就需要通过router.params.name来接收参数
      */


  },
  watch: {
    $route(to, from) {
      window.location.reload(); //监测到路由发生跳转时刷新一次页面
    },
  },
  methods: {
    /*LoadData(row) {
      this.$emit("SetObj", "Setimplement", true);//已加载
      this.getResumeList();
    },*/
    /*****************************冻结、解冻账号*******************************************/
    lockUserName(){
      lockUserName(this.form.mobile).then(Response=>{
        this.$modal.msgSuccess("账号已冻结");
        this.handleUpdate(this.obtainStudentId);
      })
    },
    unLockUserName(){
      unLockUserName(this.form.mobile).then(Response=>{
        this.$modal.msgSuccess("账号已解冻");
        this.handleUpdate(this.obtainStudentId);
      })
    },
    /*获取当前登录用户角色*/
    getQueryStuRoles(){
      let roles=this.$store.state.user.roles;
      if(roles.includes('marketing')){
        this.userroleShow=false;
      }

    },

    /********************修改密码*********************************************/
    userSubmit() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          updateUserPwds(this.userForm.phonenumber,this.userForm.oldPassword, this.userForm.newPassword).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    userReset() {
      this.userForm={
        phonenumber:undefined,
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      };
    },
    userClose() {
      this.handleUpdate(this.obtainStudentId);
      this.userReset();
      this.userOpen=false;
    },
    /*修改密码*/
    resetPwd(){
      this.handleUpdate(this.obtainStudentId);
      this.userForm.phonenumber= this.form.mobile;
      this.userOpen=true;
      this.userTitle = "重置密码";
    },

    //学生档案简历列表数据
    getResumeList() {
      this.loading = true;
      listResume(this.obtainStudentId).then(response => {
        this.resumeList = response.rows;
        this.resumeTotal = response.total;
        this.loading = false;
      });
    },

    //面试记录列表数据
    getInterviewList() {
      this.loading = true;
      listInterviews(this.obtainStudentId).then(response => {
        this.interviewList = response.rows;
        this.interviewTotal = response.total;
        this.loading = false;
      });
    },
    //跟踪记录列表数据
    getTrackList() {
      this.loading = true;
      listTracks(this.obtainStudentId).then(response => {
        this.trackList = response.rows;
        this.trackTotal = response.total;
        this.loading = false;
      });
    },
    //提问记录列表数据
    getQuestioningList() {
      this.loading = true;
      getlistQuestioning(this.obtainStudentId).then(response => {
        this.questioningList = response.rows;
        this.questioningTotal = response.total;
        this.loading = false;
      });
    },
    /**标签页*/
    handleClick(tab) {
      this.pbSel(tab.name)
    },
    handleClicks(tab) {
      this.pbSel(tab.name)
    },
    pbSel(name) {
      if (name =="activeName"){
      }else if (name =="resume"){
        this.getResumeList();
      }else if (name =="interview"){
        this.getInterviewList();
      }else if (name =="track"){
        this.getTrackList();
        //初始化下拉框数据和三级联动数据
      }else if (name =="questioning"){
        this.getQuestioningList();
      }else if(name =="portfolio"){
        this.getResumeList();
      }
    },

    // 取消按钮 返回学生列表
    cancel() {
      this.$router.push({
        path:'/student',
        query:{
        }
      })
    },
    /** 回显数据 */
    handleUpdate(obtainStudentId) {
     // Object.assign()
      getStudent(obtainStudentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "学员管理详情";
      });
    },

    /*******************questioning提问记录******************************/
    // 表单重置
    questioningReset() {
      this.questioningForm = {
        questioningId: null,
        stuId: null,
        questioningTitle: null,
        questioningStatus: null,
        questioningTime: null,
        processingTime: null,
        processingContent: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      };
    },
    // 取消按钮
    questioningCancel() {
      this.handleUpdate(this.obtainStudentId);
      this.questioningOpen = false;
      this.isShowDetail=false;
      this.questioningReset();
    },
    /** 处理按钮操作 */
    questioningUpdate(row) {
      this.handleUpdate(this.obtainStudentId);
      this.questioningReset();
      const questioningId = row.questioningId || this.ids
      getQuestioningRecord(questioningId).then(response => {
        this.questioningForm = response.data;
        this.questioningOpen = true;
        this.isShowDetail=false;
        this.questioningCheckOpen=true,
        this.title = "处理";
      });
    },
    /** 详情按钮操作 */
    questioningDelete(row) {
      this.questioningCheckOpen=false;
      this.isShowDetail=true;
      this.handleUpdate(this.obtainStudentId);
      this.questioningReset();
      const questioningId = row.questioningId || this.ids
      getQuestioningRecord(questioningId).then(response => {
        this.questioningForm = response.data;
        this.questioningOpen = true;
        this.isShowDetail=true;
        this.title = "详情";
      });
    },
    /** 提交按钮 */
    questioningSubmitForm() {
      this.handleUpdate(this.obtainStudentId);
      this.$refs["questioningForm"].validate(valid => {
        if (valid) {
          if (this.questioningForm.questioningId != null) {
            this.questioningForm.questioningStatus=1;
            updateQuestioningRecord(this.questioningForm).then(response => {
              this.$modal.msgSuccess("问题已处理，待确认");
              this.questioningOpen = false;
              this.getQuestioningList();
            });
          }
        }
      });
    },
    /*******************profile学生档案******************************/
    handlePreview(row){
      const arrType=row.resumeName.split(".");
      const ftype=arrType[arrType.length-1];
      if(ftype==='docx'){
        this.form.resumeName=row.resumeName;
        this.viewWordOpen = true;
        this.viewWordTitle='文件预览';
      }else if(ftype==='pdf'){
        this.form.resumeName=row.resumeName;
        this.viewPdfOpen = true;
        this.viewPdfTitle='文件预览';
      }else if(ftype==='xlsx'){
        this.form.resumeName=row.resumeName;
        this.viewXlsxOpen = true;
        this.viewXlsxTitle='文件预览';
      }else{
        this.$modal.msgError("文件格式不正确，目前只支持docx、xlsx和pdf文件预览");
      }

    },
    renderedHandler() {
      console.log("渲染完成")
    },
    errorHandler() {
      console.log("渲染失败")
    },
    /********************************文件上传***************************************/
    handleUploadFile(){
      this.resumeReset();
      this.resumeOpen = true;
      this.upload.fileList = [];
      this.resumeTitle = "上传简历作品集";
    },
// 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
// 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.upload.fileList = [];
      this.resumeForm.resumePath = response.url;
      this.msgSuccess(response.msg);
    },
    // 文件电话回访录音上传成功处理
    handleeFollowUpRecorFileSuccess(response, file, followUpRecorFileList) {
      this.upload.isUploading = false;
      this.upload.followUpRecorFileList = [];
      this.trackForm.followUppath = response.urls;
      this.msgSuccess(response.msg);
    },
    // 文件面试录音上传成功处理
    handleRecordFileSuccess(response, file, recordFileList) {
      this.upload.isUploading = false;
      this.upload.recordFileList = [];
      this.trackForm.recordPath = response.url;
      this.msgSuccess(response.msg);
    },
    //fileList长度改变时触发
    changeFileList(file, fileList) {
      this.upload.fileList = fileList
    },
    //fileList长度改变时触发
    changeFollowUpRecorFileList(file, fileList) {
      this.upload.followUpRecorFileList = fileList
    },
    //fileList长度改变时触发
    changeRecordFileList(file, fileList) {
      this.upload.recordFileList = fileList
    },
    // 文件下载处理
    handleDownload(row,index){

      if(index===1){
        this.$download.resource( row.resumeName);
      }else{
        this.$download.zip(row.portfolioName, row.portfolioRealName);
      }
    },
   /* // 面试录音音频下载处理
    interviewHandleDownload(row){
      this.$download.resource( row.resumeName);
    },*/
    // 面试录音音频下载处理
    HandleDownloads(filename){
        this.$download.resource( filename);
    },
    HandleConvert(filename){
      this.$modal.msgSuccess("敬请期待");
    },
    getRecordFileData() {
      //此处的form是表单中的其它绑定值
      return this.trackForm
    },
    getFollowUpFileData() {
      //此处的form是表单中的其它绑定值
      return this.trackForm
    },
    getfileData() {
      //此处的form是表单中的其它绑定值
      return this.resumeForm
    },
    HttpUploadFile(file) {
      this.fileData.append('files', file.file); // append增加数据
    },
    HttpRecordUploadFile(file) {
      this.recordFileData.append('files', file.file); // append增加数据
    },
     HttpFollowUpUploadFile(file) {
      //this.FollowUpData.append('lfiles', file.file); // append增加数据
    },

    // 表单重置
    resumeReset() {
      this.resumeForm = {
        resumeId: null,
        stuId: null,
        resumeName: null,
        resumePath: null,
        portfolioPath: null,
        uploadTime: null,
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("resumeForm");
    },
    // 取消按钮
    resumeCancel() {
      this.upload.isUploading = false;
      this.upload.fileList = [];
      this.resumeOpen = false;
      this.resumeReset();
    },
    /** 提交按钮 */
    resumeSubmitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.resumeForm.resumeId != null) {
            updateProfile(this.resumeForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.resumeOpen = false;
              this.resumeList();
            });
          } else {
            //创建FormData对象，用于携带数据传递到后端
            this.fileData = new FormData();
            this.$refs.upload.submit();
            this.$modal.msgSuccess("上传成功");
            this.fileData.append("data", JSON.stringify(this.resumeForm));
            this.fileData.append("headers", { Authorization: "Bearer " + getToken() });
            this.fileData.append("withCredentials",false)
            this.fileData.append("filename", "file");
            var i = this.upload.fileList.length;
            if(i!==0){
              addProfile(this.fileData).then(response => {
                if(response.code===200){
                  this.upload.isUploading = false;
                  this.upload.fileList = [];
                  this.$modal.msgSuccess(response.msg);
                  this.resumeOpen = false;
                  this.resumeList();
                }else{
                  this.$message({
                    message: "失败",
                    type: 'error'
                  })
                }
              });
            }

          }
        }
      });
    },
    /*******************就业处核查结果填报******************************/
    departmentCheck(){
      this.checkReset();

      this.handleUpdate(this.obtainStudentId);
      this.checkForm.stuId=this.obtainStudentId;
      this.getSelectFirst(this.pid);//初始化就业状态一级下拉框数据
      getTracksByStuId(this.obtainStudentId).then(response=>{
        this.checkForm=response.data;
        this.trackForm=response.data;
        this.checkOpen = true;
        this.checkTitle = "就业数据核实";

        //判断是否就业
        console.log(response.data.trackDetail.statusNames+"----------");
        //如果未就业则隐藏 否则显示
        if(response.data.trackDetail.statusNames.includes("正常就业")){
            this.isObtain=true;
          //就业薪资
          this.$set(this.checkForm,'obtainSalary',response.data.trackDetail.obtainSalary);
          //就业城市
          this.$set(this.checkForm,'employmentCity',response.data.trackDetail.obtainCity);
          //就业企业
          this.$set(this.checkForm,'employmentCompany',response.data.trackDetail.enterpriseName);
          //公司地址
          this.$set(this.checkForm,'companyAddress',response.data.trackDetail.companyAddress);
          // 就业岗位
          this.$set(this.checkForm,'postName',response.data.trackDetail.postName);
          //入职时间
          this.$set(this.checkForm,'entryTime',response.data.trackDetail.obtainTime);
          //岗位性质
          this.$set(this.checkForm,'nature',response.data.trackDetail.nature);
        }else{
            this.isObtain=false;
          //就业薪资
          this.$set(this.checkForm,'obtainSalary',null);
          //就业城市
          this.$set(this.checkForm,'employmentCity',null);
          //就业企业
          this.$set(this.checkForm,'employmentCompany',null);
          //公司地址
          this.$set(this.checkForm,'companyAddress',null);
          // 就业岗位
          this.$set(this.checkForm,'postName',null);
          //入职时间
          this.$set(this.checkForm,'entryTime',null);
          //岗位性质
          this.$set(this.checkForm,'nature',null);
        }
        //核实方式
        this.$set(this.checkForm,'checkMethod','电话');
        //获取学生id
        this.$set(this.checkForm,'stuId',this.obtainStudentId);
        //是否一线城市
        //this.$set(this.checkForm,'isfirsttierCity',response.data.trackDetail.isfirsttierCity);
        //就业状态
        this.$set(this.checkForm,'obtainStatusA',response.data.trackDetail.obtainStatusA);
        this.$set(this.checkForm,'obtainStatusB',response.data.trackDetail.obtainStatusB);
        this.$set(this.checkForm,'obtainStatusC',response.data.trackDetail.obtainStatusC);

        //三级联动回显
        //this.getSelectFirst();
        this.getSelectSecond(response.data.trackDetail.obtainStatusA);
        this.getSelectThree(response.data.trackDetail.obtainStatusB);
      })
    },
    /*******************track跟踪记录******************************/
    /** 新增按钮操作 */
    trackHandleAdd() {
      this.trackReset();
      this.handleUpdate(this.obtainStudentId);
      this.trackForm.stuId=this.obtainStudentId;
      this.getSelectFirst(this.pid);//初始化就业状态一级下拉框数据
      this.trackOpen = true;
      this.getLastTrackByStuId(this.obtainStudentId);
      this.trackTitle = "添加跟踪记录";
    },
    /*
    * 根据学生id查询最新跟踪明细
    * */
    getLastTrackByStuId(stuId){
      getLastTrackByStuId(stuId).then(response=>{
        this.trackForm.stuId = stuId;
      this.trackForm.trackMethod=response.data.trackMethod;
        //就业状态
        this.$set(this.trackForm.trackDetail,'obtainStatusA',response.data.trackDetail.obtainStatusA);
        this.$set(this.trackForm.trackDetail,'obtainStatusB',response.data.trackDetail.obtainStatusB);
        this.$set(this.trackForm.trackDetail,'obtainStatusC',response.data.trackDetail.obtainStatusC);
      //三级联动回显
      if(response.data.trackDetail.obtainStatusA!=null){
        this.getSelectFirst(0);
      }
      if(response.data.trackDetail.obtainStatusB!=null){
        this.getSelectSecond(response.data.trackDetail.obtainStatusA);
      }
      if(response.data.trackDetail.obtainStatusC!=null){
        this.getSelectThree(response.data.trackDetail.obtainStatusB);
      }
      console.log(response.data.trackDetail.statusNames+"----")
      //判断状态 如果是就业 则赋值就业信息response.data.trackDetail.statusNames
        if(response.data.trackDetail.statusNames.includes("正常就业")||response.data.trackDetail.statusNames.includes("已就业")){
          this.trackForm.isZcjyShow=true;
          this.trackForm.isFhShow=false;
          this.trackForm.isYwShow=false;
          this.isObtain=true;

          //就业城市
          this.$set(this.trackForm.trackDetail,'obtainCity',response.data.trackDetail.obtainCity);
          //就职企业
          this.$set(this.trackForm.trackDetail,'enterpriseName',response.data.trackDetail.enterpriseName);
          //公司地址
          this.$set(this.trackForm.trackDetail,'companyAddress',response.data.trackDetail.companyAddress);
          //就职岗位
          this.$set(this.trackForm.trackDetail,'postName',response.data.trackDetail.postName);
          //转正薪资
          this.$set(this.trackForm.trackDetail,'obtainSalary',response.data.trackDetail.obtainSalary);
          //岗位性质
          this.$set(this.trackForm.trackDetail,'nature',response.data.trackDetail.nature);
          //入职时间
          this.$set(this.trackForm.trackDetail,'obtainTime',response.data.trackDetail.obtainTime);
          //是否一线城市
          //this.$set(this.trackForm.trackDetail,'isfirsttierCity',response.data.trackDetail.isfirsttierCity);

        }else if(!response.data.trackDetail.statusNames.includes("返回")&&(response.data.trackDetail.statusNames.includes("未就业")||response.data.trackDetail.statusNames.includes("以往"))){
          //判断状态 如果是未就业或者以往 则赋值未就业或者以往信息
          this.trackForm.isZcjyShow=false;
          this.trackForm.isFhShow=false;
          this.trackForm.isYwShow=true;
          this.isObtain=false;

          //置空就业信息
          //就业城市
          this.$set(this.trackForm.trackDetail,'obtainCity',null);
          //就职企业
          this.$set(this.trackForm.trackDetail,'enterpriseName',null);
          //公司地址
          this.$set(this.trackForm.trackDetail,'companyAddress',null);
          //就职岗位
          this.$set(this.trackForm.trackDetail,'postName',null);
          //转正薪资
          this.$set(this.trackForm.trackDetail,'obtainSalary',null);
          //岗位性质
          this.$set(this.trackForm.trackDetail,'nature',null);
          //入职时间
          this.$set(this.trackForm.trackDetail,'obtainTime',null);


          //简历投递数
          this.$set(this.trackForm.trackDetail,'submittedNumber',response.data.trackDetail.submittedNumber);
          //邀约公司数
          this.$set(this.trackForm.trackDetail,'invitationNumber',response.data.trackDetail.invitationNumber);
          //面试量
          this.$set(this.trackForm.trackDetail,'interviewVolume',response.data.trackDetail.interviewVolume);
          //面试次数
          this.$set(this.trackForm.trackDetail,'interviewNumber',response.data.trackDetail.interviewNumber);
          //offer数量
          this.$set(this.trackForm.trackDetail,'offerNumber',response.data.trackDetail.offerNumber);


        }else if(response.data.trackDetail.statusNames.includes("返回")){
          //判断状态 如果是返回 则赋值返回信息
          this.trackForm.isZcjyShow=false;
          this.trackForm.isFhShow=true;
          this.trackForm.isYwShow=false;
          this.isObtain=false;

          //置空就业信息
          //就业城市
          this.$set(this.trackForm.trackDetail,'obtainCity',null);
          //就职企业
          this.$set(this.trackForm.trackDetail,'enterpriseName',null);
          //公司地址
          this.$set(this.trackForm.trackDetail,'companyAddress',null);
          //就职岗位
          this.$set(this.trackForm.trackDetail,'postName',null);
          //转正薪资
          this.$set(this.trackForm.trackDetail,'obtainSalary',null);
          //岗位性质
          this.$set(this.trackForm.trackDetail,'nature',null);
          //入职时间
          this.$set(this.trackForm.trackDetail,'obtainTime',null);

        }
      })
    },
    // 取消按钮
    trackCancel() {
      this.handleUpdate(this.obtainStudentId);
      this.trackOpen = false;
      this.trackReset();
    },
    checkCancel() {
      this.handleUpdate(this.obtainStudentId);
      this.checkOpen = false;
      this.checkReset();
    },
    checkReset(){
      this.checkForm={
        stuId: null,
        trackId: null,
        trackDetailId: null,
        checkMethod: null,
        nature:null,
        isfirsttierCity:null,
        entryTime: null,
        employmentCity: null,
        employmentCompany: null,
        companyAddress: null,
        obtainStatusA:null,
        obtainStatusB:null,
        obtainStatusC:null,
        obtainSalary:null,
        reviewedResult:"0",
        followUpRecording:null,
        followUpRealName:null,
        schoolRecord:null,
        student:{
          stuName:null
        },
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null
      }
    },
    // 表单重置
    trackReset() {
      this.trackForm = {
        isZcjyShow:false,
        isFhShow:false,
        isYwShow:false,
        trackId: null,
        stuId: null,
        trackTime: null,
        trackMethod: null,
        trackDetail:{
          obtainStatusA:null,
          obtainStatusB:null,
          obtainStatusC:null,
          probationSalary:null,
          obtainSalary:null,
          interviewRecording:null,
          followUpRecording:null,
          submittedNumber:null,
          invitationNumber:null,
          interviewVolume:null,
          interviewNumber:null,
          offerNumber:null,
          obtainCity:null,
          postName:null,
          enterpriseName:null,
          student:{
            stuName:null
          }
        },
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null,
      };
    },

    // 一级联动
    firstColumnChangeAction(e) {
      this.$set(this.trackForm, 'trackDetail.obtainStatusB', null);
      this.trackForm.trackDetail.obtainStatusB='';

      this.$set(this.trackForm, 'trackDetail.obtainStatusC', null);
      this.trackForm.trackDetail.obtainStatusC='';
      console.log(e+"加载一级下拉数据")
      // 初始化二三级的列表
      //根据一级下拉框选择的id当做二级下拉框的父节点id查询二级下拉框的id
      this.getSelectSecond(e);
    },
    // 二级联动
    secondColumnChangeAction(e) {
      console.log("根据一级下拉id：" + e + "加载二级下拉数据")
      this.$set(this.trackForm, 'trackDetail.obtainStatusC', null);
      this.trackForm.trackDetail.obtainStatusC='';
      // 清空三级下拉
      // 根据二级下拉框选择的id当做三级下拉框的父节点id查询三级下拉框的id
      this.getSelectThree(e);
    },
    // 一级联动
    firstColumnChangeActions(e) {
      this.$set(this.checkForm, 'trackDetail.obtainStatusC', null);
      this.$set(this.checkForm, 'trackDetail.obtainStatusB', null);
      this.checkForm.obtainStatusC='';
      this.checkForm.obtainStatusB='';
      console.log("加载一级下拉数据")
      // 初始化二三级的列表
      //根据一级下拉框选择的id当做二级下拉框的父节点id查询二级下拉框的id
      this.getSelectSecond(e);
    },
    // 二级联动
    secondColumnChangeActions(e) {
      console.log("根据一级下拉id：" + e + "加载二级下拉数据")
      this.$set(this.checkForm, 'trackDetail.obtainStatusC', null);
      this.checkForm.obtainStatusC='';
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

    /*getSelectFirstById(id) {
      getSelectFirstById(id).then(Response => {
        this.firstColumnList = Response.data.statuss;
      })
    },
    getSelectSecondById(id) {
      getSelectSecondById(id).then(Response => {
        this.secondColumnList = Response.data.statuss;
      })
    },
    getSelectThreeById(id) {
      getSelectThreeById(id).then(Response => {
        this.threeColumnList = Response.data.statuss;
      })
    },*/
    threeColumnChangeAction(val,index) {
      if(index.includes("正常就业")){
        this.trackForm.isZcjyShow=true;
        this.trackForm.isFhShow=false;
        this.trackForm.isYwShow=false;
        this.isObtain=true;
      }else if(index.includes("以往")){
        this.trackForm.isZcjyShow=false;
        this.trackForm.isFhShow=false;
        this.trackForm.isYwShow=true;
        this.isObtain=false;

        //置空就业信息
        //就业城市
        this.$set(this.trackForm.trackDetail,'obtainCity',null);
        //就职企业
        this.$set(this.trackForm.trackDetail,'enterpriseName',null);
        //公司地址
        this.$set(this.trackForm.trackDetail,'companyAddress',null);
        //就职岗位
        this.$set(this.trackForm.trackDetail,'postName',null);
        //转正薪资
        this.$set(this.trackForm.trackDetail,'obtainSalary',null);
        //岗位性质
        this.$set(this.trackForm.trackDetail,'nature',null);
        //入职时间
        this.$set(this.trackForm.trackDetail,'obtainTime',null);
      }else if(!index.includes("返回")&&index.includes("未就业")){
        this.trackForm.isZcjyShow=false;
        this.trackForm.isFhShow=false;
        this.trackForm.isYwShow=true;
        this.isObtain=false;


        //置空就业信息
        //就业城市
        this.$set(this.trackForm.trackDetail,'obtainCity',null);
        //就职企业
        this.$set(this.trackForm.trackDetail,'enterpriseName',null);
        //公司地址
        this.$set(this.trackForm.trackDetail,'companyAddress',null);
        //就职岗位
        this.$set(this.trackForm.trackDetail,'postName',null);
        //转正薪资
        this.$set(this.trackForm.trackDetail,'obtainSalary',null);
        //岗位性质
        this.$set(this.trackForm.trackDetail,'nature',null);
        //入职时间
        this.$set(this.trackForm.trackDetail,'obtainTime',null);
      }else if(index.includes("返回")){
        this.trackForm.isZcjyShow=false;
        this.trackForm.isFhShow=true;
        this.trackForm.isYwShow=false;
        this.isObtain=false;

        //置空就业信息
        //就业城市
        this.$set(this.trackForm.trackDetail,'obtainCity',null);
        //就职企业
        this.$set(this.trackForm.trackDetail,'enterpriseName',null);
        //公司地址
        this.$set(this.trackForm.trackDetail,'companyAddress',null);
        //就职岗位
        this.$set(this.trackForm.trackDetail,'postName',null);
        //转正薪资
        this.$set(this.trackForm.trackDetail,'obtainSalary',null);
        //岗位性质
        this.$set(this.trackForm.trackDetail,'nature',null);
        //入职时间
        this.$set(this.trackForm.trackDetail,'obtainTime',null);
      }
    },
    checkSubmitForm() {
      this.handleUpdate(this.obtainStudentId);
      this.$refs["checkForm"].validate(valid => {
        if (valid) {
          addVerification(this.checkForm).then(response => {
              this.$modal.msgSuccess("核实完成");
              this.checkOpen = false;
              this.getTrackList();
            });
        }
      });
    },
    /** 提交按钮 */
    trackSubmitForm() {
      this.handleUpdate(this.obtainStudentId);
      this.$refs["trackForm"].validate(valid => {
        if (valid) {
          if (this.form.trackId != null) {
            updateTrack(this.trackForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.trackOpen = false;
              this.getTrackList();
            });
          } else {
            addTrack(this.trackForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.trackOpen = false;
              this.getTrackList();
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
