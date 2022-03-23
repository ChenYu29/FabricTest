/**
 * @description: 自定义公共hook
 * @author: cy
 * @createTime: 2020/8/28 11:30
 **/
import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
/**
 * @description 清空表单，当关闭模态框时
 * @param form 表单
 * @param visible 模态框显示状态
 */
const useResetFormOnCloseModal = ({ form, visible }: any) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};
const ellipsisRender = {
  ellipsis: {
    showTitle: false,
  },
  render: (text: any) => (
    <Tooltip placement="topLeft" title={text}>
      {text}
    </Tooltip>
  )
};
export { useResetFormOnCloseModal, ellipsisRender };

