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
    <Row style={{ width: '100%', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <HomeHeader />
      <Content style={{ width: '100%', margin: '80px 100px', backgroundColor: '#fff' }}>
        {children}
      </Content>
    </Row>
  );
};

export default Home;
