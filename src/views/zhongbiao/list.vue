<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <!-- 日期区间查询控件 -->
        <DatePicker
          v-model="q.dateRange"
          range
          format="YYYY-MM-DD"
          value-type="format"
          :lang="zhCN"
          placeholder="选择日期区间"
          :clearable="true"
          :editable="false"
          class="filter-item custom-date-picker"
          style="width: 220px; margin-right: 10px;"
        />
        
        <!-- <el-input v-model="q.roleName" style="width:200px" placeholder="角色名称" class="filter-item"/>-->
        <el-input v-model="q.projectNo" class="filter-item" placeholder="项目编号" style="width:180px"/>
        <el-input v-model="q.customer" class="filter-item" placeholder="客户名称" style="width:200px"/>
        <!-- <el-input v-model="q.noticeType" style="width:200px" placeholder="招标类型" class="filter-item"/> -->
        <el-input v-model="q.title" style="width:180px" placeholder="项目标题" class="filter-item"/>
        <el-input v-model="q.winnerPrincipal" style="width:200px" placeholder="供应商名称" class="filter-item"/>
        
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button v-has="'add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">{{ $t('table.add') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleResetQuery()" >重置</el-button>
      </div>
      

      
      <!-- 汇总信息显示 -->
      <div class="summary-info" v-if="list && list.length > 0">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-row">
            <i class="el-icon-info" style="color: #409EFF; margin-right: 0px;"></i>
            <span class="summary-title">汇总信息</span>
            <span class="summary-item">
              总记录数: <strong>{{ total }}</strong>条
            </span>
            <span class="summary-item">
              占比: <strong style="color: #67C23A;">{{ formatPercent(totalAmountAll, totalAmountByDate) }}</strong>
            </span>
            <span class="summary-item">
              总金额: <strong style="color: #E6A23C;">¥{{ formatAmount(totalAmountAll) }}</strong>
            </span>
            <span class="summary-item">
              时间区间总金额: <strong style="color: #E6A23C;">¥{{ formatAmount(totalAmountByDate) }}</strong>
            </span>
      
          </div>
        </el-card>
      </div>
      
      <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;height:auto;">
		<el-table-column label="中标日期" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.publishDate }}</span>
          </template>
        </el-table-column>
		<!-- <el-table-column label="项目编号" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectNo }}</span>
          </template>
        </el-table-column> -->
		<el-table-column label="客户名称" width="280" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
		<el-table-column label="招标类型" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.noticeType }}</span>
          </template>
        </el-table-column>
		<el-table-column label="项目标题" width="260" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
		<el-table-column label="合计金额" width="120" align="center">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold;">¥{{ formatAmount(scope.row.winnerAmount) }}</span>
          </template>
        </el-table-column>
    <el-table-column label="详细内容" width="90" align="center">
      <template slot-scope="scope">
        <a
          :href="`#/zhongbiao/detail/${scope.row.id}`"
          target="_blank"
          style="color: #409EFF; cursor: pointer;">
         查看详情
        </a>
      </template>
    </el-table-column>
		<el-table-column label="供应商名称" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.winnerPrincipal }}</span>
          </template>
        </el-table-column>
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
import * as tools from '@/utils/rulestools.js'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import zhCN from 'vue2-datepicker/locale/zh-cn';
export default {
  name: 'menu_185',
  components: { Pagination, DatePicker },
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
        // 修改为日期区间查询参数
        dateRange: [],
        startDate: '',
        endDate: ''
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
      zhCN, // 注册语言
      totalAmountAll: 0,
    }
  },
  watch: {
    'q.dateRange'(val) {
      if (val && val.length === 2) {
        this.q.startDate = val[0]
        this.q.endDate = val[1]
      } else {
        this.q.startDate = ''
        this.q.endDate = ''
      }
    }
  },
  computed: {
    // 计算总金额
    totalAmount() {
      if (!this.list || this.list.length === 0) return 0
      return this.list.reduce((sum, item) => {
        const amount = parseFloat(item.winnerAmount) || 0
        return sum + amount
      }, 0)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 格式化金额显示
    formatAmount(amount) {
      if (!amount || amount === 0) return '0.00'
      const num = parseFloat(amount)
      if (isNaN(num)) return '0.00'
      return num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    formatPercent(part, total) {
      if (!total || total == 0) return '0.0%'
      const percent = (parseFloat(part) / parseFloat(total)) * 100
      return percent.toFixed(1) + '%'
    },
    
    getList() {
      this.listLoading = true
      ///console.log('查询参数:', this.q); // 检查 startDate 和 endDate
      api.fetchList(this.q).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.totalAmountAll = response.data.totalAmount
        this.totalAmountByDate=response.data.totalAmountInRange
        this.listLoading = false
      }).catch(error => {
        //console.error('API调用失败:', error)
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
    // 修改日期区间变化处理方法
    handleDateRangeChange(val) {
      if (val && val.length === 2) {
        this.q.startDate = val[0]
        this.q.endDate = val[1]
      } else {
        this.q.startDate = ''
        this.q.endDate = ''
      }
    },
    
    // 修改重置查询方法
    handleResetQuery() {
      this.q = {
        currPageNo: 1,
        limit: 25,
        roleName: '',
        dateRange: [],
        startDate: '',
        endDate: ''
      }
      this.reload()
    }
  }
}
</script>

<style scoped>
/* 日期控件文字居中样式 */
.date-picker-center >>> .el-input__inner {
  text-align: center !important;
}

.date-picker-center >>> .el-range-input {
  text-align: center !important;
}

.date-picker-center >>> .el-range-separator {
  text-align: center !important;
}

/* 确保日期控件内的所有文字都居中 */
.date-picker-center >>> .el-range-editor {
  text-align: center;
}

.date-picker-center >>> .el-range-editor .el-input__inner {
  text-align: center !important;
}

/* 汇总信息样式 */

.summary-card {
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  padding: 6px 8px;
  line-height: 1;   /* 至少 120 px，内容多时可继续增高 */
}

.summary-row {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #606266;
  padding: 2px 4px;
  gap: 10px;
  min-height: 5px;
}

.summary-title {
  color: #333;
  font-weight: bold;
  font-size: 16px;
  margin-right: 8px;
}

.summary-item {
  min-width: 180px;
  margin-right: 18px;
  display: flex;
  align-items: center;
}

.summary-item strong {
  display: inline-block;
  width: 35px;
  text-align: left;
  font-weight: bold;
}

.custom-date-picker >>> .el-input__inner,
.custom-date-picker >>> .el-range-editor {
  border-radius: 20px !important;
  background: #f4f8fb !important;
  border: 1px solid #d3e2f5 !important;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-size: 14px;         /* 调小字体 */
  color: #409EFF;
  height: 36px;
  padding-left: 36px !important;
  padding-right: 16px !important;
}

.custom-date-picker >>> .el-range-editor {
  padding: 0 8px !important;   /* 减小内边距 */
}

.custom-date-picker >>> .el-range-input {
  color: #333;
  font-weight: 500;            /* 适度加粗 */
  font-size: 14px;             /* 调小字体 */
  background: transparent !important;
  padding: 0 2px !important;
}

.custom-date-picker >>> .el-range-separator {
  color: #409EFF;
  font-weight: 500;
  font-size: 15px;
  background: transparent !important;
  margin: 0 2px !important;    /* 缩小分隔符间距 */
}

.custom-date-picker >>> .el-icon-date {
  color: #409EFF !important;
}

.custom-date-picker {
  width: 260px !important;     /* 增大控件宽度 */
  min-width: 220px !important;
  max-width: 100%;
}

/* 统一所有查询控件的高度 */
.filter-item,
.custom-date-picker >>> .mx-input,
.custom-date-picker >>> .el-input__inner,
.custom-date-picker >>> .el-range-editor {
  height: 36px !important;
  font-size: 14px !important;
  box-sizing: border-box;
  border-radius: 4px !important;
  line-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  /* 不设置左右padding，交给各自style */
}
.custom-date-picker >>> .mx-input,
.custom-date-picker >>> .el-input__inner,
.custom-date-picker >>> .el-range-editor {
  display: flex;
  align-items: center;
}
</style>
