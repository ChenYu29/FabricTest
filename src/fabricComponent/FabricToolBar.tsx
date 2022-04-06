/**
 *@description fabric 工具栏
 *@author cy
 *@date 2022-03-24 16:07
 **/
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { ArrowUpOutlined, BorderOutlined, StarOutlined, StopOutlined, CheckCircleOutlined, FileImageOutlined, SettingOutlined } from '@ant-design/icons';
import { IconFont } from '@utils/CommonFunc';
import { IDrawType } from './FabricComponent';

const { SubMenu } = Menu;


export interface IOptMenu {
  key: IDrawType,
  name: string,
  icon?: React.ReactNode,
  children?: Array<IOptMenu>
}
interface IProps {
  onOptClick: (key: IDrawType) => void;
  activeKey: IDrawType;
  excludeKeys?: Array<IDrawType>;
}
const FabricToolBar = (props: IProps) => {
  const { excludeKeys = [], onOptClick, activeKey = IDrawType.dragCanvas } = props;
  const [currentOpt, setCurrentOpt] = useState<IDrawType>(IDrawType.dragCanvas);
  useEffect(() => {
    setCurrentOpt(activeKey);
  }, [activeKey]);
  const optList: Array<IOptMenu> = [
    { key: IDrawType.rect, name: '矩形', icon: <BorderOutlined /> },
    { key: IDrawType.round, name: '圆形', icon: <IconFont type="icon-yuanxing" /> },
    {
      key: IDrawType.polygon, name: '多边形', icon: <StarOutlined />, children: [
        { key: IDrawType.polygonByMove, name: '移动绘制' },
        { key: IDrawType.mousePoly, name: '按点绘制' },
      ]
    },
    { key: IDrawType.arrow, name: '箭头', icon: <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} /> },
    {
      key: IDrawType.drag, name: '拖拽', icon: <IconFont type="icon-hand" />, children: [
        { key: IDrawType.dragCanvas, name: '画布' }, { key: IDrawType.dragObj, name: '选框' }]
    },
    {
      key: IDrawType.selectTO, name: '选中', icon: <CheckCircleOutlined />, children: [
        { key: IDrawType.removeObj, name: '删除' }, { key: IDrawType.polyEdit, name: '编辑' }]
    },
    { key: IDrawType.cancelDO, name: '禁止操作', icon: <StopOutlined /> },
    { key: IDrawType.setting, name: '设置', icon: <SettingOutlined /> },
    { key: IDrawType.save, name: '保存', icon: <FileImageOutlined /> },
  ];
  const menuClick = (menu: any) => {
    setCurrentOpt(menu.key);
    onOptClick(menu.key);
  };
  const renderMenu = (menus: Array<IOptMenu>) => {
    return menus.map(item => {
      if (excludeKeys.indexOf(item.key) > -1) { // 需要排除的操作项
        return null;
      }
      if (item.children) {
        return (
          <SubMenu key={item.key} title={item.name} icon={item.icon}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} title={item.name} icon={item.icon}>{item.name}</Menu.Item>
        );
      }
    });
  };
  return (
    <>
      <Menu onClick={menuClick} selectedKeys={[currentOpt]}>
        {renderMenu(optList)}
      </Menu>
    </>
  );
};
export default FabricToolBar;