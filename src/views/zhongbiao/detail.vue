<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>详情页面</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回列表</el-button>
      </div>
      <div v-loading="loading" class="detail-content">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="详情信息" name="detail">
            <div v-if="detailData">
              <h2>{{ detailData.title }}</h2>
              <div v-html="htmlContent"></div>
            </div>
            <div v-else>
              <p>暂无数据</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据展示" name="data">
            <div class="no-data">
              <i class="el-icon-document" style="font-size: 48px; color: #909399;"></i>
              <p style="margin-top: 10px; color: #909399; font-size: 14px;">暂无数据</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as api from '@/api/zhongbiao/list'

export default {
  name: 'zhongbiaoDetail',
  data() {
    return {
      loading: false,
      activeTab: 'detail',
      htmlContent: '',
      id: this.$route.params.id,
      detailData: null
    }
  },
  async created() {
    // 优先 localStorage
    const storedData = localStorage.getItem('detailData');
    if (storedData) {
      this.detailData = JSON.parse(storedData);
      this.htmlContent = this.detailData.html_content || '<p>暂无数据</p>';
    } else {
      // 没有则请求接口
      await this.fetchDetail();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async fetchDetail() {
      this.loading = true;
      try {
        const res = await api.getDetail(this.id);
        if (res && res.data) {
          this.detailData = res.data;
          this.htmlContent = res.data.html_content || '<p>暂无数据</p>';
        } else {
          this.detailData = null;
          this.htmlContent = '<p>暂无数据</p>';
        }
      } catch (e) {
        this.detailData = null;
        this.htmlContent = '<p>暂无数据</p>';
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.detail-content {
  padding: 20px;
  line-height: 1.6;
}

.no-data {
  text-align: center;
  padding: 40px 0;
}
</style>