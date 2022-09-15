/**
 *@description 鼠标打点绘制多边形的方法
 *@author cy
 *@date 2022-03-24 09:50
 **/
import { fabric } from 'fabric';
import { handleMarkColor } from '@utils/CommonVars';

export default class AddPolyByMouseFunc {
  private roof: any = null;
  private roofPoints: Array<any> = [];
  private lines: Array<any> = [];
  private lineCounter: number = 0;
  private pencilColor = handleMarkColor;
  private pencilWidth: number = 2;
  private canvas: any = null;
  constructor() {

  }
  /**
   * @description 鼠标down事件，绘制一条line
   * @param mouseFrom 起始点
   * @param canvas 画布
   * @param color line的颜色
   * @param width line的宽度
   */
  public mouseDown = (mouseFrom: { x: number, y: number }, realCanvas: any, color?: string, width?: number) => {
    this.pencilColor = color || this.pencilColor;
    this.pencilWidth = width || this.pencilWidth;
    this.canvas = realCanvas;
    let zoom: any = this.canvas.getZoom();
    // 使用以下这种重新赋值的方式，避免引用赋值传递地址，更改roofPoint的值
    let a: { x: number, y: number } = { x: mouseFrom.x / zoom, y: mouseFrom.y / zoom };
    this.roofPoints.push(a);
    let points = [a.x, a.y, a.x, a.y];
    this.lines.push(new fabric.Line(points, {
      strokeWidth: this.pencilWidth,
      selectable: false,
      stroke: this.pencilColor
    }));
    this.canvas.add(this.lines[this.lineCounter]);
    this.lineCounter++;
  };
  public mouseMove = (mouseTo: { x: number, y: number }) => {
    // 如果有第一个点，则将鼠标移动到的当前点mouseTo的前一个点绘制的line的x2，y2设置为mouseTo的点，就可以将上一个点和现在的点连接起来
    if (this.lines[0] !== null && this.lines[0] !== undefined) {
      let zoom: any = this.canvas.getZoom();
      let x = mouseTo.x / zoom;
      let y = mouseTo.y / zoom;
      this.lines[this.lineCounter - 1].set({
        x2: x,
        y2: y
      });
      this.canvas.renderAll();
    }
  };
  public mouseDBlclick = () => {
    if (this.lines.length > 0) {
      this.lines.forEach(item => this.canvas.remove(item));
      this.makeRoof();
      this.canvas.add(this.roof);
      this.canvas.renderAll();
      this.roofPoints = [];
      this.lines = [];
      this.lineCounter = 0;
      return this.roof;
    }
  };
  public mouseRightClick = (e: any) => {
    if (!this.canvas) return;
    let offsetX = this.canvas.calcOffset().viewportTransform[4];
    let offsetY = this.canvas.calcOffset().viewportTransform[5];
    const x = Math.round(e.offsetX - offsetX);
    const y = Math.round(e.offsetY - offsetY);
    this.cancelPreLine({ x, y });
  };

