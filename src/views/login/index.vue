<template>
 
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
<el-card>

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <!-- <lang-select class="set-language"/> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="yzm" v-show="loginForm.username =='admin'">
        <span class="svg-container">
          <svg-icon icon-class="guide" />
        </span>
        <el-input
        style="width:50%"
          v-model="loginForm.yzm"
          placeholder="请输入验证码"
          name="yzm"
          auto-complete="on"
          @keyup.enter.native="handleLogin"/>
          <el-button  type="primary" class="code_btn" style="width:150px;height:47px;background: #fff;color: #000;border: 1px solid #999;float: right;" @click="sendmms()">
            <span v-if="!sendMsgDisabled">发送验证码</span>
            <span v-if="sendMsgDisabled">{{codeTime+'秒后重试'}}</span>
          </el-button>
      </el-form-item>

    <el-form-item prop="verifyCode">
        <span class="svg-container">
          <svg-icon icon-class="guide" />
        </span>
        <el-input
          v-model="loginForm.verifyCode"
          :placeholder="$t('login.verifyCode')"
          name="verifyCode"
          auto-complete="on"
          @keyup.enter.native="handleLogin"/>
           <span class="show-vcode">
              <img style="border-radius: 4px; height: 47px;width:150px" alt="如果看不清楚，请单击图片刷新！" title="点击刷新" :src="src" @click="refreshCode">
           </span>
      </el-form-item>


      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

      <!-- <div class="tips">
        <span>{{ $t('login.username') }} : admin</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div> -->

      <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button> -->
      </el-card>
    </el-form>

    <!-- <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import * as api from '@/api/login'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value=='') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateverifyCode = (rule, value, callback) => {
      if (value=='') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        verifyCode:'',
        uucode:'',
        oldyzmuuid:'',
        yzm:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateverifyCode }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      src: "",//process.env.BASE_API+'/admin/GetYzm',
      codeTime: 59, 
      sendMsgDisabled: false,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {
   this.refreshCode();
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    sendmms(){
      if(!this.loginForm.username){
        this.$notify({title: '提示',message: "请输入账号",type: 'error', duration: 2000})
        return
      }
      var that = this
      api.sendmms({userName: new Buffer(this.loginForm.username).toString('base64')}).then(response => {
        if(response.success){
          this.$notify({title: '成功',message: response.msg,type: 'success', duration: 2000})
          this.loginForm.oldyzmuuid = response.data
          that.sendMsgDisabled = true;
          let codeInterval = window.setInterval(function() {
          console.log(that.codeTime)
          if ((that.codeTime--) <= 0) {
                that.codeTime = 59;
                that.sendMsgDisabled = false;
                window.clearInterval(codeInterval);
            }
          }, 1000);
        }else{
          this.$notify({title: '失败',message: response.msg,type: 'error', duration: 2000})
        }
        
      })
      
    },
    refreshCode() {
        //this.src = process.env.BASE_API+"/admin/GetYzm?" +new Date();
      api.getCaptcha().then(response => {
        this.loginForm.uucode=response.data.uucode;
        this.src = 'data:image/jpeg;base64,'+response.data.img;
      })

    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if('admin'==this.loginForm.username){
            if(!this.loginForm.oldyzmuuid || !this.loginForm.yzm){
              this.$notify({title: '提示',message: "请输入手机验证码",type: 'error', duration: 2000})
              return
            }
          }
          var data = {
            username: new Buffer(this.loginForm.username).toString('base64'),
            password: new Buffer(this.loginForm.password).toString('base64'),
            verifyCode: this.loginForm.verifyCode,
            uucode: this.loginForm.uucode,
            oldyzmuuid:this.loginForm.oldyzmuuid,
            yzm:this.loginForm.yzm
          }
          this.$store.dispatch('user/LoginByUsername', data).then(() => {
            this.loading = false
           // console.log("进入了");
            this.$router.push({ path: this.redirect || '/' })
            this.refreshCode()
          }).catch(() => {
            this.loading = false
            this.refreshCode()
          })
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
   // .login-container .el-input input{
      //color: $cursor;
     // &::first-line {
       // color: $light_gray;
     // }
  //  }
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
       // color: $cursor;
        height: 47px;
       // caret-color: $cursor;
        &:-webkit-autofill {
         // -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
     // color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background: url('/static/bg/bg.jpg') center top no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
   // color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
     // color: $bg;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      //color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
   // color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .show-vcode {
    position: absolute;
    right: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
