/**
 * @description: HomeHeader
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React from 'react';
import { Row, Col, Layout, Avatar, Space } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import './index.less';

const { Header } = Layout;

const HomeHeader = () => {
  // 注销登录
  const logOut = () => {
    sessionStorage.clear();
  };
  return (
    <>
      <Header className="headerfix">
        <Row justify="end">
          <Col style={{ display: 'flex' }}>
            <Space align="center" style={{ display: 'none' }}>
              <Space>
                <Avatar className="person-avatar" icon={<UserOutlined />} />
              </Space>
              <a onClick={logOut}>
                <PoweroffOutlined style={{ marginRight: 10 }} />
              </a>
            </Space>
          </Col>
        </Row>
      </Header>
    </>
  );
};
export default HomeHeader;
