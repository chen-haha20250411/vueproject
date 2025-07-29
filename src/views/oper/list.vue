<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <el-input v-model="q.loginName" style="width:200px" class="filter-item" placeholder="登录名称"/>

        <el-select v-if="operRoleinfoId == '1' ||operRoleinfoId == '3'" v-model="q.roleinfoId" style="width:200px" class="filter-item" placeholder="选择角色">
          <el-option value="">全部</el-option>
          <el-option v-for="item in roleData" :value="item.roleInfoId" :label="item.roleName" :key="item.roleInfoId">{{item.roleName}}</el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" v-has="'add'" @click="add">{{ $t('table.add') }}</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        >

        <el-table-column label="登录名" >
          <template slot-scope="scope">
            <span>{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="真实姓名" >
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属角色" >
          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
            <span v-if="scope.row.oper_code=='2'">(免密)</span>
          </template>
        </el-table-column>

        <el-table-column label="电话" >
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.phoneTel }}</span> -->
            <span>{{scope.row.phoneTel!=null&&fieldbool?scope.row.phoneTel.replace(/^(.{3})(?:\w+)(.{3})$/, "\$1****\$2"):scope.row.phoneTel}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <i class="el-icon-view" v-show="scope.row.phoneTel!=null" @click="fieldbool=!fieldbool"></i>
          </template>
        </el-table-column>

        <el-table-column label="EMAIL" >
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>

        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" >
          <template slot-scope="scope">
            <span>{{ scope.row.editTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="370" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="update(scope.row.operatorId)" v-has="'edit'">{{ $t('table.edit') }}</el-button>
            <el-button  size="mini" type="success" @click="sq(scope.row.operatorId)"  v-has="'sq'">授权</el-button>
            <!-- <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
            </el-button> -->
            <el-button v-if="scope.row.operatorId != '1'" size="mini" type="danger" @click="handleDelete(scope.row.operatorId)" v-has="'del'">{{ $t('table.delete') }}
            </el-button>
            <el-button type="success" size="mini" @click="removeLimit(scope.row.operatorId)" v-has="'edit'" style="padding: 7px 6px;">解除限制</el-button>
            <el-button type="warning" size="mini" @click="resetPassword(scope.row.operatorId)" v-has="'edit'" style="padding: 7px 6px;">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination  style="float:right" v-show="total>0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :page.sync="q.currPageNo" :limit.sync="q.limit" @pagination="getList" />
  </div>


    <el-card v-show="!showList&&!issq">
            <span>{{title}}</span>
            <el-row>
              <el-col :span="24" >
                <el-form ref="formValidate" :model="showdata" :rules="ruleValidate" label-width="120">
                    <el-form-item label="真实姓名" prop="realName">
                        <el-input v-model="showdata.realName" placeholder="请输入真实姓名"/>
                    </el-form-item>
                    <el-form-item label="登录名" prop="loginName">
                        <el-input v-model="showdata.loginName" placeholder="请输入登录名"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="loginPwd">
                        <el-input type="password" v-model="showdata.loginPwd" placeholder="请输入密码"/>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="reploginPwd">
                        <el-input type="password" v-model="showdata.reploginPwd" placeholder="请输入确认密码"/>
                    </el-form-item>
                    <el-form-item label="电话" prop="phoneTel">
                        <el-input v-model="showdata.phoneTel" placeholder="请输入电话"/>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="showdata.email" placeholder="请输入Email"/>
                    </el-form-item>
                    <!-- <el-form-item v-show="showdata.roleinfoId==4" label="供应商编码" prop="oper_code">
                        <el-input v-model="showdata.oper_code" :maxlength="5" placeholder="请输入供应商编码" onkeyup="value=value.replace(/[^\w]/g,'')"/>
                    </el-form-item> -->
                    <el-form-item v-if="showdata.roleinfoId==4" label="企业名称" prop="companyName">
                        <el-input v-model="showdata.companyName" placeholder="请输入企业名称"/>
                    </el-form-item>
                    <el-form-item v-if="showdata.roleinfoId==4" label="信用代码" prop="unifiedCode">
                        <el-input v-model="showdata.unifiedCode" placeholder="请输入信用代码"/>
                    </el-form-item>
                    <el-form-item v-if="showdata.roleinfoId==4" label="法人姓名" prop="corporate">
                        <el-input v-model="showdata.corporate" placeholder="请输入法人姓名"/>
                    </el-form-item>
                    <el-form-item v-if="showdata.roleinfoId==4" label="法人手机号" prop="phoneNo">
                        <el-input v-model="showdata.phoneNo" placeholder="请输入法人手机号"/>
                    </el-form-item>
                    <el-form-item v-if="showdata.roleinfoId==4" label="经办人姓名" prop="jbrxm">
                        <el-input v-model="showdata.jbrxm" placeholder="请输入经办人姓名"/>
                    </el-form-item>
                    <el-form-item v-if="showdata.roleinfoId==4" label="经办人联系方式" prop="jbrphone">
                        <el-input v-model="showdata.jbrphone" placeholder="请输入经办人联系方式"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  size="mini" @click="handleSubmit()">提交</el-button>
                        <el-button type="warning"  size="mini" @click="reload()" style="margin-left: 8px">返回</el-button>
                        <el-button  size="mini" @click="handleReset()" style="margin-left: 8px" v-show="!isView">重置</el-button>
                    </el-form-item>
                </el-form>
              </el-col>
          </el-row>
      </el-card>

      <el-card v-show="!showList&&issq">
            <span slot="title">{{title}}</span>
            <el-row>
              <el-col :span="24" >
                <el-form ref="roleValidate" :model="showdata" :rules="roleruleValidate" label-width="120">
                  <el-form-item>
                    <span>授权人员：{{showdata.loginName}}</span>
                    </el-form-item>
                    <el-form-item label="当前角色" prop="roleinfoId">
                      <el-select v-model="showdata.roleinfoId" style="width:200px" placeholder="选择角色">
                      <el-option v-for="item in roleData" :value="item.roleInfoId" :label="item.roleName"  :key="item.roleInfoId" >{{item.roleName}}</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" size="mini" @click="updateSave()">提交</el-button>
                        <el-button type="warning" size="mini" @click="reload()" style="margin-left: 8px">返回</el-button>
                    </el-form-item>
                </el-form>
              </el-col>
          </el-row>
      </el-card>

  </div>
</template>

<script>
import { fetchList,fetchroleinfoAll,fetchdelete ,getInfo,saveOrupdate,updateSave,updateOper,resetPassword,removeLimit} from '@/api/oper/list'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'oper',
  components: { Pagination },
  data() {
    return {
      tableHeight: window.innerHeight  - 380,//设置当前table的高度
      tableKey: 0,
      list: null,//用于展示list数据
      total: 0,//数据总条数
      listLoading: true,//是否有loading画面
      q: {
        currPageNo: 1,//当前第几页
        limit: 10,//当前一页显示多少条
        loginName: '',//查询条件
        roleinfoId: '',
      },
      showList: true,//用于判断是否显示列表
      title: null,//用于显示当前那个标题
      roleruleValidate:{
          roleinfoId:[
            {required: true, message: '角色不能为空', trigger:['change','blur']}
          ]
      },
      ruleValidate: {//新增需要满足的条件
        loginName: [
          {required: true, message: '登录名称不能为空', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '真实姓名不能为空', trigger: 'blur'}
        ],
        phoneTel: [
          {required: true, message: '电话号码不能为空', trigger: 'blur'},
          ,
          {
            validator: function(rule, value, callback) {
              if (/^1\d{10}$/.test(value) == false) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        emailemail: [
          {
            validator: function(rule, value, callback) {
              if (
                /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                  value
                ) == false
              ) {
                callback(new Error("邮箱格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        companyName: [
          {required: true, message: '企业名称不能为空', trigger: 'blur'}
        ],
        unifiedCode: [
          {required: true, message: '信用代码不能为空', trigger: 'blur'}
        ],
        corporate: [
          {required: true, message: '法人姓名不能为空', trigger: 'blur'}
        ],
        phoneNo: [
          {required: true, message: '法人手机号不能为空', trigger: 'blur'}
        ],
        jbrxm: [
          {required: true, message: '经办人姓名不能为空', trigger: 'blur'}
        ],
        jbrphone: [
          {required: true, message: '经办人联系方式不能为空', trigger: 'blur'}
        ],
        
      },
      isView:false,//用于判断是否显示页面
      roleData:{},//当前角色数据
      issq:false,//用于判断是否显示授权页面
      showdata:{},//暂存用户信息 新增修改授权均用此,
      operRoleinfoId:null,
      fieldbool:true
    }
  },
  created() {
    this.getList()
    this.getroleinfoAll()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.q).then(response => {
        this.list = response.data.list
        //console.log(JSON.stringify(response))
        this.total = response.data.total
        this.operRoleinfoId = response.data.queryParams.operRoleinfoId
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleSizeChange(val){//页面显示条数变化
      this.limit=val
      getList();
    },
    handleCurrentChange(val){//页码数变化时
        this.currPageNo=val
        getList();
    },
    getroleinfoAll(){
     fetchroleinfoAll().then(response => {
      // console.log(JSON.stringify(response))
      this.roleData=response.data
     })
    },
    query() {
      this.reload();
    },
		add() {
			this.showList = false;
			this.title = "新增";
			this.showdata = {};
			this.isView=false;
      this.issq=false;
      this.$nextTick(() => {
         this.$refs['formValidate'].clearValidate()
      })
		},
		update(id) {
			this.showList = false;
      this.title = "修改";
			this.isView=true;
      this.getInfo(id);
      this.issq=false;
      this.$nextTick(() => {
        this.$refs['formValidate'].clearValidate()
      })
		},
		sq(id) {
			this.showList = false;
      this.title = "权限";
			this.isView=true;
      this.getInfo(id);
      this.issq=true;
      this.$nextTick(() => {
        this.$refs['roleValidate'].clearValidate()
      })
    },
    getInfo(id){
      getInfo(id).then(response => {
        this.showdata = response.data;
        this.showdata.loginPwd="";
        this.showdata.reploginPwd="";
        this.showdata = JSON.parse(JSON.stringify(this.showdata))
      });
    },
    reload() {
			this.showList = true;
			this.isView=false;
			this.issq=false;
      this.q.currPageNo = 1
      this.getList()
    },
    updateSave() {

        this.$refs['roleValidate'].validate((valid) => {
        if (valid) {
            updateSave(this.showdata).then(response => {
              this.$notify({title: '成功',message: '授权成功',type: 'success', duration: 2000})
              this.reload();
            })
        }
        });


    },
    saveOrUpdate() {
      if (!this.issq) {
        if (this.showdata.loginPwd !=''&& this.showdata.loginPwd !=null) {
          var regLetter = /[A-Za-z]/;
          var regNum = /[0-9]/;
          var complex = 0
          // eslint-disable-next-line no-undef
          if (regLetter.test(this.showdata.loginPwd)) {
            ++complex
          }
          if (regNum.test(this.showdata.loginPwd)) {
            ++complex
          }
          if ( this.showdata.loginPwd.length < 10 || complex < 2) {
            this.$notify({title: '失败',message: '密码长度不能小于10位，至少包含数字/字母两种组合',type: 'error', duration: 2000})
            return
          }
          if (this.showdata.reploginPwd != this.showdata.loginPwd) {
            this.$message.error('两次输入密码不一致');
            return;
          }
        }
      }
      // console.log(this.showdata.roleinfoId==4)
      // if(this.showdata.roleinfoId==4){
      //   if(this.showdata.companyName ==null ||this.showdata.companyName ==''){
      //     this.$notify({title: '提示',message: '企业名称必填',type: 'error', duration: 2000});
      //     return false;
      //   }
      //   if(this.showdata.unifiedCode ==null ||this.showdata.unifiedCode ==''){
      //     this.$notify({title: '提示',message: '信用代码必填',type: 'error', duration: 2000});
      //     return false;
      //   }
      //   if(this.showdata.corporate ==null ||this.showdata.corporate ==''){
      //     this.$notify({title: '提示',message: '法人姓名必填',type: 'error', duration: 2000});
      //     return false;
      //   }
      //   if(this.showdata.phoneNo ==null ||this.showdata.phoneNo ==''){
      //     this.$notify({title: '提示',message: '法人手机号必填',type: 'error', duration: 2000});
      //     return false;
      //   }
      // }
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.showdata.failTimes = ''
          if ( this.showdata.operatorId != null && this.showdata.operatorId != '') {
            if(this.showdata.roleinfoId == null ) {
              delete this.showdata['roleinfoId']
            }
            for (var key in this.showdata) {
              if (this.showdata[key] ==null) {
                this.showdata[key] = ''
              }
            }
            updateOper(this.showdata).then(response => {
                this.$notify({ title: '成功', message: response.msg, type: 'success', duration: 2000 })
                this.reload()

            })
          } else {
            for (var key in this.showdata) {
              if (this.showdata[key] ==null) {
                this.showdata[key] = ''
              }
            }
            saveOrupdate(this.showdata).then(response => {

                this.$notify({ title: '成功', message: response.msg, type: 'success', duration: 2000 })
                this.reload()

            })
          }
        }
      })
    },
    handleDelete(id) {
			this.$confirm('确定要删除选中的记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
      }).then(() => {
          fetchdelete(id).then(response => {
            this.reload();
         })
			}).catch(() => {
        //几点取消的提示
      });
		},
    reloadSearch() {
        this.q = {
            roleName: '',
            roleinfoId:'',
        }
        this.reload();
    },
    handleSubmit(name) {
      if(this.isView&&this.issq){
        this.updateSave();
      }else{
        this.saveOrUpdate();
      }
    },
    handleReset(name) {
        this.getroleinfoAll();
        this.reload();
    },
    resetPassword(operatorId) {
      resetPassword(operatorId).then(response => {
        if(response.success){
          this.$notify({title: '成功',message: response.msg,type: 'success', duration: 2000})
        }else{
          this.$notify({title: '失败',message: response.msg,type: 'error', duration: 2000})
        }
      })
    },
    removeLimit(operatorId) {
      removeLimit(operatorId).then(response => {
        if(response.success){
          this.$notify({title: '成功',message: response.msg,type: 'success', duration: 2000})
          this.reload()
        }else{
          this.$notify({title: '失败',message: response.msg,type: 'error', duration: 2000})
        }
      })
    },
  }
}
</script>
