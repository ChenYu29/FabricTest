/**
 *@description 通用的fabric组件
 *@author cy
 *@date 2022-03-24 15:59
 **/
import React from 'react';
import FabricToolBar from './FabricToolBar';
import { Layout } from 'antd';
const { Sider, Content } = Layout;

const FabricComponent = () => {
  return (
    <Layout>
      <div style={{ width: 60, height: '100%' }}>
        <FabricToolBar />
      </div>
    </Layout>
  );
};
export default FabricComponent;