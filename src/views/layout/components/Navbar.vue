<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <lang-select class="international right-menu-item"/>

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template> -->
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="loginName">当前登录：{{name}}</span>
          <i class="el-icon-refresh" />
          <span @click="resetPwd" style="cursor: pointer; margin-right:10px;">重置密码</span>
          <i class="el-icon-remove-outline" />
          <span @click="logout" style="cursor: pointer; margin-right:10px;">{{ $t('navbar.logOut') }}</span>
        </div>
      <!-- <el-dropdown class="avatar-container right-menu-item" >
        <div class="avatar-wrapper"> -->
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <!-- <span class="loginName">当前登录：{{name}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->
          <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <el-dialog :visible.sync="dialogFormVisible3" title="重置密码" top="3%" width="40%">
      <el-form ref="formValidate2" :model="oper" :rules="ruleValidate2" >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="oper.oldPassword" :type="passwordType1" placeholder="请输入原密码"/>
          <span class="show-pwd" @click="showPwd(1)">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="oper.newPassword" :type="passwordType2" placeholder="请输入新密码"/>
          <span class="show-pwd" @click="showPwd(2)">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="oper.checkPassword" :type="passwordType3" placeholder="请输入确认密码"/>
          <span class="show-pwd" @click="showPwd(3)">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="clear:both;padding-top: 10px;">
        <el-button @click="dialogFormVisible3 = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updatePwd">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { updatePwd } from '@/api/oper/list'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      dialogFormVisible3: false,
      ruleValidate2: {
        oldPassword:[
          {required: true, message: '原密码不能为空', trigger:['change','blur']}
        ], 
        newPassword:[
          {required: true, message: '新密码不能为空', trigger:['change','blur']}
        ], 
        checkPassword:[
          {required: true, message: '确认密码不能为空', trigger:['change','blur']}
        ],
      },
      oper:{},
      passwordType1: 'password',
      passwordType2: 'password',
      passwordType3: 'password'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('user/LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    showPwd(id) {
      if (id == 1) {
        if (this.passwordType1 === 'password') {
          this.passwordType1 = ''
        } else {
          this.passwordType1 = 'password'
        }
      } else if (id == 2) {
        if (this.passwordType2 === 'password') {
          this.passwordType2 = ''
        } else {
          this.passwordType2 = 'password'
        }
      } else {
        if (this.passwordType3 === 'password') {
          this.passwordType3 = ''
        } else {
          this.passwordType3 = 'password'
        }
      }
    },
    resetPwd() {
      this.dialogFormVisible3 = true
    },
    updatePwd() {
      if (this.oper.oldPassword == '' || this.oper.oldPassword == null) {
        this.$notify({title: '失败',message: '原密码不能为空',type: 'error', duration: 2000})
        return
      }
      if (this.oper.newPassword == '' || this.oper.newPassword == null) {
        this.$notify({title: '失败',message: '新密码不能为空',type: 'error', duration: 2000})
        return
      }
      if (this.oper.checkPassword == '' || this.oper.checkPassword == null) {
        this.$notify({title: '失败',message: '确认密码不能为空',type: 'error', duration: 2000})
        return
      }
      var regLetter = /[A-Za-z]/;
      var regNum = /[0-9]/;
      var complex = 0
      // eslint-disable-next-line no-undef
      if (regLetter.test(this.oper.newPassword)) {
        ++complex
      }
      if (regNum.test(this.oper.newPassword)) {
      	++complex
      }
      if ( this.oper.newPassword.length < 10 || complex < 2) {
      	this.$notify({title: '失败',message: '密码长度不能小于10位，至少包含数字/字母两种组合',type: 'error', duration: 2000})
        return
      }
      if (this.oper.newPassword != this.oper.checkPassword) {
        this.$notify({title: '失败',message: '新密码和确认密码不一致，请重新填写',type: 'error', duration: 2000})
        return
      }
      updatePwd(this.oper).then(response => {
        if (response.success) {
          this.$notify({title: '成功',message: '重置成功',type: 'success', duration: 2000})
          this.dialogFormVisible3 = true
          this.logout()
        } else {
          this.$notify({title: '失败',message: response.msg,type: 'error', duration: 2000}) 
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.loginName{
padding:0 14px;
font-size:16px;
font-weight:bold;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      line-height: 80px;
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative; 
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 37px;
  font-size: 16px;
  // color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
