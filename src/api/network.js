// "use strict";

import axios from "axios";
import {
  Message
} from "element-ui";
import {
  getUserInfo
} from "../sdk/cookie.js"
import fileServer from '../sdk/fileServer';

// const isProd = ["quickTest", "production", "stage"].indexOf(process.env.NODE_ENV) > -1;
// let baseURL = isProd ? process.env.VUE_APP_SERVICE : "/api";
let baseURL = "";
const {
  hostname,
  protocol,
  pathname
} = window.location;
const prevUrl = protocol + "//" + hostname;
if (pathname && pathname.includes('sub-user')) {
  baseURL = prevUrl + '/user';
} else if (pathname && pathname.includes('sub-csop')) {
  baseURL = prevUrl + '/csop';
} else if (pathname && pathname.includes('sub-crm')) {
  baseURL = prevUrl + '/crm';
}else {
  baseURL = prevUrl + '/user';
}
let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || "http://10.10.10.132/api",
  baseURL: baseURL,
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);

_axios.interceptors.request.use(config => {
  //添加取消标记
  // config.cancelToken = new axios.CancelToken(cancel => {
  //   
  //   window.axiosCancel.push({
  //     cancel
  //   })
  // })
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  if (source) {
    source.cancel();
  }
  let data = getUserInfo();
  if (config.url.includes('login')) {
    return config;
  } else if (data) {
    config.headers.Authorization = 'Bearer ' + data.token;
    return config;
  } else {
    // store.setRedirect("/login");
    return Promise.resolve(err);
  }
}, err => {
  Message.error({
    message: '请求超时!'
  });
  return Promise.resolve(err);
});

_axios.interceptors.response.use(data => {
  let code = data.data.code;
  if (code && code !== 200) {
    Message.warning({
      message: data.data.msg || data.data.message || 'Error',
      type: 'warning',
      duration: 3 * 1000
    });
  } else if (code == 403 || code == 404) {
    Message.error('权限不足,请联系管理员!');
  } else if (code == 401) {
    Message.error('token已过期!');
    // store.setRedirect("/login");
    return;
  }
  return data;
}, err => {
  return Promise.reject(err);
});

/**
 * post请求
 * @param {*} url 
 * @param {*} params 
 * @returns 
 */
export const postRequest = (url, params) => {
  return _axios({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

/**
 * 上传文件
 * @param {} url 
 * @param {*} formData 
 * @returns 
 */
export const uploadFileRequest = (url, formData) => {
  return _axios({
    method: 'post',
    url: `${url}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * get请求
 * @param {} url 
 * @param {*} params 
 * @returns 
 */
export const getRequest = (url, params) => {
  return _axios({
    method: 'get',
    params: params,
    url: `${url}`,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 下载文件 格式是blob
 * @param {*} url 
 * @returns 
 */
export const exportFileRequest = async (url, params, exportLoading) => {
  try {
    let res = await _axios({
      method: 'post',
      url: `${url}`,
      data: params,
      responseType: "blob",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    fileServer.downloadFile(res, exportLoading);
  } catch (error) {
    console.log(error);
    exportLoading.close();
  }
}

/**
 * 下载pdf文件
 * @param {*} data 
 * @param {*} fileName 
 */
export const exportPdf = (data, fileName) => {
  let blob = new Blob([data], {
    //type类型后端返回来的数据中会有，根据自己实际进行修改
    //表格下载为 application/xlsx，压缩包为 application/zip等，
    type: "application/pdf"
  });
  let filename = fileName;
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL = window.URL.createObjectURL(blob);
    // 创建隐藏<a>标签进行下载
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}
