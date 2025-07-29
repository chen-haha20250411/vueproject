<template>
  <div class="tab-container">
    <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success"/>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <keep-alive>
        <tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          v-show="activeName==item.key"
          :type="item.key"
          :page="tabPageState[item.key]"
          @page-change="handlePageChange"
        />
      </keep-alive>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/tabPane'

export default {
  name: 'Tab',
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: 'China', key: 'CN' },
        { label: 'USA', key: 'US' },
        { label: 'Japan', key: 'JP' },
        { label: 'Eurozone', key: 'EU' }
      ],
      activeName: 'CN',
      createdTimes: 0,
      // 新增：每个tab的分页状态
      tabPageState: {
        CN: 1,
        US: 1,
        JP: 1,
        EU: 1
      }
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    // 新增：处理分页变化
    handlePageChange({ type, page }) {
      console.log('父组件收到分页变化', type, page)
      this.tabPageState[type] = page
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
