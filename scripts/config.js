/**
 * @description: 服务器配置文件
 * @author: cnn
 * @createTime: 2021/2/8 10:30
 **/
/**
 * @hostType 必填，服务器类型 'linux' || 'windows'
 * @host 必填，服务器ip地址 '127.0.0.1'
 * @user 必填，服务器用户名 'root'
 * @password 必填，服务器密码 '123456'
 * @path 必填，打包上传地址 linux: '/opt/view/dist.zip'; windows: 'D:/opt/view/dist.zip'
 * @shPath windows 服务器可为空，脚本目录，linux 服务器需要该参数 '/opt/sh'
 * @command 必填，执行的命令, linux: 'sh deployMain.sh'; windows: 'D:/opt/sh/deploy.bat'
 **/
// path 需精确到文件路径
module.exports = (mode) => {
  let config = {
    platform: '/',
    serverPath: '/api/'
  };
  // 测试环境配置
  if (mode === 'test') {
    config = {
      hostType: 'windows',
      host: '47.118.60.93',
      user: 'administrator',
      password: 'meehoo2012!',
      path: 'C:/scmp/scmp_js/dist.zip',
      shPath: '/opt/sh',
      command: 'C:/scmp/jsDeploy.bat',
      ...config
    };
  } else {
    // 正式环境配置
    config = {
      hostType: 'windows',
      host: '127.0.0.1',
      user: 'admin',
      password: '123456',
      path: 'D:/opt/view/dist.zip',
      shPath: '/opt/sh',
      command: 'D:/opt/sh/deploy.bat',
      ...config
    };
  }
  return config;
};
