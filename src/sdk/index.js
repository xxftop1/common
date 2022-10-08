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

const prev = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : 'COMMON';
/**
 * 获取所有数据字典
 */
const getAllDict = async () => {
  try {
    const key = prev + '-dictList';
    const res = await getRequest(api.AllDict)
    if (res && res.data.code === 200) {
      sessionStorage.setItem(key, {})
      sessionStorage.setItem(key, JSON.stringify(res.data.data))
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
  const key = prev + '-dictList';
  let dictList = sessionStorage.getItem(key);
  if (dictList) {
    let dictAll = JSON.parse(dictList);
    let child = dictAll.find(ele => ele.dictId === id)
    return child ? child.childs : {};
  }
  return [];
};


const getMenuBtn = async () => {
  try {
    const key = prev + '-MENU-ID';
    const menuId = sessionStorage.getItem(key);
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
        sessionStorage.setItem(key, menuId);
        sessionStorage.setItem(prev + '-MENU-BTN', JSON.stringify(current));
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
  const key = prev + '-dictList';
  let dictList = sessionStorage.getItem(key);
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
