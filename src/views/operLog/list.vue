<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <el-input v-model="q.loginName" style="width:200px" class="filter-item" placeholder="登录名称"/>
         <el-date-picker value-format="yyyy-MM-dd" :editable=false type="date" v-model="q.startTime" placeholder="开始时间" style="width: 150px" class="filter-item" ></el-date-picker>至
         <el-date-picker value-format="yyyy-MM-dd" :editable=false type="date" v-model="q.endTime"  placeholder="结束时间"  style="width: 150px" class="filter-item" ></el-date-picker>
         <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
         <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="document" @click="handleDownload">{{ $t('excel.export') }} Excel</el-button> -->
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
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属角色" >
          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作日志" >
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

      </el-table>

      <pagination  style="float:right" v-show="total>0"  @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :page.sync="q.currPageNo" :limit.sync="q.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'

export default {
  name: 'operlog',
  components: { Pagination },
  data() {
    return {
      tableHeight: window.innerHeight  -380,//设置当前table的高度
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      showList: true,
      title: null,
      //导出excel需要
      excelList:null,
      bookType: 'xlsx',
      filename: '操作日志',
      downloadLoading:false,
      q: {
          loginName: '',
          startTime: '',
          endTime: '',
          currPageNo:1,
          limit:10
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request({
        url: '/admin/operLog/list',
        method: 'post',
        params: this.q
      }).then(response => {
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
    query() {
        this.reload();
    },
    reload (event) {
        this.showList = true;
        this.q.currPageNo = 1
        this.getList()  
    },
    reloadSearch() {
        this.loginName= ''
        this.startTime= ''
        this.endTime= ''
        this.reload();
    },
    setStartTime(e) {
        this.q.startTime= e;
    },
    setEndTime(e) {
        this.q.endTime= e;
    },
    getExcelList() {
      this.q.limit=this.total;
      request({
        url: '/admin/operLog/excelList',
        method: 'post',
        params: this.q
      }).then(response => {
        console.log(response.data);
        this.excelList = response.data
      })
    },
    handleDownload() {
      this.getExcelList();
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['登录名', '真实姓名', '所属角色', '操作日志', '操作时间']
        const filterVal = ['loginName', 'userName', 'roleName', 'remark', 'createTime']
        const list = this.excelList;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }

  }
}
</script>