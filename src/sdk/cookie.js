import Cookie from 'js-cookie';
const keys = "COMMIN_USER"
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

export const removeUserInfo = () => Cookie.remove(keys, {
  path: "/",
  domain: serve
});

export const getUserInfo = () => {
  if (Cookie.get(keys)) {
    return JSON.parse(Cookie.get(keys));
  }
  return {};
}
