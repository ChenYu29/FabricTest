/**
 *@description
 *@author cy
 *@date 2022-03-24 09:50
 **/
import { fabric } from 'fabric';
import { handleMarkColor } from '@utils/CommonVars';

export const addPolyByMouseFunc = () => {
  let roof = null;
  let roofPoints: Array<any> = [];
  let lines: Array<any> = [];
  let lineCounter = 0;
  let pencilColor = handleMarkColor;
  let pencilWidth = 2;
  let canvas: any = null;
  /**
   * @description 鼠标down事件，绘制一条line
   * @param mouseFrom 起始点
   * @param canvas 画布
   * @param color line的颜色
   * @param width line的宽度
   */
  const mouseDown = (mouseFrom: { x: number, y: number }, realCanvas: any, color?: string, width?: number) => {
    pencilColor = color || pencilColor;
    pencilWidth = width || pencilWidth;
    canvas = realCanvas;
    let zoom: any = canvas.getZoom();
    // 使用以下这种重新赋值的方式，避免引用赋值传递地址，更改roofPoint的值
    let a: { x: number, y: number } = { x: mouseFrom.x / zoom, y: mouseFrom.y / zoom };
    roofPoints.push(a);
    let points = [a.x, a.y, a.x, a.y];
    lines.push(new fabric.Line(points, {
      strokeWidth: pencilWidth,
      selectable: false,
      stroke: pencilColor
    }));
    canvas.add(lines[lineCounter]);
    lineCounter++;
  };
  const mouseMove = (mouseTo: { x: number, y: number }) => {
    // 如果有第一个点，则将鼠标移动到的当前点mouseTo的前一个点绘制的line的x2，y2设置为mouseTo的点，就可以将上一个点和现在的点连接起来
    if (lines[0] !== null && lines[0] !== undefined) {
      let zoom: any = canvas.getZoom();
      let x = mouseTo.x / zoom;
      let y = mouseTo.y / zoom;
      lines[lineCounter - 1].set({
        x2: x,
        y2: y
      });
      canvas.renderAll();
    }
  };
  const mouseDBlclick = () => {
    if (lines.length > 0) {
      lines.forEach(item => canvas.remove(item));
      makeRoof();
      canvas.add(roof);
      canvas.renderAll();
      roofPoints = [];
      lines = [];
      lineCounter = 0;
    }
  };
  const mouseRightClick = (target: string) => {
    document.getElementById('view').oncontextmenu = (e: any) => {
      console.log('rrrrr', e);
      if (lines.length > 0) {
        console.log('lines', lines);
        canvas.remove(lines[lines.length - 1]);
        lineCounter = lineCounter - 1;
        roofPoints.splice(roofPoints.length - 1, 1);
        canvas.renderAll();
      }
      e.preventDefault();
      return false;
    };
  };

  const makeRoof = () => {
    let left = findLeftPaddingForRoof(roofPoints);
    let top = findTopPaddingForRoof(roofPoints);
    roof = new fabric.Polygon(roofPoints, {
      fill: 'rgba(0,0,0,0)',
      selectionBackgroundColor: 'rgba(100,100,100,0.25)',
      strokeWidth: pencilWidth,
      stroke: pencilColor,
      left: left,
      top: top
    });
  };
  const findTopPaddingForRoof = (roofPoints: any) => {
    let result = 999999;
    for (let f = 0; f < lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  };
  const findLeftPaddingForRoof = (roofPoints: any) => {
    let result = 999999;
    for (let i = 0; i < lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  };
  return { mouseDown, mouseMove, mouseDBlclick, mouseRightClick };
};