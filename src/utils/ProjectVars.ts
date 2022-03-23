/**
 * @description: 项目相关的常量配置
 * @author: cy
 * @createTime: 2021/8/16 10:50
 **/
/**
 * 项目名称
 **/
export const projectName: string = '珊瑚图谱库';
/**
 * 服务器部署前缀路径
 * **/
const serverConfigs = require('./../../scripts/config.js');
export const { platform } = serverConfigs();

