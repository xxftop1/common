import Cookie from 'js-cookie';
const keys = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : "COMMON_USER"
let serve = window.location.hostname;
export const getToken = () => {
  if (Cookie.get(keys)) {
    let userdata = JSON.parse(Cookie.get(keys));
    if (userdata) {
      let token = userdata.token;
      return token;
    } else {
      return "";
    }
  }
}

export const setUserInfo = (userInfo, options = {}) => Cookie.set(keys, userInfo, options);

/**
 * 记住密码信息
 * @param {*} value 
 * @param {*} password 
 * @param {*} num 
 */
export const setRememberInfo = (prev, value, password, num) => {
  Cookie.set(prev + '-rememberInfo', JSON.stringify({
    userId: value,
    password: password
  }), {
    expires: num,
    path: '/',
    domain: serve
  });
}

/**
 * 删除记住密码的信息
 */
export const removeRememberInfo = (prev) => {
  Cookie.remove(prev + '-rememberInfo', {
    path: "/",
    domain: serve
  });
}

export const removeUserInfo = () => Cookie.remove(keys, {
  path: "/",
  domain: serve
});

export const getUserInfo = (key = '') => {
  if (!key) {
    key = keys;
  }
  if (Cookie.get(key)) {
    return JSON.parse(Cookie.get(key));
  }
  return {};
}