  // 删除上一条线
  public cancelPreLine = (mouseTo: { x: number, y: number }) => {
    if (this.lines.length > 0 && this.lineCounter > 0) {
      if (this.lineCounter > 1) {
        this.lines[this.lineCounter - 2].set({
          x2: mouseTo.x,
          y2: mouseTo.y
        });
      }
      this.canvas.remove(this.lines[this.lineCounter - 1]); // 在画布中删除上一条line
      this.lines.splice(this.lineCounter - 1, 1); // 在lines数组中删除上一条
      this.lineCounter = this.lineCounter - 1; // lines的条数减1
      this.roofPoints.splice(this.roofPoints.length - 1, 1);
      this.canvas.renderAll();
    }
  };
  // 将多边形还原成线条
  public cancelPolyToLine = (points: Array<any>, canvas: any) => {
    const polyPoints = points;
    // let linePoints = [];
    for (let i = 0; i < polyPoints.length - 1; i++) {
      let point = polyPoints[i];
      let a: { x: number, y: number, index: number } = { x: point.x, y: point.y, index: i };
      this.roofPoints.push(a);
      let x2 = a.x;
      let y2 = a.y;
      if (polyPoints[i + 1]) {
        x2 = polyPoints[i + 1].x;
        y2 = polyPoints[i + 1].y;
      }
      let points = [a.x, a.y, x2, y2];
      let cancelPoint = new fabric.Line(points, {
        strokeWidth: this.pencilWidth,
        selectable: false,
        stroke: this.pencilColor,
      });
      cancelPoint['drawNotComplete'] = true; // 标识多边形还未绘制结束
      this.lines.push(cancelPoint);
      this.canvas.add(this.lines[this.lineCounter]);
      this.lineCounter++;
    }
  };
  public makeRoof = () => {
    let left = this.findLeftPaddingForRoof(this.roofPoints);
    let top = this.findTopPaddingForRoof(this.roofPoints);
    this.roof = new fabric.Polygon(this.roofPoints, {
      fill: 'rgba(0,0,0,0)',
      selectionBackgroundColor: 'rgba(100,100,100,0.25)',
      strokeWidth: this.pencilWidth,
      stroke: this.pencilColor,
      left: left,
      top: top
    });
  };
  public findTopPaddingForRoof = (roofPoints: any) => {
    let result = 999999;
    for (let f = 0; f < this.lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  };
  public findLeftPaddingForRoof = (roofPoints: any) => {
    let result = 999999;
    for (let i = 0; i < this.lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  };
  // return { mouseDown, mouseMove, mouseDBlclick, mouseRightClick };
}
// export const addPolyByMouseFunc = () => {
//   let roof = null;
//   let roofPoints: Array<any> = [];
//   let lines: Array<any> = [];
//   let lineCounter = 0;
//   let pencilColor = handleMarkColor;
//   let pencilWidth = 2;
//   let canvas: any = null;
//   /**
//    * @description 鼠标down事件，绘制一条line
//    * @param mouseFrom 起始点
//    * @param canvas 画布
//    * @param color line的颜色
//    * @param width line的宽度
//    */
//   const mouseDown = (mouseFrom: { x: number, y: number }, realCanvas: any, color?: string, width?: number) => {
//     pencilColor = color || pencilColor;
//     pencilWidth = width || pencilWidth;
//     canvas = realCanvas;
//     let zoom: any = canvas.getZoom();
//     // 使用以下这种重新赋值的方式，避免引用赋值传递地址，更改roofPoint的值
//     let a: { x: number, y: number } = { x: mouseFrom.x / zoom, y: mouseFrom.y / zoom };
//     roofPoints.push(a);
//     let points = [a.x, a.y, a.x, a.y];
//     lines.push(new fabric.Line(points, {
//       strokeWidth: pencilWidth,
//       selectable: false,
//       stroke: pencilColor
//     }));
//     canvas.add(lines[lineCounter]);
//     lineCounter++;
//   };
//   const mouseMove = (mouseTo: { x: number, y: number }) => {
//     // 如果有第一个点，则将鼠标移动到的当前点mouseTo的前一个点绘制的line的x2，y2设置为mouseTo的点，就可以将上一个点和现在的点连接起来
//     if (lines[0] !== null && lines[0] !== undefined) {
//       let zoom: any = canvas.getZoom();
//       let x = mouseTo.x / zoom;
//       let y = mouseTo.y / zoom;
//       lines[lineCounter - 1].set({
//         x2: x,
//         y2: y
//       });
//       canvas.renderAll();
//     }
//   };
//   const mouseDBlclick = () => {
//     if (lines.length > 0) {
//       lines.forEach(item => canvas.remove(item));
//       makeRoof();
//       canvas.add(roof);
//       canvas.renderAll();
//       roofPoints = [];
//       lines = [];
//       lineCounter = 0;
//     }
//   };
//   const mouseRightClick = () => {
//     document.getElementById('view').oncontextmenu = (e: any) => {
//       if (!canvas) {
//         e.preventDefault();
//         return false;
//       }
//       let offsetX = canvas.calcOffset().viewportTransform[4];
//       let offsetY = canvas.calcOffset().viewportTransform[5];
//       const x = Math.round(e.offsetX - offsetX);
//       const y = Math.round(e.offsetY - offsetY);
//       cancelPreLine({ x, y });
//       e.preventDefault();
//       return false;
//     };
//   };
//
//   // 删除上一条线
//   const cancelPreLine = (mouseTo: { x: number, y: number }) => {
//     if (lines.length > 0 && lineCounter > 0) {
//       if (lineCounter > 1) {
//         lines[lineCounter - 2].set({
//           x2: mouseTo.x,
//           y2: mouseTo.y
//         });
//       }
//       canvas.remove(lines[lineCounter - 1]); // 在画布中删除上一条line
//       lines.splice(lineCounter - 1, 1); // 在lines数组中删除上一条
//       lineCounter = lineCounter - 1; // lines的条数减1
//       roofPoints.splice(roofPoints.length - 1, 1);
//       canvas.renderAll();
//     }
//   };
//   const makeRoof = () => {
//     let left = findLeftPaddingForRoof(roofPoints);
//     let top = findTopPaddingForRoof(roofPoints);
//     roof = new fabric.Polygon(roofPoints, {
//       fill: 'rgba(0,0,0,0)',
//       selectionBackgroundColor: 'rgba(100,100,100,0.25)',
//       strokeWidth: pencilWidth,
//       stroke: pencilColor,
//       left: left,
//       top: top
//     });
//   };
//   const findTopPaddingForRoof = (roofPoints: any) => {
//     let result = 999999;
//     for (let f = 0; f < lineCounter; f++) {
//       if (roofPoints[f].y < result) {
//         result = roofPoints[f].y;
//       }
//     }
//     return Math.abs(result);
//   };
//   const findLeftPaddingForRoof = (roofPoints: any) => {
//     let result = 999999;
//     for (let i = 0; i < lineCounter; i++) {
//       if (roofPoints[i].x < result) {
//         result = roofPoints[i].x;
//       }
//     }
//     return Math.abs(result);
//   };
//   return { mouseDown, mouseMove, mouseDBlclick, mouseRightClick };
// };