import {
  getToken,
  getUserInfo,
  setUserInfo
} from './cookie';
import {
  getRequest
} from '../api/network';
import api from "../sdk/api";
import {
  Message
} from "element-ui";

/**
 * 获取所有数据字典
 */
const getAllDict = async () => {
  try {
    const res = await getRequest(api.AllDict)
    if (res && res.data.code === 200) {
      localStorage.setItem('COMMON-dictList', {})
      localStorage.setItem('COMMON-dictList', JSON.stringify(res.data.data))
    }
  } catch (error) {
    Message.error('获取字典数据异常！', error)
  }
}

/**
 * 根据id获取数据字典
 * @param {} id 
 * @returns 
 */
const getDistById = (id) => {
  let dictList = localStorage.getItem("COMMON-dictList");
  if (dictList) {
    let dictAll = JSON.parse(dictList);
    let child = dictAll.find(ele => ele.dictId === id)
    return child ? child.childs : {};
  }
  return [];
};


const getMenuBtn = async () => {
  try {
    const menuId = sessionStorage.getItem("COMMIN_MENU_ID");
    if (!menuId) {
      return Promise.resolve(true);
    }
    const res = await getRequest(api.MenuButton + `?id=${menuId}`);
    if (res && res.data.code === 200) {
      const data = res.data.data;
      if (data && data.length > 0) {
        let current = {
          [menuId]: data,
        }
        sessionStorage.setItem("COMMIN_MENU_ID", menuId);
        sessionStorage.setItem('COMMIN_MENU_BTN', JSON.stringify(current));
      }
    }
    return Promise.resolve(true);
  } catch (error) {
    Message.error('获取当前菜单的按钮权限异常！', error)
    return Promise.resolve(false);
  }
};

/**
 * 根据type获取数据字典
 * @param {} id 
 * @returns 
 */
const getDistBytype = (type) => {
  let dictList = localStorage.getItem("COMMON-dictList");
  if (dictList) {
    let dictAll = JSON.parse(dictList);
    let child = dictAll.find(ele => ele.dictType === type)
    return child ? child.childs : {};
  }
  return [];
};
/**
 * 函数防抖
 */
const debounce = (fn, delay) => {
  // 记录上一次的延时器
  var timer = null;
  var delay = delay || 200;
  return function () {
    var args = arguments;
    var that = this;
    // 清除上一次延时器
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(that, args)
    }, delay);
  }
}

/**
 * 函数节流
 */
const throttle = (fn, delay) => {
  var lastTime;
  var timer;
  var delay = delay || 200;
  return function () {
    var args = arguments;
    // 记录当前函数触发的时间
    var nowTime = Date.now();
    if (lastTime && nowTime - lastTime < delay) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        // 记录上一次函数触发的时间
        lastTime = nowTime;
        // 修正this指向问题
        fn.apply(this, args);
      }, delay);
    } else {
      lastTime = nowTime;
      fn.apply(this, args);
    }
  }
}
export default {
  getToken,
  getAllDict,
  getDistById,
  getDistBytype,
  getUserInfo,
  setUserInfo,
  debounce,
  throttle,
  getMenuBtn
}
