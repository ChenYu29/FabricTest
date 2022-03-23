/**
 * @description Ajax 封装方法
 * @author cnn
 * **/
import { message, Modal } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { platform, serverPath } from './ProjectVars';

/**
 * 没有登陆
**/
const notLogin = () => {
  Modal.error({
    title: '温馨提示',
    content: '没有登录信息或登录信息过期，请重新登录。'
  });
  window.setTimeout(() => {
    window.location.href = platform;
  }, 1000);
};
/**
 * post 传参
 * **/
const post = (url: string, data: any, config: any, thenCallBack: any) => {
  let params = data;
  let trueUrl: string = serverPath + url;
  if (config.dataType === 'form') {
    config.headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    params = qs.stringify(data);
  } else if (config.dataType === 'formWithFile') {
    config.headers = {
      'Content-type': 'multipart/form-data'
    };
  }
  if (url.indexOf('http') !== -1) {
    trueUrl = url;
  }
  return Axios.post(trueUrl, params, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error({
            content: responseData.msg,
            key: 'postMessage'
          });
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          notLogin();
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404) {
      message.error('服务未找到', 5);
    } else if (response.status === 500) {
      message.error('服务异常', 5);
    } else {
      message.error('未知异常', 5);
    }
  }).catch((e) => {
    // 上传断网
    if (e.request) {
      thenCallBack({
        responseStatus: 500,
        msg: '网络连接失败'
      });
    }
    // 如果未授权
    if (e.response && e.response.status === 403 && e.response.data && e.response.data.flag === 1) {
      thenCallBack(e.response.data);
    } else {
      message.error(e, 3);
    }
  });
};
/**
 * get 传参
 * **/
const get = (url: string, config: AxiosRequestConfig, thenCallBack: any) => {
  let trueUrl: string = serverPath + url;
  if (url.indexOf('http') !== -1) {
    trueUrl = url;
  }
  // get 参数放在 config.params 里
  return Axios.get(trueUrl, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error(responseData.msg);
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          notLogin();
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404 || response.status === 504) {
      message.error('服务未找到', 5);
    } else if (response.status === 500) {
      message.error('服务异常', 5);
    } else {
      message.error('未知异常', 5);
    }
  }).catch((e) => {
    console.log('error', e);
    // 上传断网
    if (e.request) {
      thenCallBack({
        responseStatus: 500
      });
    }
    // 如果未授权
    if (e.response && e.response.status === 403 && e.response.data && e.response.data.flag === 1) {
      thenCallBack(e.response.data);
    } else {
      message.error(e, 3);
    }
  });
};
/**
 * Put 上传文件
**/
const put = (url: string, data: any, config: AxiosRequestConfig, thenCallBack: any) => {
  return Axios.put(url, data, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error(responseData.msg);
          thenCallBack(responseData);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else {
      thenCallBack(response);
    }
  }).catch((e) => {
    thenCallBack({
      status: 500
    });
  });
};
export { post, get, put };
