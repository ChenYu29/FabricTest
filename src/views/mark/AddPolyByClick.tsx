/**
 *@description 利用鼠标点击事件绘制多边形
 *@author cy
 *@date 2022-03-23 16:15
 **/
import React, { useEffect, useRef } from 'react';
import { Button, Modal, Space } from 'antd';
import { fabric } from 'fabric';
import AddPolyByMouseFunc from './AddPolyByClickFunc';
enum IDrawType {
  draw = '绘制',
  notDraw = '不绘制'
}
let canvas: any = null;
let drawType = IDrawType.notDraw;
// let isDown = false;
// let linePoints = [];
// let roof: null;
// let roofPoints: Array<any> = [];
// let lines: Array<any> = [];
// let lineCounter = 0;
// let drawingObject = {
//   type: '',
//   background: '',
//   border: ''
// };
// let mouseFrom = { x: 0, y: 0 };

let addFun = null;
let isDown = false;
const AddPolyByClick = () => {
  const contentRef: any = useRef();
  const canvasRef: any = useRef();
  useEffect(() => {
    canvas = new fabric.Canvas('addPoly', {
      backgroundColor: 'rgba(253,230,248,0.28)',
      width: contentRef.current.clientWidth, // 设置和外面div的宽高一样
      height: contentRef.current.clientHeight,
      selection: false, // 不会出现拖曳选择区块
      hoverCursor: 'default', // 鼠标移入元素时，设置指针样式未默认
      stopContextMenu: false, // 防止右键点击出现系统菜单,根据需求需要鼠标右键事件，设置为false，不然在画布上的右击事件无
    });
    addFun = new AddPolyByMouseFunc();
    bindEvents();
  }, []);
  const bindEvents = () => {
    if (canvas.__eventListeners && canvas.__eventListeners['mouse:down'].length > 0) { // 删除监听事件
      canvas.__eventListeners['mouse:down'] = [];
      canvas.__eventListeners['mouse:move'] = [];
      canvas.__eventListeners['mouse:up'] = [];
      canvas.__eventListeners['mouse:dblclick'] = [];
    }
    onMouseDown();
    onMouseMove();
    onMouseUp();
    onDBClick();
    document.getElementById('view').oncontextmenu = (e: any) => {
      if (!canvas) {
        e.preventDefault();
        return false;
      }
      addFun.mouseRightClick(e);
      e.preventDefault();
      return false;
    };
  };
  const onMouseDown = () => {
    canvas.on('mouse:down', (o: any) => {
      if (o.target) {
        o.e.preventDefaultAction = true;
        o.e.preventDefault();
        o.e.stopPropagation();
      }
      isDown = true;
      canvas.selection = false;
      let offsetX = canvas.calcOffset().viewportTransform[4];
      let offsetY = canvas.calcOffset().viewportTransform[5];
      const x: number = Math.round(o.e.offsetX - offsetX);
      const y: number = Math.round(o.e.offsetY - offsetY);
      if (drawType === IDrawType.draw) {
        addFun.mouseDown({ x, y }, canvas);
      }
    });
  };
  const onMouseMove = () => {
    canvas.on('mouse:move', (o: any) => {
      if (!isDown) return;
      let offsetX = canvas.calcOffset().viewportTransform[4];
      let offsetY = canvas.calcOffset().viewportTransform[5];
      const x = Math.round(o.e.offsetX - offsetX);
      const y = Math.round(o.e.offsetY - offsetY);
      if (drawType === IDrawType.draw) {
        addFun.mouseMove({ x, y });
      }
    });
  };
  const onMouseUp = () => {

  };
  const onDBClick = () => {
    canvas.on('mouse:dblclick', (e: any) => {
      if (drawType === IDrawType.draw) {
        let poly = addFun.mouseDBlclick();
        isDown = false;
        Modal.confirm({
          title: '确认添加',
          content: '可以取消接着绘制',
          onCancel: () => {
            isDown = true;
            let points = poly.points;
            canvas.remove(poly);
            addFun.cancelPolyToLine(points, canvas);
          }
        });
      }
    });


  };
  const clearCanvas = () => {
    let objs = canvas.getObjects();
    objs.forEach((obj: any) => canvas.remove(obj)); // 注意：此处若使用clear()会将画布的背景颜色也重置了
    canvas.renderAll();
  };
  const changeDrawType = (type: any) => {
    drawType = type;
  };
  return (
    <div ref={contentRef} id="view" style={{ width: '100%', height: 'calc(100vh - 300px)' }}>
      <Space>
        <Button onClick={clearCanvas}>清空画布</Button>
        <Button onClick={() => changeDrawType(IDrawType.draw)}>绘制</Button>
        <Button onClick={() => changeDrawType(IDrawType.notDraw)}>不绘制</Button>
      </Space>
      <canvas ref={canvasRef} id="addPoly" />
    </div>
  );
};
export default AddPolyByClick;