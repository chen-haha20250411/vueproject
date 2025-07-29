import request from '@/utils/request'

// 验证是否整数
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 1000);
}


// 验证是否是[0-1]的小数
export function isDecimal(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入数字'));
    } else {
      if (value < 0 || value > 1) {
        callback(new Error('请输入[0,1]之间的数字'));
      } else {
        callback();
      }
    }
  }, 1000);
}

/* 字母*/
export function validateStr(str) {
  const reg = /^[a-zA-Z]+$/;
  return reg.test(str);
}

// 验证是字母
export function isChar(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  } else {
    const reg = /^[A-Z/a-z]+$/;
    const rsCheck = reg.test(value);
    if (!rsCheck) {
      callback(new Error('请输输入字母'));
    } else {
      callback();
    }
  }
}

// 验证是否数字
export function isNumber(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  } else {
    const reg = /^[0-9]+$/;
    const rsCheck = reg.test(value) ;
    if (!rsCheck) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  }
}

// 验证是否两位浮点数
export function isFloat2(rule, value, callback) {
  // const reg = /(?!0\.00)(\d+\.\d{2}$)/;
  if (!value) {
    callback();
  } else {
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    const rsCheck = reg.test(value) ;
    if (!rsCheck) {
      callback(new Error('请输入数字,最多保留两位小数'));
    } else {
      callback();
    }
  }


}

