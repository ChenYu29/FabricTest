/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React from 'react';
import { Row, Layout } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import './index.less';
import HomeHeader from './HomeHeader';

const { Content } = Layout;

interface IProps {
  children: any
}

const Home = (props: IProps) => {
  const { children } = props;
  return (
    <Layout>
      <HomeHeader />
      <Content className="content">
        {children}
      </Content>
    </Layout>
  );
};

export default Home;
