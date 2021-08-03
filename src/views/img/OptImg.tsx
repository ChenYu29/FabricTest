/**
 * @description: 操作图像
 * @author: cy
 * @createTime: 2021/7/30 15:01
 **/
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import test from '@static/img/test.jpg';
import { Button, Row, Space } from 'antd';
enum IZoomType {
  big = 'big', // 放大
  small = 'small' // 缩小
}
const OptImg = () => {
  const [canvas, setCanvas] = useState(null);
  const [canAddFlag, setCanAddFlag] = useState(false);
  let mouseFrom = { x: 0, y: 0 }; // 画笔初始位置
  let mouseTo = { x: 0,  y: 0}; // 画笔终止位置
  let isDown: boolean = false; // 鼠标落下
  useEffect(() => {
    let testCanvas = new fabric.Canvas('canvas', {
      // backgroundImage: test,
      backgroundColor: 'pink',
      width: 1000,
      height: 500,
    });
    fabric.Image.fromURL(test, (oImg) => {
      oImg.set('scaleX', testCanvas.width / oImg.width).set('scaleY', testCanvas.height / oImg.height).set('selectable', false).set('evented', false);
      testCanvas.add(oImg);
    })
    setCanvas(testCanvas);
  }, []);
  useEffect(() => {
    if (canvas) {
      if (canvas.__eventListeners && canvas.__eventListeners['mouse:down'].length > 0) { // 删除监听事件
        canvas.__eventListeners['mouse:down'] = [];
        canvas.__eventListeners['mouse:move'] = [];
        canvas.__eventListeners['mouse:up'] = [];
      }
      canvas.on('mouse:down', (o: any) => {
        if(canvas.getActiveObject()){ //避免点击移动时创建新的框
          return false;
        }
        isDown = true;
        if (canAddFlag) { // 可以添加选框
          let offsetX = canvas.calcOffset().viewportTransform[4];
          let offsetY = canvas.calcOffset().viewportTransform[5];
          const x: number = Math.round(o.e.offsetX - offsetX);
          const y: number = Math.round(o.e.offsetY - offsetY);
          mouseFrom.x = x;
          mouseFrom.y = y;
          // 计算矩形长宽
          let left = getTransformedPosX(mouseFrom.x);
          let top = getTransformedPosY(mouseFrom.y);
          let square = new fabric.Rect({
            left: left,
            top: top,
            width: 10,
            height: 10,
            strokeWidth: 4,
            stroke: '#c60001',
            fill: 'rgba(255, 255, 255, 0)',
            selectionBackgroundColor: 'rgba(100,100,100,0.25)',
          });
          // 绘制矩形
          canvas.add(square);
          canvas.renderAll();
          canvas.setActiveObject(square);
        }
      });
      canvas.on('mouse:move', (o: any) => {
        if (!isDown) {
          // let delta = new fabric.Point(o.e.movementX, o.e.movementY);
          // canvas.relativePan(delta);
        } else if (canAddFlag) {
          let offsetX = canvas.calcOffset().viewportTransform[4];
          let offsetY = canvas.calcOffset().viewportTransform[5];
          // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          mouseTo.x = o.e.offsetX - offsetX
          mouseTo.y = o.e.offsetY - offsetY
          let zoom = canvas.getZoom();
          // 计算矩形长宽
          let left = getTransformedPosX(mouseFrom.x);
          let top = getTransformedPosY(mouseFrom.y);
          let width = Math.abs(mouseTo.x - mouseFrom.x) / zoom;
          let height = Math.abs(mouseTo.y - mouseFrom.y) / zoom;
          let square = canvas.getActiveObject();

          if (mouseFrom.x > mouseTo.x) {
            square.set('left', Math.abs(mouseTo.x) / zoom)
          }
          if (mouseFrom.y > mouseTo.y) {
            square.set('top', Math.abs(mouseTo.y) / zoom)
          }
          square.set('width', width).set('height', height);
          canvas.renderAll();
        }

      });
      canvas.on('mouse:up', (o: any) => {
        isDown = false;
      });
    }
  }, [canvas, canAddFlag]);
  // 因为画布会进行移动或缩放，所以鼠标在画布上的坐标需要进行相应的处理才是相对于画布的可用坐标
  const getTransformedPosX = (x: number) => {
    let zoom = Number(canvas.getZoom())
    return (x - canvas.viewportTransform[4]) / zoom;
  };
  const getTransformedPosY = (y: number) => {
    let zoom = Number(canvas.getZoom())
    return (y - canvas.viewportTransform[5]) / zoom;
  };
  const changeZoom = (type: IZoomType) => { // 放大和缩小
    if (canvas) {
      let nowZoom = canvas.getZoom();
      if (type === IZoomType.big) {
        canvas.setZoom(nowZoom + 0.1);
      } else {
        canvas.setZoom(nowZoom - 0.1);
      }
    }
  };
  const addRect = () => {
    setCanAddFlag(!canAddFlag);
  };
  const onWheel = (e: any) => {};

  return (
    <div style={{ width: '100%', height: '100%' }} onWheel={onWheel}>
      <Row style={{ marginBottom: 5 }}>
        <Space>
          <Button onClick={() => changeZoom(IZoomType.big)}>放大 + </Button>
          <Button onClick={() => changeZoom(IZoomType.small)}>缩小 - </Button>
          <Button onClick={addRect}>添加选框</Button>
          <Button onClick={() => canvas.dispose()}>dispose</Button>
        </Space>
      </Row>
      <canvas id="canvas" />
    </div>
  );
};
export default OptImg;
