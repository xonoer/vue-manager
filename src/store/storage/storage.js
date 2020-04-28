class Storage {
  constructor(type) {
    if (type === "local") {
      this.store = window.localStorage;
    } else if (type === "session") {
      this.store = window.sessionStorage;
    }
    this.prefix = "buds_";
  }

  set(key, pvalue) {
    let val = pvalue;
    if (typeof pvalue === "object") {
      val = JSON.stringify(pvalue);
    }
    this.store.setItem(
      decodeURIComponent(this.prefix + key),
      decodeURIComponent(val)
    );
    return this;
  }

  get(key) {
    if (key && typeof key === "string") {
      let value = this.store.getItem(decodeURIComponent(this.prefix + key));
      if (value === null) {
        return false;
      }
      try {
        value = JSON.parse(decodeURIComponent(value));
      } catch (e) {
        value = false;
      }
      return value;
    } else {
      return false;
    }
  }

  remove(key) {
    this.store.removeItem(decodeURIComponent(this.prefix + key));
    return this;
  }
}

export const localStore = new Storage("local");
export const sessionStore = new Storage("session");
