//引入自定义的axios
import axios from './axios'
import store from '../store'
import router from '../router'
import { Message, MessageBox } from 'element-ui'

/**
 * 判断返回结果是否成功
 * @param data
 * @returns {boolean}
 */
export function isSuccess (data) {
  if (data.code.startsWith('A_')) {
    Message.warning({message: data.msg || '登录过期，请重新登录', offset: 10});
    store.dispatch('LogoutByUser', '').then(() => {
      setTimeout(router.replace({name: 'login'}), 500);
    }).catch(() => {
    });
    return false;
  } else {
    return data.code.startsWith('S_');
  }
}

/**
 * 根据url获取数据
 * @param url
 * @param params
 * @param callback
 * @param failCallback
 */
export function get(url,param,callback,failCallback){
  axios.get(url,param).then(res =>{
    if(callback){
      callback(res.data);
    }else{
      console.log(res);
    }
  }).catch(res =>{
      if(failCallback){
        failCallback(res);
      }else{
        console.log(res);
      }
  });
}

/**
 * 根据url获取数据
 * @param url
 * @param params
 * @param callback
 * @param failCallback
 */
export function postForm (url, params, callback, failCallback) {
  axios.postForm(url, params).then(res => {
    if (res && res.data && isSuccess(res.data)) {
      if (callback) {
        callback(res.data);
      } else {
        Message.info({message: res.data.msg, offset: 10});
      }
    } else if (failCallback instanceof Function) {
      failCallback(res.data)
    } else {
      Message.warning({message: res.data.msg, offset: 10});
    }
  }).catch(res => {
    Message.error({message: '请求异常', offset: 10});
    console.log(res)
  });
}

/**
 * 根据url获取数据
 * @param url
 * @param params
 * @param callback
 * @param failCallback
 */
export function postJson (url, params, callback, failCallback) {
  axios.postJson(url, params).then(res => {
    if (res && res.data && isSuccess(res.data)) {
      if (callback) {
        callback(res.data);
      } else {
        Message.info({message: res.data.msg, offset: 10});
      }
    } else if (failCallback instanceof Function) {
      failCallback(res.data)
    } else {
      Message.warning({message: res.data.msg, offset: 10});
    }
  }).catch(res => {
    Message.error({message: '请求异常', offset: 10});
    console.log(res)
  });
}

/**
 * 根据url获取数据(同步),---不太好用，建议切换思路
 * @param url
 * @param params
 */
export async function getSyncPostData (url, params) {
  let res = await axios.postform(url, params);
  await console.log(res);
  if (res && res.data && isSuccess(res.data)) {
    return res.data;
  } else {
    return null;
  }
}

/**
 * 根据url获取数据
 * @param url
 * @param params
 * @param confirm
 * @param callback
 * @param failCallback
 */
export function confirmPostJson (url, params, confirm, callback, failCallback) {
  MessageBox.confirm(confirm.msg, confirm.title || '提示信息', {
    confirmButtonText: confirm.ok || '确定',
    cancelButtonText: confirm.cancel || '取消',
    type: confirm.type || 'warning'
  }).then(() => {
    axios.postJson(url, params).then(res => {
      if (res && res.data && isSuccess(res.data)) {
        if (callback) {
          callback(res.data);
        } else {
          Message.info(res.data.msg);
        }
      } else if (failCallback instanceof Function) {
        failCallback(res)
      } else {
        Message.warning(res.data.msg);
      }
    }).catch(res => {
      Message.error('请求异常！');
      console.log(res)
    });
  });
}

/**
 * 下载文件
 * @param url
 * @param params
 */
export function downloadFile (url, params) {
  axios.postDownfile(url, params).then(res => {
    if (res && res.data && !isSuccess(res.data)) {
      let fileName = 'temp.xls';
      let disposition = decodeURI(res.headers['content-disposition']);
      if (disposition && disposition.indexOf('filename=') > 0) {
        let index = disposition.indexOf('filename=');
        fileName = disposition.substring(index + 9, disposition.length);
      }
      let blob = new Blob([res.data]);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        let a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      }
    } else {
      Message.error('下载失败！');
    }
  }).catch(res => {
    Message.error('请求异常！');
    console.log(res)
  });
}

/**
 * 上传文件
 * @param url
 * @param params
 * @param filesMap
 * @param callback
 */
export function submitMultipartFormData (url, params, filesMap, callback) {
  axios.postUploadFile(url, params, filesMap).then(res => {
    if (res && res.data && isSuccess(res.data)) {
      if (callback) {
        callback(res.data)
      } else {
        Message.info(res.data.msg)
      }
    }
  }).catch(res => {
    Message.error('请求异常！');
    console.log(res)
  })
}
