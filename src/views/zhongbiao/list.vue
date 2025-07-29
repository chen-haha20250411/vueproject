<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <!-- <el-input v-model="q.roleName" style="width:200px" placeholder="角色名称" class="filter-item"/>-->
        <el-input v-model="q.projectNo" style="width:200px" placeholder="项目编号" class="filter-item"/>
        <el-input v-model="q.customer" style="width:200px" placeholder="客户名称" class="filter-item"/>
        <el-input v-model="q.noticeType" style="width:200px" placeholder="招标类型" class="filter-item"/>
        <el-input v-model="q.title" style="width:200px" placeholder="项目标题" class="filter-item"/>
        <el-input v-model="q.winnerPrincipal" style="width:200px" placeholder="供应商名称" class="filter-item"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button v-has="'add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">{{ $t('table.add') }}</el-button>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleResetQuery()" >重置</el-button>
		
        
      </div>
      <el-table v-loading="listLoading"  :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;height:auto;">
		<el-table-column label="中标日期"  width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.publishDate }}</span>
          </template>
        </el-table-column>
		<el-table-column label="项目编号" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.projectNo }}</span>
          </template>
        </el-table-column>
		<el-table-column label="客户名称" width="210">
          <template slot-scope="scope">
            <span>{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
		<el-table-column label="招标类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.noticeType }}</span>
          </template>
        </el-table-column>
		<el-table-column label="项目标题" width="180" >
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
		<!-- <el-table-column label="货品名称" width="120" >
          <template slot-scope="scope">
            <span>{{ scope.row.productLabels }}</span>
          </template>
        </el-table-column> -->
		<el-table-column label="合计金额" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.winnerAmount }}</span>
          </template>
        </el-table-column>
    <el-table-column label="详细内容" width="90">
      <template slot-scope="scope">
        <a
          :href="`#/zhongbiao/detail/${scope.row.id}`"
          target="_blank"
          style="color: #409EFF; cursor: pointer;">
         查看详情
        </a>
      </template>
    </el-table-column>
		<el-table-column label="供应商名称" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.winnerPrincipal }}</span>
          </template>
        </el-table-column>
		<!-- <el-table-column label="招标链接" width="85">
          <template slot-scope="scope">
            <a :href="scope.row.html_url" target="_blank" v-if="scope.row.html_url">查看链接</a>  
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('table.actions')" align="center" width="160" class-name="small-padding fixed-width">
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
			<el-form-item label="中标日期" prop="publishDate">
                <el-input v-model="showdata.publishDate" placeholder="请输入中标日期"/>
       	 	</el-form-item>
			<el-form-item label="项目编号" prop="projectNo">
                <el-input v-model="showdata.projectNo" placeholder="请输入项目编号"/>
       	 	</el-form-item>
			<el-form-item label="客户名称" prop="customer">
                <el-input v-model="showdata.customer" placeholder="请输入招标的客户名称"/>
       	 	</el-form-item>
			<el-form-item label="招标类型" prop="noticeType">
                <el-input v-model="showdata.noticeType" placeholder="请输入招标的类型"/>
       	 	</el-form-item>
			<el-form-item label="项目标题" prop="title">
                <el-input v-model="showdata.title" placeholder="请输入招标项目的标题"/>
       	 	</el-form-item>
			<el-form-item label="货品名称" prop="productLabels">
                <el-input v-model="showdata.productLabels" placeholder="请输入中标货品的名称，可能较长，使用 TEXT 类型"/>
       	 	</el-form-item>
			<el-form-item label="合计金额" prop="winnerAmount">
                <el-input v-model="showdata.winnerAmount" placeholder="请输入中标合计金额，保留两位小数"/>
       	 	</el-form-item>
			<el-form-item label="详细内容" prop="remark">
                <el-input v-model="showdata.html_content" placeholder="请输入相关备注信息，可能较长，使用 TEXT 类型"/>
       	 	</el-form-item>
			<el-form-item label="供应商名称" prop="winnerPrincipal">
                <el-input v-model="showdata.winnerPrincipal" placeholder="请输入中标的供应商名称"/>
       	 	</el-form-item>
            <el-form-item label="中标链接" prop="html_url">
              <el-input v-model="showdata.html_url" placeholder="请输入中标链接" />
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
import * as api from '@/api/zhongbiao/list'
import * as tools from '@/utils/rulestools.js'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'menu_185',
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
      this.showdata = {}
      //this.reload()
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
