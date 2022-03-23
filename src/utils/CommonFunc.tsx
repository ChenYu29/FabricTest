/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import React from 'react';
import {
  createFromIconfontCN,
} from '@ant-design/icons';
import dayJs from 'dayjs';
import {
  iconUrl,
  RuleType,
} from '@utils/CommonVars';
import { Rule } from 'antd/lib/form';
export const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});
/**
 * 设置 cookie
 * **/
export const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = name + '=' + value + '; max-age=' + maxAge;
};
/**
 * 删除 cookie
 * **/
export const deleteCookie = (name: string) => {
  setCookie(name, '', 0);
};
/**
 * 文件 Url 转义
 **/
export const encodeFileUrl = (url: string) => {
  if (url) {
    let transformUrl: string = url.replace(/%/g, '%25')
      .replace(/\+/g, '%2B')
      .replace(/&/g, '%26')
      .replace(/#/g, '%23');
    return transformUrl;
  } else {
    return '';
  }
};
/**
 * 获取常用校验
 * @param ruleType: required | selectRequired | inputNotSpace | email | phone | idNumber | url | password
 * @param required（可选）: 是否必填（如果单独需要必填，ruleType 设置为 required 即可，如果要满足其他校验且必填，该值才设为 true）
 * @param max（可选）: 字符校验的长度
 **/
export const getRules = (ruleType: RuleType, required?: boolean, max?: number) => {
  let stringCountObj: Rule = { type: 'string', max: max || 10 };
  let requiredObj: Rule = { required: true, message: '请输入' };
  const commonRules: Map<string, Array<Rule>> = new Map([
    [RuleType.required, [requiredObj]],
    [RuleType.selectRequired, [{
      required: true,
      message: '请选择'
    }]],
    [RuleType.notOnlySpace, [{
      whitespace: true,
      message: '不能只有空格'
    }]],
    [RuleType.inputNotSpace, [{
      whitespace: true,
      message: '不能只有空格'
    }, {
      pattern: /^[^\s]*$/,
      message: '不能包含空格及其他空白字符'
    }]],
    [RuleType.email, [{
      pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
      message: '请输入正确邮箱格式'
    }]],
    [RuleType.phone, [{
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      message: '请输入正确手机号格式'
    }]],
    [RuleType.idNumber, [{
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确身份证号格式'
    }]],
    [RuleType.url, [{
      pattern: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
      message: '请输入合法 url'
    }]],
    [RuleType.password, [{
      pattern: /^[_a-zA-Z0-9]+$/,
      message: '仅由英文字母，数字以及下划线组成'
    }]],
    [RuleType.stringCount, [stringCountObj]]
  ]);
  const returnRules: Array<Rule> = commonRules.get(ruleType) || [];
  if (required && ruleType !== RuleType.required) {
    // @ts-ignore
    returnRules.unshift(requiredObj);
  }
  if (max) {
    returnRules.push(stringCountObj);
  }
  return returnRules;
};
/**
 * 节流（连续大量触发的事件应该都要携带该函数）
 * @param fn: 真正要执行的函数
 * @param wait: 等待时间，默认 100 ms
 **/
export const throttle = (fn: Function, wait: number = 100) => {
  let time = Date.now();
  return () => {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
};
/**
 * @description 防抖（触发事件后，在 n 秒内函数只能执行一次，如果触发事件后在 n 秒内又触发了事件，则会重新计算函数延执行时间。）
 * 可用于window resize等
 * @param fn 真正要执行的函数
 * @param delay 等待时间
 */
export const debounce = (fn: Function, delay: number = 100) => {
  let timer: any = null; // 借助闭包
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay); // 简化写法
  };
};
/**
 * @description 获取树形结构数据的展开map数据
 * @param tree 树形数据
 */
export const getTreeMap = (tree: Array<any>) => {
  let treeMap: any = {};
  const loopsTree = (list: Array<any>, parent: any) => {
    return (list || []).map(({ children, value, title }) => {
      const node: any = (treeMap[value] = {
        parent,
        value,
        title
      });
      node.children = loopsTree(children, node);
      return node;
    });
  };
  loopsTree(tree, '');
  return treeMap;
};
/**
 * @description 获取树形结构当前选中点的父级路径  ['0', '0-1', '0-1-0']
 * @param map 树形结构展开的map（可用getTreeMap获取）
 * @param value 当前点
 */
export const getParentPath = (map: any, value: any) => {
  const path = [];
  let current = map[value];
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
};
/**
 * @description 禁用时间、不能选择今天以后的时间
 * @param current 选择器中的时间
 */
export const disableDate = (current: any | null) => {
  return current && current > dayJs().endOf('day');
};

/**
 * @description 函数返回 min（包含）～ max（包含）之间的数字
 * @param min 最小值
 * @param max 最大值
 */
export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 获取当前浏览器高度
 * **/
export const getClientHeight = () => {
  // @ts-ignore
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};
/**
 * @description 获取屏幕宽度
 * **/
export const getClientWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
/**
 * 度分秒转度
**/
export const changeToDu = (h: any, m: any, s: any) => {
  const f = parseFloat(m) + parseFloat((s / 60).toString());
  return parseFloat((f / 60).toString()) + parseFloat(h);
};
/**
 * @description 计算百分比，返回 xx%
 * @param num 当前数
 * @param total 总数
 */
export const getPercent = (num: any, total: any) => {
  let newNum = parseFloat(num);
  let newTotal = parseFloat(total);
  if (isNaN(newNum) || isNaN(newTotal)) {
    return '-';
  }
  return newTotal <= 0 ? '0%' : (Math.round(newNum / newTotal * 10000) / 100.00) + '%';
};
/**
 * @description 计算除法结果，保留两位小数
 * @param num 当前数
 * @param total 总数
 */
export const getDivis = (num: any, total: any) => {
  let newNum = parseFloat(num);
  let newTotal = parseFloat(total);
  if (isNaN(newNum) || isNaN(newTotal)) {
    return 0;
  }
  let returnNum = newNum / newTotal;
  let n = Math.pow(10, 2);
  // return newTotal <= 0 ? 0 : (Math.round(newNum / newTotal * 10000) / 10000.00);
  return newTotal <= 0 ? 0 : Math.ceil(returnNum * n) / n;
};
