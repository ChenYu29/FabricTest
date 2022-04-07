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
import './myfabric.less';

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
  return (
    <>
      <FabricComponent
        markType="draw" currentFile={{ dataPath: test }}
        leftChildren={(
          <div className="fabric-list-content" style={{ width: 200, overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
            {fileList.map((item: any) => (
              <div key={item.id} onClick={() => setCurrentFile(item)} className={item.status === 1 ? 'fabricImg-list fabricImg-list-done' : 'fabricImg-list'}>
                <img width={180} height={100} src={item.dataThumbnailPath} className="fabric-img" />
              </div>
            ))}
          </div>
        )}
      />
    </>
  );
};
export default FabricUse;