import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
//import './mock' // simulation data
import '@/plugins/jquery.min.js'
import '@/utils/hasbtn.js'

import * as filters from './filters' // global filters


Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
  // 在这个方法内可以将捕获到的错误进行上报到后台或者发送错误信息到 node 中间层
  // 上报到后台之后，在请错误请求到页面中进行可视化


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

// vue 打印插件
import Print from '@/plugins/print'
Vue.use(Print)
//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//markDown
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.component("mavon-editor", mavonEditor);

//百度富文本 ueditor
import VueUeditorWrap from 'vue-ueditor-wrap';
Vue.component("VueUeditorWrap", VueUeditorWrap);