<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <!-- <el-input v-model="q.roleName" style="width:200px" placeholder="角色名称" class="filter-item"/>-->
        <el-input v-model="q.projectNumber" style="width:200px" placeholder="项目编号" class="filter-item"/>
        <el-input v-model="q.projectName" style="width:300px" placeholder="项目名称" class="filter-item"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button v-has="'add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">{{ $t('table.add') }}</el-button>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleResetQuery()" >重置</el-button>
		
        
      </div>
      <el-table v-loading="listLoading"  :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;height:auto;">
    <el-table-column label="发布日期"  width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.publishDate }}</span>
          </template>
        </el-table-column>
    <el-table-column label="项目编号" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.projectNumber }}</span>
          </template>
        </el-table-column>
		<el-table-column label="项目名称" width="700">
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
		
		<!-- <el-table-column label="内容" >
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column> -->
		<!-- <el-table-column label="项目Id" >
          <template slot-scope="scope">
            <span>{{ scope.row.projectId }}</span>
          </template>
        </el-table-column> -->
		<!-- <el-table-column label="总内容" >
          <template slot-scope="scope">
            <span>{{ scope.row.totalContent }}</span>
          </template>
        </el-table-column> -->
		<!-- <el-table-column label="数据来源" >
          <template slot-scope="scope">
            <span>{{ scope.row.dataSource }}</span>
          </template>
        </el-table-column> -->
      <el-table-column label="详细内容" width="90" align="center">
      <template slot-scope="scope">
        <a
          :href="scope.row.htmlUrl"
          target="_blank"
          style="color: #409EFF; cursor: pointer;">
         查看详情
        </a>
      </template>
    </el-table-column>    
		<!-- <el-table-column label="网页链接" width="350">
          <template slot-scope="scope">
            <a :href="scope.row.htmlUrl" target="_blank" class="buttonText">{{ scope.row.htmlUrl }}</a>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('table.actions')" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="update(scope.row.id)" v-has="'edit'">{{ $t('table.edit') }}</el-button>
            <el-button  size="mini" type="danger" @click="handleDelete(scope.row.id)" v-has="'del'">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination style="float:right" v-show=" total>0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :page.sync="q.currPageNo" :limit.sync="q.limit" @pagination="getList" />
	</div>
    <el-card v-show="!showList">
      <span>{{title}}</span>
      <el-row>
        <el-col :span="18" >
          <el-form ref="formValidate" :model="showdata" :rules="ruleValidate" label-width="120">
      <el-form-item label="发布日期" prop="publishDate" >
                <el-input v-model="showdata.publishDate" placeholder="请输入发布日期"/>
       	 	</el-form-item>      
			<el-form-item label="项目编号" prop="projectNumber" >
                <el-input v-model="showdata.projectNumber" placeholder="请输入项目编号"/>
       	 	</el-form-item>
			<el-form-item label="项目名称" prop="projectName">
                <el-input v-model="showdata.projectName" placeholder="请输入项目名称"/>
       	 	</el-form-item>
			<!-- <el-form-item label="内容" prop="content">
                <el-input v-model="showdata.content" placeholder="请输入内容"/>
       	 	</el-form-item> -->
			<!-- <el-form-item label="项目Id" prop="projectId">
                <el-input v-model="showdata.projectId" placeholder="请输入项目Id"/>
       	 	</el-form-item>
			<el-form-item label="总内容" prop="totalContent">
                <el-input v-model="showdata.totalContent" placeholder="请输入总内容"/>
       	 	</el-form-item> -->
			<!-- <el-form-item label="数据来源" prop="dataSource">
                <el-input v-model="showdata.dataSource" placeholder="请输入数据来源"/>
       	 	</el-form-item> -->
			<el-form-item label="网页链接" prop="htmlUrl">
                <el-input v-model="showdata.htmlUrl" placeholder="请输入网页链接"/>
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
import * as api from '@/api/biddingInfo/list'
import * as tools from '@/utils/rulestools.js'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'menu_184',
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
        limit: 25,
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      api.fetchList(this.q).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val){//页面显示条数变化
      this.limit=val
      this.getList()
    },
    handleCurrentChange(val){//页码数变化时
      this.currPageNo=val
      this.getList()
    },
    query() {
      this.reload()
    },
    add() {
	  this.showList = false
	  this.title = "新增"
	  this.showdata = {}
	  this.isView=false
    },
    update(id) {
	  this.showList = false
	  this.title = "修改"
	  this.isView=true
	  this.getInfo(id)
    },
    getInfo(id){
      api.getInfo(id).then(response => {
        this.showdata = response.data
      })
    },
    reload() {
	  this.showList = true
	  this.isView=false
      this.q.currPageNo = 1
      this.getList()  
    },
    reload_nowpage() {
	  this.showList = true
	  this.isView=false
    this.q.currPageNo = this.q.currPageNo
    this.getList()  
    },
    saveOrUpdate() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          api.saveOrupdate(this.showdata).then(response => {
            this.$notify({title: '成功',message: response.msg,type: 'success', duration: 2000})
            this.reload()
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
        api.fetchdelete(id).then(response => {
          this.reload_nowpage()
        })
      }).catch(() => {
        //几点取消的提示
      })
    },
    reloadSearch() {
      this.q = {
        roleName: '',
      }
      this.reload()
    },
    handleSubmit() {
      this.saveOrUpdate()
    },
    handleReset() {
      //this.showdata = {}
      this.reload()
    },
    handleResetQuery() {
      this.q = {
        roleName: '',
      }
      this.reload()
    }
  }
}
</script>
