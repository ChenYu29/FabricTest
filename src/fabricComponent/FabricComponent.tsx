/**
 *@description 通用的fabric组件
 *@author cy
 *@date 2022-03-24 15:59
 **/
import React, { useState, useEffect } from 'react';
import FabricToolBar from './FabricToolBar';
import { Layout, message, Modal, Form, Input, Slider } from 'antd';
import FabricCanvas, { useFabricMarkFresh } from './FabricCanvas';
import { canvasMarkKey, helpMarkKey } from '@utils/CommonVars';
const { Sider, Content } = Layout;

export enum IDrawType {
  rect = 'rect', // 矩形
  round = 'round', // 圆
  polygon = 'polygon', // 多边形
  polygonByMove = '移动绘制多边形',
  mousePoly = '鼠标按点绘制多边形',
  null = 'null',
  helpMark = '辅助标注',
  drag = '拖拽',
  dragCanvas = '拖拽画布',
  dragObj = '拖拽元素',
  arrow = '箭头',
  selectTO = '选中',
  polyEdit = '编辑多边形',
  removeObj = '删除元素',
  cancelDO = '取消操作',
  save = '保存',
  setting = '设置',
}
interface IProps {
  markType: 'draw' | 'choose' | 'show'; // 标注 | 选区域查看图谱数据 | 只查看
  currentFile: any;
  leftChildren?: React.ReactNode;
  onSave?: (frameJson: any) => void; // 保存
  onDrawMouseDown?: () => void;
  onDrawMouseUp?: () => void;
  onDrawMouseMove?: () => boolean;
  onDBclick?: () => void;
  onSelection?: () => void;
}
const FabricComponent = (props: IProps) => {
  const {
    markType = 'show', currentFile = null,
    onSelection, onDBclick, onDrawMouseUp, onDrawMouseMove, onDrawMouseDown, onSave,
    leftChildren
  } = props;
  const [activeOpt, setActiveOpt] = useState<IDrawType>(IDrawType.cancelDO); // 当前画布操作项
  const [settingView, setSettingView] = useState<boolean>(false);
  const [pencilColor, setPencilColor] = useState<any>('#F44E3B');
  const [pencilWidth, setPencilWidth] = useState<any>(2);
  const { markCanvas, canvasFresh, getMarkCanvas, bgScale, setBgScale } = useFabricMarkFresh();
  useEffect(() => {
    setActiveOpt(IDrawType.dragCanvas);
  }, [currentFile]);
  const onOptClick = (type: IDrawType) => {
    if (type === IDrawType.removeObj) {
      if (!markCanvas.getActiveObject()) {
        message.error('请选择一个元素删除！');
        return;
      } else {
        markCanvas.remove(markCanvas.getActiveObject());
      }
    }
    if (type === IDrawType.polyEdit && !markCanvas.getActiveObject()) {
      message.error('请选择一个元素进行修正！');
      return;
    }
    if ((type === IDrawType.polyEdit) && markCanvas.getActiveObject().type !== 'polygon') { // 只对多边形进行修正
      message.error('请选择一个多边形进行修正！');
      return;
    }
    if (type === IDrawType.dragObj || activeOpt === IDrawType.dragObj || type === IDrawType.dragCanvas) {
      let objs = markCanvas.getObjects();
      if (objs) {
        objs.forEach((item: any) => {
          // 判断是否可拖拽元素，如果是moveMark，则可以拖拽，烦躁不能拖拽
          let lockDrag = type !== IDrawType.dragObj;
          item.set('lockMovementX', lockDrag).set('lockMovementY', lockDrag).set('lockRotation', lockDrag).set('lockScalingX', lockDrag).set('lockScalingY', lockDrag);
        });
      }
    }
    if (type === IDrawType.save) {
      saveMark();
    }
    if (type === IDrawType.setting) { setSettingView(true); }
    setActiveOpt(type);
  };

  const saveMark = () => {
    let canvasJson = markCanvas.toJSON([canvasMarkKey, 'autoInit', helpMarkKey]);
    let imgIndex = canvasJson.objects.findIndex((item: any) => item.type === 'image');
    if (canvasJson.objects.length === 0) {
      message.error({ content: '画布还未加载完成，请稍后保存', key: 'waitSaveMark' });
    } else if (imgIndex === -1 && canvasJson.objects.length === 1) {
      message.error({ content: '画布还未加载完成，请稍后保存', key: 'waitSaveMark' });
    } else if (imgIndex > -1 && canvasJson.objects.length === 1) {
      message.error({ content: '你还没有标注，请先标注', key: 'saveMark' });
    } else {
      let imgIndex = canvasJson.objects.findIndex((item: any) => item.type === 'image');
      let bgObj = canvasJson.objects[imgIndex];
      canvasJson.objects.splice(imgIndex, 1); // 删除画布中的背景图片
      canvasJson.objects.push({ // 标注是基于图片的，所以也需要保存图片信息
        ...bgObj,
        lockMovementX: true, // 禁止X轴移动
        lockMovementY: true, // 禁止Y轴移动
        lockRotation: true, // 禁止旋转
        selectable: false,
        evented: false
      });
      let filterPoints = canvasJson.objects.filter((item: any) => !item[helpMarkKey]); // 过滤掉辅助点
      onSave && onSave(JSON.stringify(filterPoints));
    }
  };
  const colorChange = (e: any) => {
    e.persist(); // 出于性能问题，将重用此合成事件。未保留之前，获取到的e.target为null，调用此方法保留原始合成事件
    setPencilColor(e.target.value);
  };
  const pencilSizeChange = (value: any) => { setPencilWidth(value); };
  return (
    <div id="content" style={{ width: '100%', display: 'flex' }}>
      <Sider collapsed={true} style={{ width: 60, height: '100%' }}>
        <FabricToolBar onOptClick={onOptClick} activeKey={activeOpt} />
      </Sider>
      <Content style={{ backgroundColor: '#ffc0cb38', height: 'calc(100vh - 100px)', width: 'calc(100vw - 300px)' }}>
        <FabricCanvas
          setMarkCanvas={getMarkCanvas}
          activeDrawType={activeOpt}
          currentFile={currentFile}
          markType={markType}
          onSelection={onSelection}
          onDBclick={onDBclick}
          onDrawMouseUp={onDrawMouseUp}
          onDrawMouseMove={onDrawMouseMove}
          onDrawMouseDown={onDrawMouseDown}
          drawColor={pencilColor}
          drawWidth={pencilWidth}
        />
      </Content>
      {leftChildren}
      <Modal visible={settingView} title="设置" footer={false} onCancel={() => setSettingView(false)}>
        <Form>
          <Form.Item label="画笔颜色">
            <Input type="color" onChange={colorChange} style={{ width: 100 }} defaultValue="#F44E3B" />
          </Form.Item>
          <Form.Item label="画笔大小">
            <Slider defaultValue={2} onAfterChange={pencilSizeChange} style={{ width: 200 }} max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default FabricComponent;