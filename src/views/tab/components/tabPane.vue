<template>
  <div>
    <div>tab-pane: {{ type }}</div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">

    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Date">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="Title">
      <template slot-scope="scope">
        <span>{{ scope.row.title }}</span>
        <el-tag>{{ scope.row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="Author">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="Importance">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star"/>
      </template>
    </el-table-column>

    <el-table-column align="center" label="Readings" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.pageviews }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Status" width="110">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>

    </el-table>
    <Pagination
      :total="100"
      :page="page"
      :limit="listQuery.limit"
      @pagination="({ page }) => handlePageChange(page)"
    />
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    console.log('tab-pane created', this.type)
  },
  watch: {
    page: {
      immediate: true,
      handler(newPage) {
        console.log('tab-pane收到page变化', this.type, newPage)
        this.getList()
      }
    },
    type(newType) {
      this.getList()
    }
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      console.log('getList', this.type, '当前页', this.page)
      this.loading = true
      this.$emit('create') // for test
      fetchList({
        ...this.listQuery,
        page: this.page // 强制用props.page
      }).then(response => {
        this.list = response.data.items
        this.loading = false
      })
    },
    // 分页变化时只通知父组件
    handlePageChange(page) {
      console.log('tab-pane触发page-change', this.type, page)
      this.$emit('page-change', { type: this.type, page })
    }
  },
  components: { Pagination }
}
</script>

