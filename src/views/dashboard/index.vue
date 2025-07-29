<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import { checkPwd } from '@/api/login'
export default {
  name: 'Dashboard',
  components: { adminDashboard},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    
  },
  mounted() {
    this.checkPwd()
  },
  methods: {
    checkPwd() {
      checkPwd().then(response => {
        if (response.msg =='true') {
          alert('用户密码过于简单请重置密码 !')
        }
      })
    },
  }
}
</script>
