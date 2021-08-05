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
enum IDrawType {
  rect = 'rect', // 矩形
  round = 'round', // 圆
  null = 'null',
  move = 'move' // 移动
}
const OptImg = () => {
  const [canvas, setCanvas] = useState(null);
  const [drawType, setDrawType] = useState<IDrawType>(IDrawType.null);
  const [canAddFlag, setCanAddFlag] = useState(false);
  let mouseFrom = { x: 0, y: 0 }; // 画笔初始位置
  let mouseTo = { x: 0,  y: 0}; // 画笔终止位置
  let isDown: boolean = false; // 鼠标落下
  // 定义变量记录最后一次的偏移量和缩放比例
  let relationship = {x: 0, y: 0, zoom: 1};
  useEffect(() => {
    let testCanvas = new fabric.Canvas('canvas', {
      // backgroundImage: test,
      backgroundColor: 'pink',
      width: 1000,
      height: 500,
      // allowTouchScrolling: true,
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
        if (drawType === IDrawType.rect || drawType === IDrawType.round) { // 可以添加选框
          let offsetX = canvas.calcOffset().viewportTransform[4];
          let offsetY = canvas.calcOffset().viewportTransform[5];
          const x: number = Math.round(o.e.offsetX - offsetX);
          const y: number = Math.round(o.e.offsetY - offsetY);
          mouseFrom.x = x;
          mouseFrom.y = y;
          // 计算矩形长宽
          let left = getTransformedPosX(o.pointer.x  / relationship.zoom - relationship.x);
          let top = getTransformedPosY(o.pointer.y  / relationship.zoom - relationship.y);

          let drawObj = null;
          if (drawType === IDrawType.rect) {
            drawObj = new fabric.Rect({
              left: left,
              top: top,
              width: 0,
              height: 0,
              strokeWidth: 4,
              stroke: '#c60001',
              fill: 'rgba(255, 255, 255, 0)',
              selectionBackgroundColor: 'rgba(100,100,100,0.25)',
            });
          } else if (drawType === IDrawType.round) {
            drawObj = new fabric.Circle({
              left: left,
              top: top,
              width: 10,
              height: 10,
              strokeWidth: 4,
              stroke: '#c60001',
              fill: 'rgba(255, 255, 255, 0)',
              selectionBackgroundColor: 'rgba(100,100,100,0.25)',
              radius: 0,
              hasControls: true
            });
          }
          // 绘制矩形
          canvas.add(drawObj);
          canvas.renderAll();
          canvas.setActiveObject(drawObj);
        } else if (drawType === IDrawType.move) {

        }
      });
      canvas.on('mouse:move', (o: any) => {
        if (!isDown) {

        } else if (drawType === IDrawType.move) {
          let delta = new fabric.Point(o.e.movementX, o.e.movementY);
          canvas.relativePan(delta);
          //累计每一次移动时候的偏移量
          relationship.x += o.e.movementX / relationship.zoom;
          relationship.y += o.e.movementY / relationship.zoom;
          console.log('o.e.movementX', relationship.x)
        } else if (drawType === IDrawType.rect || drawType === IDrawType.round) {
          let offsetX = canvas.calcOffset().viewportTransform[4];
          let offsetY = canvas.calcOffset().viewportTransform[5];
          // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          mouseTo.x = Math.round(o.e.offsetX - offsetX)
          mouseTo.y = Math.round(o.e.offsetY - offsetY)
          let zoom = canvas.getZoom();
          let width = Math.abs(mouseTo.x - mouseFrom.x) / zoom;
          let height = Math.abs(mouseTo.y - mouseFrom.y) / zoom;
          let square = canvas.getActiveObject();
          // 左上角为起点
          if (mouseFrom.x > mouseTo.x) { // 以x轴方向：向起始点左边拖动
            square.set('left', Math.abs(mouseTo.x) / zoom)
          }
          if (mouseFrom.y > mouseTo.y) { // 以y轴方向：向起始点上面拖动
            square.set('top', Math.abs(mouseTo.y) / zoom)
          }
          if (drawType === IDrawType.rect) {
            square.set('width', width).set('height', height);
          } else if (drawType === IDrawType.round) {
            // 计算矩形长宽
            let left = getTransformedPosX(mouseFrom.x);
            let top = getTransformedPosY(mouseFrom.y);
            const radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2 / zoom;
            square.set('radius', radius);
          }

          canvas.renderAll();
        }

      });
      canvas.on('mouse:up', (o: any) => {
        isDown = false;
      });
    }
  }, [canvas, drawType]);
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
    setDrawType(IDrawType.move); // 关闭添加选框的操作
    let nowZoom = canvas.getZoom();
    if (type === IZoomType.big) {
      nowZoom += 0.1;
    } else {
      nowZoom -= 0.1
    }
    canvas.setZoom(nowZoom);
    relationship.zoom = nowZoom;
  };
  const addRect = (type: IDrawType) => {
    setDrawType(type);
  };
  const deleteObj = () => {
    canvas.getActiveObjects().forEach((obj) => {//循环删除多个
      canvas.remove(obj);
    });
    canvas.discardActiveObject(); // 避免选中多个一起删除后会有遗留的选中框没有删除
    canvas.renderAll();
  }
  const onWheel = (e: any) => {};

  return (
    <div style={{ width: '100%', height: '100%' }} onWheel={onWheel}>
      <Row style={{ marginBottom: 5 }}>
        <Space>
          <Button onClick={() => changeZoom(IZoomType.big)}>放大 + </Button>
          <Button onClick={() => changeZoom(IZoomType.small)}>缩小 - </Button>
          <Button onClick={deleteObj}>删除</Button>
          <Button onClick={() => addRect(IDrawType.rect)}>添加选框</Button>
          <Button onClick={() => addRect(IDrawType.round)}>添加圆框</Button>
          <Button onClick={() => addRect(IDrawType.move)}>移动画布</Button>
          <Button onClick={() => addRect(IDrawType.null)}>关闭添加选框</Button>
        </Space>
      </Row>
      <canvas id="canvas" />
    </div>
  );
};
export default OptImg;
