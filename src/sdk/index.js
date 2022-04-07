import {
  getToken,
  getUserInfo
} from './cookie';

/**
 * 获取数据字典
 * @param {} id 
 * @returns 
 */
const getDistById = (id) => {
  let dictList = localStorage.getItem("dictList");
  if (dictList) {
    let dictAll = JSON.parse(dictList);
    let child = dictAll.find(ele => ele.dictId === id)
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
  getDistById,
  getUserInfo,
  debounce,
  throttle
}
