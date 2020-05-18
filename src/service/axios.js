//引入axios
import axios from "axios";
import qs from "qs";

// object对象存放每次new CancelToken生成的方法
let cancel;
// 每次请求前都会把api放在此数组中，响应成功后清除此请求api
let promiseArr = {};

const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(
  config => {
    // 发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) promiseArr[config.url]("操作取消");
    // 将当前请求存入取消队列中
    promiseArr[config.url] = cancel;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    //请求结束后，将之前的消除函数注销
    promiseArr[response.config.url] = null;
    return response;
  },
  err => {
    // 报错信息没法获取config
    if (axios.isCancel(err)) {
      // 根据业务场景确定是否需要清空
      // 例如：页面跳转前，清空离开页面的请求
      promiseArr = {};
    } else {
      console.log(err);
    }

    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "错误请求";
          break;
        case 401:
          err.message = "未授权，请重新登录";
          break;
        case 403:
          err.message = "拒绝访问";
          break;
        case 404:
          err.message = "请求错误,未找到该资源";
          break;
        case 405:
          err.message = "请求方法未允许";
          break;
        case 408:
          err.message = "请求超时";
          break;
        case 500:
          err.message = "服务器端出错";
          break;
        case 501:
          err.message = "网络未实现";
          break;
        case 502:
          err.message = "网络错误";
          break;
        case 503:
          err.message = "服务不可用";
          break;
        case 504:
          err.message = "网络超时";
          break;
        case 505:
          err.message = "http版本不支持该请求";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    } else {
      err.message = "连接到服务器失败";
    }
    console.log(err.message);
    return Promise.resolve(err.response);
  }
);

// axios.defaults.baseURL = process.env.USERCENTER_API_PATH;
//设置默认请求头
axios.defaults.headers = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/x-www-form-urlencoded",
  token: sessionStorage.seacamels_token,
  time: new Date().getTime()
};
axios.defaults.timeout = 10000;

export default {
  //get请求
  get (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then(res => {
        resolve(res);
      });
    });
  },
  //post请求
  postForm (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data: qs.stringify(param),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
          token: sessionStorage.seacamels_token,
          time: new Date().getTime()
        },
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then(res => {
        resolve(res);
      });
    });
  },
  //post请求
  postJson (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data: param,
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.seacamels_token,
          time: new Date().getTime()
        },
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then(res => {
        resolve(res);
      });
    });
  },
  //post请求--下载文件
  postDownfile (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data: param,
        responseType: "blob",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          token: sessionStorage.seacamels_token,
          time: new Date().getTime()
        },
        cancelToken: new CancelToken(c => {
          cancel = c;
        }),
        onDownloadProgress: function (progressEvent) {
          // `onDownloadProgress`允许处理下载的进度事件
          console.log(progressEvent);
        }
      }).then(res => {
        resolve(res);
      });
    });
  },
  /**
   * post请求,上传多个文件，已表单形式提交
   * @param url 请求地址
   * @param param 额外参数
   * @param filesMap 文件集合
   * @return {Promise<any>}
   */
  postUploadFile (url, param, filesMap) {
    //创建 formData 对象
    let formData = new FormData();
    if (param) {
      for (let key in param) {
        if (param.hasOwnProperty(key)) {
          //该方法会忽略掉那些从原型链上继承到的属性
          //向 formData 对象中添加文件
          formData.append(key, param[key]);
        }
      }
    }
    //多个文件上传
    if (filesMap) {
      for (let k in filesMap) {
        if (filesMap.hasOwnProperty(k)) {
          for (let i = 0; i < filesMap[k].length; i++) {
            formData.append(k, filesMap[k][i]); //文件对象
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: sessionStorage.seacamels_token,
          time: new Date().getTime()
        },
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      })
        .then(res => {
          resolve(res);
        })
        .cache(e => {
          reject(e.msg);
        });
    });
  }
};
