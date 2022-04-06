/**
 *@description
 *@author cy
 *@date 2022-03-24 16:01
 **/
import React, { useEffect, useState } from 'react';
import FabricComponent from './FabricComponent';
import test from '@static/img/test.jpg';
import { Button, List, Spin } from 'antd';
import { CheckCircleFilled, DownOutlined, UpOutlined } from '@ant-design/icons';
import { colors } from '@utils/CommonVars';

const imgStyle: React.CSSProperties = {
  height: 100,
  width: 'inherit',
};
const FabricUse = () => {
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{ current: number, pageSize: number, total: number }>({ current: 1, pageSize: 5, total: 0 });
  const [totalList, setTotalList] = useState<Array<any>>([]);
  const [fileList, setFileList] = useState<Array<any>>([]);
  useEffect(() => {
    let list = [
      { id: 'img-1', dataThumbnailPath: test, status: 0 },
      { id: 'img-2', dataThumbnailPath: test, status: 0 },
      { id: 'img-3', dataThumbnailPath: test, status: 1 },
      { id: 'img-4', dataThumbnailPath: test, status: 0 },
      { id: 'img-5', dataThumbnailPath: test, status: 1 },
      { id: 'img-6', dataThumbnailPath: test, status: 0 },
      { id: 'img-7', dataThumbnailPath: test, status: 0 },
      { id: 'img-8', dataThumbnailPath: test, status: 0 },
      { id: 'img-9', dataThumbnailPath: test, status: 0 },
      { id: 'img-10', dataThumbnailPath: test, status: 0 },
    ];
    setFileList(list);
  }, []);

  const changePagination = (type: 'up' | 'down') => { // 向上翻页current -1 ，向下翻页 current + 1
    let pageCurrent = type === 'up' ? (pagination.current - 1) : (pagination.current + 1);
    setPagination({ ...pagination, current: pageCurrent });
  };
  const getListItemStyle = (item: any) => { // 获取图片列表的样式，当前选中的边框样式不同
    const listItemStyle: React.CSSProperties = {
      padding: 5,
      marginBottom: 3,
      marginTop: 3,
      border: currentFile && item.id === currentFile.id ? '2px solid #08979C' : '1px solid #eee'
    };
    return listItemStyle;
  };
  return (
    <>
      <FabricComponent
        markType="draw" currentFile={{ dataPath: test }}
        leftChildren={(
          <div style={{ width: 200, overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
            {fileList.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', width: '100%', marginBottom: 10 }} className="fileList">
                <img width={180} height={100} src={item.dataThumbnailPath} />
                {/*<div style={{ background: '#fff url(' + item.dataThumbnailPath + ') no-repeat center / contain', ...imgStyle }}></div>*/}
                {/*{item.status === 1 && <CheckCircleFilled style={{ color: colors.primaryColor, position: 'absolute' }} />}*/}
              </div>
            ))}
            {/*<Button type="primary" onClick={() => changePagination('up')} block icon={<UpOutlined />} disabled={pagination.current === 1}></Button>*/}
            {/*<Spin spinning={loading}>*/}
            {/*  <List*/}
            {/*    itemLayout="vertical"*/}
            {/*    size="large"*/}
            {/*    split={false}*/}
            {/*    dataSource={fileList}*/}
            {/*    renderItem={item => (*/}
            {/*      <List.Item style={getListItemStyle(item)} onClick={() => setCurrentFile(item)}>*/}
            {/*        <div style={{ display: 'flex', width: '100%' }}>*/}
            {/*          <div style={{ background: '#fff url(' + item.dataThumbnailPath + ') no-repeat center / contain', ...imgStyle }}></div>*/}
            {/*          /!*{item.status === WhetherFlag.yes && <CheckCircleFilled style={{ color: colors.primaryColor, position: 'absolute' }} />}*!/*/}
            {/*        </div>*/}
            {/*      </List.Item>*/}
            {/*    )}*/}
            {/*  />*/}
            {/*</Spin>*/}
            {/*<Button type="primary" onClick={() => changePagination('down')} block icon={<DownOutlined />} disabled={pagination.current * pagination.pageSize >= pagination.total}></Button>*/}
          </div>
        )}
      />
    </>
  );
};
export default FabricUse;