import axios from './axios'
import moment from 'moment'

export function isvalidUsername (val) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(val.trim()) >= 0
}

/* 区分手机端与PC端 */
export function isPcOrMobile(val){
  const reg = /Android|webOS|iPhone|iPod|BlackBerry/i;
  return reg.test(val)
}

/* 合法uri*/
export function validateURL (val) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(val)
}

/* 小写字母*/
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/;
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase (val) {
  const reg = /^[A-Z]+$/;
  return reg.test(val)
}

/* 大小写字母*/
export function validateAlphabets (val) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(val)
}

/* 整点双数类型的时间*/
export function validateEventime (val) {
  const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|22|[0-1]\d*[0,2,4,6,8]):d*[0][0]:d*[0][0]$/;
  return reg.test(val)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function isEmail (val) {
  //const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const re = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return re.test(val)
}

//验证url是否正确，true/false
export function isUrl (val) {
  return (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i).test(val)
}

//验证手机号码是否正确， true/false
export function isMobile (val) {
  return (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/).test(val)
}

//验证手机号码是否正确， true/false
export function isPhone (val) {
  return (/^[0-9-()（）]{7,18}$/).test(val)
}

//判断是否是object对象
export function isObject (val) {
  return val && Object.prototype.toString.call(val) === '[object Object]';
}

//判断是否是数组
export function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

//校验纬度是否合法（有问题，慎用）
export function checkLat(val){
  const re = /^-?((0|[1-8]\d|)(\.\d{1,7})?|90(\.0{1,7})?)?$/;
  return re.test(val);
}

//校验经度是否合法(有问题，慎用)
export function checkLng(val){
  const re = /^-?((0|[1-9]\d?|1[0-9]\d)(\.\d{0,9})?|180(\.0{1,7})?)?$/;
  return re.test(val);
}

//校验数字，小数位最多6位
export function checkFloat(val){
  const re = /^-?(\d+(\.\d{0,6})?)|\d+(\.\d{0,6})?$/;
  return re.test(val);
}

//判断是否已存在相关数据
export function checkVendorNumber(url,val,callback,id){
  axios.post('/vendorBasic/checkVendorNumber',{param:val}).then(res=>{
    if(res && res.data && res.data.code===200){
      callback();
    }else{
      callback(new Error('已占用，请重新输入！'));
    }
  }).catch(res=>{
    callback(new Error('已占用，请重新输入！'));
  });
}
//判断是否已存在相关数据
export function notNull(rule,val,callback){
  if(rule.val){
    callback();
  }else{
    callback(new Error('不能为空！'));
  }
}

export function checkEmail(rule, value, callback){
  if(value){
    if (isEmail(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的邮箱格式'));
    }
  }else{
    callback();
  }
}
//验证手机号码是否正确
export function checkMobile(rule, value, callback) {
  if (isMobile(value) == false) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
}
//验证电话号码是否正确
export function checkPhone(rule, value, callback) {
  if (isPhone(value) == false) {
    callback(new Error('请输入正确的电话号码'));
  } else {
    callback();
  }
}

//验证时间整点双数
export function checkEventime(rule, value, callback) {
  if (validateEventime(value)) {
    callback();
  } else {
    callback(new Error('请输入整点偶数类型的时间'));
  }
}
//验证维度是否正确
export function checkAreaLat(rule, value, callback) {
  if (checkFloat(value) && value>=-90 && value<=90) {
    callback();
  } else {
    callback(new Error('纬度不符合规范：纬度整数部分为(-90,90),小数部分为0-6位！'));
  }
}
//验证经度是否正确
export function checkAreaLng(rule, value, callback) {
  if (checkFloat(value) && value>=-180 && value<=180) {
    callback();
  } else {
    callback(new Error('经度不符合规范：经度整数部分为(-180,180),小数部分为0-6位！'));
  }
}
//验证数字
export function checkNumber(rule, value, callback) {
  if (value<rule.numMin || value>rule.numMax) {
    callback(new Error('请输入'+rule.numMin+'到'+rule.numMax));
  } else {
    callback();
  }
}

//验证特定字符切割后个数
export function checkSplit(rule, value, callback) {
  if(value){
    let arr = value.split(rule.sign);
    if (arr.length<rule.numMin || arr.length>rule.numMax) {
      callback(new Error('请输入'+rule.numMin+'到'+rule.numMax+"个，并用英文 "+rule.sign+" 隔开"));
    } else {
      if(rule.limitLength){
        for(let i in arr){
          if(arr[i].length>rule.limitLength){
            callback(new Error('单个字数不能超过'+rule.limitLength+'个'));
          }
        }
      }
      callback();
    }
  }else{
    callback(new Error('不能为空'));
  }
}
//验证两个字符串切割后是否相同
export function checkSame(rule, value, callback){
  if(value){
    if(rule.val){
      let arr1 = rule.val.split(",");
      let arr2 = value.split(",");
      if(arr1.length === arr2.length){
        callback();
      }else{
        callback(new Error('推荐菜品名称和上传菜品图片顺序、数量请保持一致。（ps:菜品名称需使用英文逗号隔开）'));
      }
    }else{
      callback(new Error('推荐菜品名称和上传菜品图片顺序、数量请保持一致。（ps:菜品名称需使用英文逗号隔开）'));
    }
  }else{
    callback(new Error('不能为空'));
  }
}
//验证是否是表情符号
export function checkEmoji(rule, value, callback) {
  for (let i = 0; i < value.length; i++) {
    let hs = value.charCodeAt(i);
    if ( hs>=0xd800 && hs <= 0xdbff) {
      if (value.length > 1) {
        let ls = value.charCodeAt(i + 1);
        let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (uc >= 0x1d000 && uc <= 0x1f77f) {
          callback(new Error('不允许使用特殊字符'));
        }
      }
    } else if (value.length > 1) {
      let ls = value.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        callback(new Error('不允许使用特殊字符'));
      }
    } else if (hs >= 0x2100 && hs <= 0x27ff) {
        callback(new Error('不允许使用特殊字符'));
      } else if (hs >= 0x2B05 && hs <= 0x2b07) {
        callback(new Error('不允许使用特殊字符'));
      } else if (hs >= 0x2934 && hs <= 0x2935) {
        callback(new Error('不允许使用特殊字符'));
      } else if (hs >= 0x3297 && hs <= 0x3299) {
        callback(new Error('不允许使用特殊字符'));
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        hs == 0x2b50) {
        callback(new Error('不允许使用特殊字符'));
      }
  }
  callback();
}

/**
 * 校验数字大小
 * @param rule
 * @param value
 * @param callback
 */
export function compareEL(rule, value, callback){
  if(value && rule.val){
    if(rule.val<value){
      callback(new Error(rule.message));
    }
  }
  callback();
}

/**
 * 校验当前日期（仅匹配大于等于今天的日期）
 * @param rule
 * @param value
 * @param callback
 */
export function checkCurDate(rule, value, callback){
  if(moment(value).isBefore(new Date(),'day')){
    callback(new Error("不能选择今天之前的日期"));
  }else{
    callback();
  }
}
