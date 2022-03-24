/**
 *@description fabric 工具栏
 *@author cy
 *@date 2022-03-24 16:07
 **/
import React from 'react';
import { Button, Menu, Space } from 'antd';
import {
  ArrowUpOutlined,
  BorderInnerOutlined,
  BorderOutlined,
  HighlightOutlined,
  StarOutlined
} from '@ant-design/icons';
import { IconFont } from '@utils/CommonFunc';

enum IDrawType {
  rect = 'rect', // 矩形
  round = 'round', // 圆
  polygon = 'polygon', // 多边形
  null = 'null',
  helpMark = '辅助标注',
  move = 'move', // 移动
  helpAdd = '正负修正',
  polyEdit = '编辑多边形',
  arrow = '箭头',
  mousePoly = '鼠标按点绘制多边形'
}
export interface IOptMenu {
  key: IDrawType,
  name: string,
  icon?: React.ReactNode,
  children?: Array<IOptMenu>
}
const FabricToolBar = () => {
  const optList: Array<IOptMenu> = [
    { key: IDrawType.rect, name: '矩形', icon: <BorderOutlined /> },
    { key: IDrawType.rect, name: '圆形', icon: <IconFont type="icon-yuanxing" /> },
    {
      key: IDrawType.rect, name: '多边形', icon: <StarOutlined />, children: [
        { key: IDrawType.rect, name: '移动绘制' },
        { key: IDrawType.rect, name: '按点绘制' },
      ]
    },
    { key: IDrawType.rect, name: '箭头', icon: <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} /> },
    { key: IDrawType.rect, name: '拖拽', icon: <IconFont type="icon-hand" />, children: [{ key: IDrawType.rect, name: '画布' }, { key: IDrawType.rect, name: '选框' }] },
    { key: IDrawType.rect, name: '选中', icon: <BorderOutlined />, children: [{ key: IDrawType.rect, name: '删除' }, { key: IDrawType.rect, name: '编辑' }] },
    { key: IDrawType.rect, name: '取消操作', icon: <BorderOutlined /> },
  ];
  return (
    <>
      <Menu>
        <Menu.Item icon={<BorderOutlined />}>矩形</Menu.Item>
        <Menu.Item icon={<IconFont type="icon-yuanxing" />}>圆形</Menu.Item>
      </Menu>

    </>
  );
};
export default FabricToolBar;