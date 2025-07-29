<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <el-input v-model="q.roleName" style="width:200px" placeholder="角色名称" class="filter-item"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add" v-has="'add'">{{ $t('table.add') }}</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;height:auto;"
        >

         <el-table-column label="角色名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="添加人" >
          <template slot-scope="scope">
            <span>{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
       
      <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" >
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button  size="mini" type="success" @click="update(scope.row.roleInfoId)"  v-has="'edit'">授权</el-button>
            <el-button v-if="scope.row.roleInfoId != 1 && scope.row.roleInfoId != 3 && scope.row.roleInfoId != 4" size="mini" type="danger" @click="handleDelete(scope.row.roleInfoId)" v-has="'del'">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination style="float:right" v-show="total>0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :page.sync="q.currPageNo" :limit.sync="q.limit" @pagination="getList" />
  </div>
    <el-card v-show="!showList">
        <span>{{title}}</span>
        <el-row>
            <el-col :span="6" v-show="isView"> 
	        	<template>
	        		<ul id="roleTree" class="ztree"></ul>
	        	</template>
	        </el-col>
            <el-col :span="18" >
            <el-form ref="formValidate" :model="showdata" :rules="ruleValidate" label-width="120">
                <el-form-item label="角色名称" prop="realName">
                        <el-input v-model="showdata.roleName" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item label="角色描述" prop="remark">
                    <el-input v-model="showdata.remark" placeholder="角色描述"/>
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
  </div>
</template>

<script>
import { fetchList,fetchdelete ,getInfo,saveOrupdate,updateSave} from '@/api/role/list'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
//引入ztree,已在main.js引入jqeruy
import '@/plugins/zTree/js/jquery.ztree.core.min.js'
import '@/plugins/zTree/js/jquery.ztree.excheck.min.js'
import '@/plugins/ztree/css/zTreeStyle/zTreeStyle.css'


export default {
  name: 'oper',
  components: { Pagination },
  data() {
    return {
      tableHeight: window.innerHeight  - 380,//设置当前table的高度
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      q: {
        currPageNo: 1,
        limit: 10,
        roleName: '',
      },
      showList: true,
      title: null,
      showdata: {},
      ruleValidate: {
        roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ]
      },
      isView:false,
      treeData:[],
      //设置ztree
      setting : {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            data: {
            simpleData: {
                enable: true
            }
         }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.q).then(response => {
        this.list = response.data.list
        //console.log(JSON.stringify(response))
        this.total = response.data.total

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
    this.$nextTick(() => {
        this.$refs['formValidate'].clearValidate()
      })
    },
    update(id) {
        this.showList = false;
        this.title = "权限";
		this.isView=true;
        this.getInfo(id);
        this.treeData=[];
        this.$nextTick(() => {
        this.$refs['formValidate'].clearValidate()
      })
    },
    getInfo(id){
      getInfo(id).then(response => {
        this.showdata = response.data.roleInfo;
        //console.log( JSON.stringify(response.data.rootList))
        $.fn.zTree.init($("#roleTree"), this.setting, response.data.rootList);
      });
    },
    reload() {
	  this.showList = true;
	  this.isView=false;
      this.q.currPageNo = 1
      this.getList()  
    },
    updateSave() {
        let treeObj = $.fn.zTree.getZTreeObj("roleTree");
        let nodes = treeObj.getCheckedNodes(true);
        if(nodes.length == 0){
            alert("请选择权限");
            return;
        }
        let msg = "";
        for (let i = 0; i < nodes.length; i++) {
            msg += nodes[i].name+"-"+nodes[i].id+"-"+nodes[i].pId+"\n";
        }
      updateSave(this.showdata,msg).then(response => {
        this.$notify({title: '成功',message: '授权成功',type: 'success', duration: 2000})
        this.reload();
      })
    },
    saveOrUpdate() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          saveOrupdate(this.showdata).then(response => {
              this.$notify({title: '成功',message: '创建成功',type: 'success', duration: 2000})
              this.reload();
            })
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
        }
        this.reload();
    },
    handleSubmit() {
        if(this.isView){
            this.updateSave();
        }else{
            this.saveOrUpdate();
        }
    },
    handleReset() {
        this.reload();
    }
  }
}
</script>
