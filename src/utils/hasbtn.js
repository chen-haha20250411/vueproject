import Vue from 'vue'
import router from '@/router'

/**权限指令**/
const has = Vue.directive('has', {
    bind: function (el, binding, vnode) {
        let btnPermissionsArr = vnode.context.$route.meta.btnPermissions;
        if (!Vue.prototype.$_has(binding.value,btnPermissionsArr)) {
            el.parentNode.removeChild(el);
        }
    }
});
// 权限检查方法
Vue.prototype.$_has = function (value,btnPermissionsArr) {
    let isExist = false;
    // 获取用户按钮权限
    if (btnPermissionsArr===null||btnPermissionsArr.length<=0) {
        return false;
    }
    if (btnPermissionsArr.indexOf(value) > -1) {
        isExist = true;
    }
    return isExist;
};
export {has}