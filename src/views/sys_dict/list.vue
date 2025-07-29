<template>
  <div class="app-container">
    <div v-show="showList">
      <div class="filter-container">
        <el-input v-model="q.dict_name" style="width:200px" placeholder="字典名称" class="filter-item"/>
        <el-select v-model="q.dict_type" filterable placeholder="字典类型" class="filter-item">
          <el-option label="请选择" value=""/>
          <el-option label="行业类型" value="1"/>
          <el-option label="人才认定申报批次" value="2"/>
          <el-option label="学历" value="3"/>
          <el-option label="信息发布类型" value="4"/>
          <el-option label="轮播图" value="5"/>
          <el-option label="政策扶持" value="6"/>
          <el-option label="国内专业" value="7"/>
          <el-option label="国外专业" value="8"/>
          <el-option label="类别认定申报批次" value="9"/>
          <el-option label="资金申请申报批次" value="10"/>
          <el-option label="政府端首页参数" value="11"/>
          <el-option label="企业端入口控制" value="12"/>
          <el-option label="政府端资金申请参数" value="13"/>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">{{ $t('table.search') }}</el-button>
        <el-button v-has="'add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">{{ $t('table.add') }}</el-button>
		    <!--<el-button v-has="'import'" :loading="loading" style="margin-left: 10px;" class="filter-item" type="primary" icon="el-icon-upload2" @click="toImport">{{ $t('table.import') }}</el-button>-->
      </div>
	  <div v-show="showImport">
        <div class="errorMsg" style="color:black;">
          <p class="jsgl-tip">点击“下载模板”获取导入模板，根据模板格式填入所需信息;</p>
          <a href="/src/excel/sys_dict导入模板.xls" class="jsgl-bg-text" style="color:blue;">下载模板</a>
        </div>
        <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
        <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
          	将文件拖到此处，或
          <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">立即上传</el-button>
        </div>
        <div class="errorMsg">
          <p>{{msg}}</p>
        </div>
      </div>
      <el-table
        v-show="!showImport"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;height:auto;">
		<el-table-column label="字典名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.dict_name }}</span>
          </template>
        </el-table-column>
		<el-table-column label="字典类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.dict_type =='1' ">行业类型</span>
            <span v-else-if="scope.row.dict_type =='2' ">人才认定申报批次</span>
            <span v-else-if="scope.row.dict_type =='3' ">学历</span>
            <span v-else-if="scope.row.dict_type =='4' ">信息发布类型</span>
            <span v-else-if="scope.row.dict_type =='5' ">轮播图</span>
            <span v-else-if="scope.row.dict_type =='6' ">政策扶持</span>
            <span v-else-if="scope.row.dict_type =='7' ">国内专业</span>
            <span v-else-if="scope.row.dict_type =='8' ">国外专业</span>
            <span v-else-if="scope.row.dict_type =='9' ">类别认定申报批次</span>
            <span v-else-if="scope.row.dict_type =='10' ">资金申请申报批次</span>
            <span v-else-if="scope.row.dict_type =='11' ">政府端首页参数</span>
            <span v-else-if="scope.row.dict_type =='12' ">企业端入口控制</span>
            <span v-else-if="scope.row.dict_type =='13' ">政府端资金申请参数</span>
            <span v-else/>
          </template>
        </el-table-column>
		<el-table-column label="字典顺序" >
          <template slot-scope="scope">
            <span>{{ scope.row.dict_order }}</span>
          </template>
        </el-table-column>
		<el-table-column label="字典状态" >
          <template slot-scope="scope">
            <span>{{ scope.row.dict_stat== '1'?'启用':'弃用' }}</span>
          </template>
        </el-table-column>
        	<el-table-column label="字典参数" >
          <template slot-scope="scope">
            <span v-if="scope.row.dict_type =='12'">{{ scope.row.param_name =='1'?'显示':scope.row.param_name =='2'?'隐藏':'' }}</span>
            <span v-else>{{ scope.row.param_name }}</span>
          </template>
        </el-table-column>
		<el-table-column label="添加时间" >
          <template slot-scope="scope">
            <span>{{ scope.row.addtime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="update(scope.row.dict_id)" v-has="'edit'">{{ $t('table.edit') }}</el-button>
            <el-button  size="mini" type="danger" @click="handleDelete(scope.row.dict_id)" v-has="'del'">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination style="float:right" v-show="!showImport && total>0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :page.sync="q.currPageNo" :limit.sync="q.limit" @pagination="getList" />
	</div>
    <el-card v-show="!showList">
      <span>{{title}}</span>
      <el-row>
        <el-col :span="18" >
          <el-form ref="formValidate" :model="showdata" :rules="ruleValidate" label-width="120">
    <el-form-item label="字典类型" prop="dict_type">
          <el-select v-model="showdata.dict_type" filterable placeholder="字典类型" class="filter-item" @change="getTypeList(showdata.dict_type)">
            <el-option label="请选择" value=""/>
            <el-option label="行业类型" value="1"/>
            <el-option label="人才认定申报批次" value="2"/>
            <el-option label="学历" value="3"/>
            <el-option label="信息发布类型" value="4"/>
            <el-option label="轮播图" value="5"/>
            <el-option label="政策扶持" value="6"/>
            <el-option label="国内专业" value="7"/>
            <el-option label="国外专业" value="8"/>
            <el-option label="类别认定申报批次" value="9"/>
            <el-option label="资金申请申报批次" value="10"/>
            <el-option label="政府端首页参数" value="11"/>
            <el-option label="企业端入口控制" value="12"/>
            <el-option label="政府端资金申请参数" value="13"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属上级" v-if="treeList && treeList.length>0">
        <el-cascader
          :options="treeList"
          :props="{ checkStrictly: true }"
          @change="$forceUpdate()"
          v-model="treeModel"
          clearable
          style="width: 500px; margin-right: 20px"
        ></el-cascader>
      </el-form-item>
			<el-form-item label="字典名称" prop="dict_name">
                <el-input v-model="showdata.dict_name" placeholder="请输入字典名称"/>
       	 	</el-form-item>
			<el-form-item label="字典顺序" prop="dict_order">
                <el-input v-model="showdata.dict_order" placeholder="请输入字典顺序"/>
       	 	</el-form-item>
      <el-form-item label="字典状态" prop="dict_stat">
        <el-radio-group v-model="showdata.dict_stat">
          <el-radio label="0" value="0">弃用</el-radio>
          <el-radio label="1" value="1">启用</el-radio>
        </el-radio-group>
  	</el-form-item>
			<el-form-item v-if="showdata.dict_type =='12'" label="参数名称" prop="param_name">
        <el-radio-group v-model="showdata.param_name">
          <el-radio label="1" value="1">显示</el-radio>
          <el-radio label="2" value="2">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-else label="参数名称" prop="param_name">
          <el-input v-model="showdata.param_name" placeholder="请输入参数名称"/>
      </el-form-item>
        <el-form-item v-show="showdata.dict_type==24 || showdata.dict_type==28 " label="服务类型编码" prop="tax">
          <el-input v-model="showdata.typeCode" placeholder="请输入服务类型编码"/>
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
import { fetchList, fetchdelete, getInfo, saveOrupdate, uploadFile, queryTypeList,quyerDictTree } from '@/api/sys_dict/list'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import XLSX from 'xlsx'
export default {
  name: 'menu_5',
  components: { Pagination },
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      tableHeight: window.innerHeight  - 380,//设置当前table的高度
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      loading: false,
      q: {
        currPageNo: 1,
        limit: 10,
        roleName: '',
      },
      showList: true,
      show1: false,
      title: null,
      typeList: null,
      showdata: {},
      ruleValidate: {
        dict_type: [
            {required: true, message: '字典类型不能为空', trigger: 'blur'}
        ],
        dict_name: [
            {required: true, message: '字典名称不能为空', trigger: 'blur'}
        ],

      },
      isView:false,
      showImport:false,
      msg: '',
      excelData: {
        header: null,
        results: null
      },

      treeList:[],
      treeModel:[],
    }
  },
  created() {
    this.getList()
    this.getTypeList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.q).then(response => {
        this.list = response.data.list
        //console.log(JSON.stringify(response))
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleSizeChange(val){//页面显示条数变化
      this.limit=val
      getList()
    },
    handleCurrentChange(val){//页码数变化时
      this.currPageNo=val
      getList()
    },
    query() {
	  this.showImport = false;
	  this.msg = ''
      this.reload()
    },
    getTypeList(val) {
      if (val === '12' || val === '25' || val == '29') {
        var type = '11';
        if (val === '25') {
          type = '24';
        }
        if (val === '29') {
          type = '28';
        }
        queryTypeList(type).then(response => {
          this.typeList = response.data.list
          this.dictMap = response.data.queryParams.dictMap
        })
      }
      if(val){
        this.quyerDictTree()
      }else{
        this.treeList=[]
      }
    },
    quyerDictTree(){
      quyerDictTree(this.showdata.dict_type).then(response => {
        console.log(response);
        this.treeList = response.data.treeList
        this.treeMap = response.data.treeMap

        var tree1 = this.showdata;
        var tree2 = {}
        var tree3 = {}
        var treeModel=[]
        if(tree1){
          //treeModel.unshift(tree1.dict_id)
          if(tree1.parent_id && this.treeMap[tree1.parent_id]){
            tree2 = this.treeMap[tree1.parent_id]
            treeModel.unshift(tree2.dict_id)
            if(tree2.parent_id && this.treeMap[tree2.parent_id]){
              tree3 = this.treeMap[tree2.parent_id]
              treeModel.unshift(tree3.dict_id)
            }
          }
          
        }
        this.treeModel = treeModel;
      })
    },
    add() {
	  this.showList = false
	  this.title = "新增"
	  this.showdata = {}
	  this.isView=false
	  this.msg = ''
    this.treeList=[]
    this.$nextTick(() => {
        this.$refs['formValidate'].clearValidate()
      })
    },
    update(id) {
	  this.showList = false
	  this.title = "修改"
	  this.isView=true
	  this.getInfo(id)
    this.$nextTick(() => {
        this.$refs['formValidate'].clearValidate()
      })
    },
    getInfo(id){
      getInfo(id).then(response => {
        this.showdata = response.data
        this.getTypeList(this.showdata.dict_type);
      })
    },
    reload() {
	  this.showList = true
	  this.isView=false
      this.q.currPageNo = 1
      this.msg = ''
      this.getList()
    },
    saveOrUpdate() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if(this.treeModel && this.treeModel.length>0){
            if(this.treeModel.length==3){
              this.$notify({title: '失败',message: "所属上级不能选择第三级",type: 'error', duration: 2000})
              return false;
            }
            this.showdata.parent_id = this.treeModel[this.treeModel.length-1];
          }
          saveOrupdate(this.showdata).then(response => {
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
        fetchdelete(id).then(response => {
          this.reload()
        })
      }).catch(() => {
        //几点取消的提示
      })
    },
    reloadSearch() {
      this.q = {
        currPageNo: 1,
        limit: 10,
        dict_name: '',
        dict_type: '',
      }
      this.msg = ''
      this.reload()
    },
    handleSubmit() {
      this.saveOrUpdate()
    },
    handleReset() {
      this.showdata = {}
      this.msg = ''
      //this.reload()
    }
    ,toImport() {
      this.showImport = true
      this.msg = ''
    },
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixData(data)
          const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          var form = { 'header': JSON.stringify(this.excelData.header), 'results': JSON.stringify(this.excelData.results) }
          uploadFile(form).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
              this.msg = ''
              setTimeout(() => {
		      	this.query()
		      }, 1.5 * 1000)
            } else {
              this.msg = res.msg
            }
          })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    fixData(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>
<style scoped>
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.errorMsg{
  width: 600px;
  height: 160px;
  margin: 0 auto;
  font-size: 20px;
  border-radius: 5px;
  text-align: center;
  color: red;
  position: relative;
  white-space: pre-line;
}
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
