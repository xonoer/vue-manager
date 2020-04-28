import { isObject, isArray } from "@/utils/validate.js";

/**
 * cookies操作类
 */
class Cookie {
  /**
   * 构造函数
   */
  constructor() {
    this.defaults = false;
    this.expiresMultiplier = 60 * 60 * 24;
    this.prefix = "budc_";
  }

  /**
   * 根据key获取cookie的值
   * @param {string} key 键
   * @returns {object} 值
   */
  get(key) {
    if (!key) {
      return false;
    }
    if (typeof key === "object") {
      return false;
    }
    let cookies = this.all();
    let value = cookies[this.prefix + key];
    try {
      value = JSON.parse(value);
    } catch (e) {
      value = false;
    }
    return value;
  }

  /**
   * 设置cookies
   * @param key 键
   * @param value 值
   * @param options 选项
   * @returns {Cookie}
   */
  set(key, value, poptions) {
    let options = isObject(poptions) ? poptions : { expires: poptions };
    // 如果expires为空的话那么就设置为session.
    let expires = options.expires
      ? options.expires
      : this.defaults.expires || "",
      expiresType = typeof expires;
    if (expiresType === "string" && expires !== "") {
      expires = new Date(expires);
    } else if (expiresType === "number") {
      expires = new Date(new Date() + 1000 * this.expiresMultiplier * expires);
    }
    if (expires !== "" && "toGMTString" in expires) {
      expires = ";expires=" + expires.toGMTString();
    }
    //设置path
    let path = options.path || this.defaults.path;
    path = path ? ";path=" + path : "";
    //设置domain
    let domain = options.domain || this.defaults.domain;
    domain = domain ? ";domain=" + domain : "";
    //设置secure
    let secure = options.secure || this.defaults.secure ? ";secure" : "";
    if (options.secure === false) {
      secure = "";
    }
    //设置cookie
    document.cookie =
      decodeURIComponent(this.prefix + key) +
      "=" +
      decodeURIComponent(JSON.stringify(value)) +
      expires +
      path +
      domain +
      secure;
    return this;
  }

  /**
   * 删除cookie
   * @param {string||array} keys 删除cookie的key
   * @returns {Cookie}
   */
  remove(keys) {
    let newkeys = isArray(keys) ? keys : [keys];
    for (let i = 0, l = newkeys.length; i < l; i++) {
      this.set(newkeys[i], "", -1);
    }
    return this;
  }

  /**
   * 获取所有的cookie
   * @returns {object} cookie对象
   */
  all() {
    let cookie = document.cookie;
    if (!cookie) {
      return {};
    }
    let cookieArr = cookie.split("; ");
    let result = {};
    for (let i = 0, l = cookieArr.length; i < l; i++) {
      let item = cookieArr[i].split("=");
      //arr.shift()把第一个数组删除并得到删除的值
      let key = decodeURIComponent(item.shift());
      let value = decodeURIComponent(item.join(""));
      result[key] = value;
    }
    return result;
  }
}

export default new Cookie();
