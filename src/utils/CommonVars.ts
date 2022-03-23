/**
 * @description: 公共变量
 * @author: cnn
 * @createTime: 2020/7/16 16:53
 **/
// @ts-ignore
import iconfont from '@static/js/iconfont.js';
import { CardProps } from 'antd';
/**
 * 公共颜色
 * **/
export enum colors {
  primaryColor = '#08979C',
  error = '#f5222d',
  success = '#87d068'
}
/**
 * echarts 颜色
**/
export const echartsColor: Array<string> = ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'];
/**
 * 公共间距
**/
export enum CommonSpace {
  lg= 24,
  md = 16,
  sm = 10,
  xs = 5
}
// 公共表单布局
export const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    span: 6
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    span: 18
  },
};
// canvas画布上每个标注框的自定义id标识
export const canvasMarkKey = 'kid';
export const helpMarkKey = 'helpMark';

export const autoMarkColor = '#1237F4';
export const handleMarkColor = '#F44E3B';
export const dateTimeKeys = ['createTime'];
/**
 * 图标库地址，iconfonts 库
 * **/
export const iconUrl: string = iconfont;
// 搜索表单公共的card 参数
// todo 引入 myCardProps 报错，具体原因未知
export const searchCardProps: CardProps = {
  bordered: false,
  title: '',
  style: { marginBottom: CommonSpace.sm, width: '100%' },
  size: 'small'
};
// pageHeader的公共样式
export const pageHeaderStyle: React.CSSProperties = {
  margin: '-10px -10px 10px -10px',
  backgroundColor: '#fff'
};
/**
 * 机构启用禁用状态
 * **/
export enum OrganizationEnable {
  ENABLE = 1, // 启用
  FORBID = 0 // 禁用
}
/**
 * 文件后缀
 **/
export const fileAccept = {
  doc: ['.doc', '.docx'],
  pdf: ['.pdf'],
  excel: ['.xls', '.xlsx'],
  zip: ['.rar', '.zip'],
  all: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.rar', '.zip', '.jpg', '.jpeg', '.png', '.bmp'],
  img: ['.webp', '.tif', '.pjp', '.jfif', '.pjpeg', '.avif', '.ico', '.tiff', '.gif', '.svg', '.bmp', '.png', '.xbm', '.jxl', '.jpeg', '.svgz', '.jpg'],
  imgLimit: ['.png', '.jpeg', '.jpg'],
  video: ['.ogm', '.wmv', '.mpeg', '.asx', '.mpg', '.ogv', '.webm', '.mov', '.mp4', '.m4v', '.avi'],
  busi: ['.bsq', '.hdr', '.sta'],
  positionFile: ['.kml', '.kmz', '.shp'],
  document: ['.txt', '.xls', '.xlsx', '.doc', '.docx']
};
/**
 * 校验类型
 * required: 必填，可空格，空白字符等
 * inputNotSpace: 不能包含空格，其他空白字符
 * email: 验证邮箱
 * phone: 验证手机
 * idNumber: 身份证号
 * url: url
 * password: 密码，仅由英文字母，数字以及下划线组成
 **/
export enum RuleType {
  required = 'required',
  inputNotSpace = 'inputNotSpace',
  email = 'email',
  phone = 'phone',
  idNumber = 'idNumber',
  url = 'url',
  password = 'password',
  selectRequired = 'selectRequired',
  notOnlySpace = 'notOnlySpace',
  stringCount = '字符数限制'
}