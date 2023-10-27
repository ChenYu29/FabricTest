/**
 *@description 使用fabric标注
 *@author cy
 *@date 2022-03-23 13:58
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Row, Slider, Space, Spin, Tooltip, Tag } from 'antd';
import { StarOutlined, BorderOutlined, CloseCircleOutlined, HighlightOutlined, BorderInnerOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { canvasMarkKey, CommonSpace, handleMarkColor, helpMarkKey } from '@utils/CommonVars';
import { fabric } from 'fabric';
import { IconFont, debounce, getDivis } from '@utils/CommonFunc';
import { addPolyByMouseFunc } from './AddPolyByClickFunc';

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
let drawType: IDrawType = IDrawType.move;
let isDown = false; // 鼠标点击
let mouseFrom = { x: 0, y: 0 }; // 画笔初始位置
let mouseTo = { x: 0, y: 0 }; // 画笔终止位置
let pencilColor = handleMarkColor;
let pencilWidth = 2;

let currCanvasObject: any = null; // 正在绘制的对象
let lineList: Array<any> = []; // 多边形数组
let bgScale: number = 1; // 背景图片的缩放比例
let helpPoint: Array<any> = []; // 辅助标注里面的点

// let canvas: any = null;

interface IPosition { x: number, y: number }
export enum EFabricOpt {
    cancelNet = '取消辅助请求'
}
export interface IaCoords { // 标注框基于图片上的位置
    tl: IPosition; // topLeft
    tr: IPosition; // topRight
    bl: IPosition; // bottomLeft
    br: IPosition; // bottomRight
}
interface IMarkData {
    dataPath: string,
    frameJson?: string
}
interface IProps {
    currentFile: IMarkData | null;
    markType: 'draw' | 'choose' | 'show'; // 标注 | 选区域查看图谱数据 | 只查看
    setMarkCanvas?: (canvas: any) => void;
    toUpdateMark?: (markData: any, notSetActive?: boolean) => void; // 若是MarkType = ‘draw’，mouse：up事件后做更新标注框信息
    onDrawMouseUp?: (position: IaCoords, currCanvasObject: any) => void;
    onDrawMouseMove?: (helpAddon?: boolean) => boolean;
    onSaveCanvas?: (canvasJson: any) => void;
    saveLoading?: boolean; // 保存批注按钮的loading
    onSelection?: (target: any, type: string) => void; // 元素的选中事件（type: create | update
    setBgScale?: (bgScale: number) => void; // 获取图片缩放比例
    setBgWH?: (w: number, h: number) => void; // 获取图片的宽高
    helpMarkEnd?: (pointArr: Array<any>, helpAddon?: boolean, kid?: any) => void; // 辅助标注打完四个点后的操作
    helpPolygon?: any;
    cancelFlag?: number;
}
export const useFabricMarkFresh = () => {
  const [markCanvas, setMarkCanvas] = useState<any>(null); // 画布对象
  const [canvasFresh, setCanvasFresh] = useState<number>(0); // 用于刷新依赖于canvas变化
  const [bgScale, setBgScale] = useState<number>(1); // 图片的缩放比例
  const getMarkCanvas = (canvas: any) => {
    setMarkCanvas(canvas);
    setCanvasFresh(canvasFresh + 1);
  };
  return { markCanvas, canvasFresh, getMarkCanvas, bgScale, setBgScale };
};
const FabricMark = (props: IProps) => {
  const {
    currentFile, markType,
    setMarkCanvas = (canvas: any) => {},
    toUpdateMark = (data: any, notSetActive?: boolean) => {},
    onDrawMouseUp = (position: IaCoords, currCanvasObject: any) => {},
    onSaveCanvas = (canvasJson: any) => {},
    onDrawMouseMove, saveLoading,
    onSelection,
    setBgScale = () => {},
    setBgWH = (w: number, h: number) => {},
    helpMarkEnd, helpPolygon, cancelFlag
  } = props;
  const contentRef: any = useRef();
  const [canvas, setCanvas] = useState<any>(null);
  const [activeDrawType, setActiveDrawType] = useState<IDrawType>(IDrawType.move);
  const [saveTooltipVisible, setSaveTooltipVisible] = useState<boolean>(false); // 保存批注按钮上的提示信息
  const [imgLoading, setImgLoading] = useState<boolean>(false); // 切换图片时加载的loading
  const [freshFlag, setFreshFlag] = useState<number>(0);
  const [helpPointList, setHelpPointList] = useState<Array<any>>([]);
  const { mouseDBlclick, mouseDown, mouseMove } = addPolyByMouseFunc();
  useEffect(() => {
    // 防止右键点击下载展示图片
    document.oncontextmenu = new Function('event.returnValue=false');
    // document.onselectstart = new Function('event.returnValue=false');
    if (canvas) {
      const backFunc = debounce(resizeCanvas, 100);
      window.addEventListener('resize', backFunc);
      return () => window.removeEventListener('resize', backFunc);
    }
  }, [canvas]);
  useEffect(() => {
    return initVar();
  }, []);
  const initVar = () => { // 初始化全局变量，避免切换至其他地方使用时变量还保留上一次的值
    mouseFrom = { x: 0, y: 0 };
    mouseTo = { x: 0, y: 0 };
    isDown = false;
    drawType = IDrawType.move;
    currCanvasObject = null;
    lineList = [];
    pencilColor = '#F44E3B';
    pencilWidth = 2;
    helpPoint = [];
  };
  const resizeCanvas = () => {
    canvas.setWidth(contentRef.current.clientWidth);
    canvas.absolutePan({ x: 0, y: 0 });
    canvas.renderAll();
  };
  // 加载图片，并按当前画布大小缩放图片，加载之前画布上的标注框
  useEffect(() => {
    if (contentRef && currentFile) {
      setImgLoading(true);
      let testCanvas: any = null;
      initVar();
      if (canvas) {
        canvas.absolutePan({ x: 0, y: 0 });
        canvas.setZoom(1);
        canvas.clear();
        canvas.defaultCursor = 'pointer'; // 默认光标
        testCanvas = canvas;
        setActiveDrawType(drawType);
      } else {
        testCanvas = new fabric.Canvas('fabricCanvasMark', {
          backgroundColor: '#ebb368',
          width: contentRef.current.clientWidth, // 设置和外面div的宽高一样
          height: contentRef.current.clientHeight,
          selection: false, // 不会出现拖曳选择区块
          hoverCursor: 'default' // 鼠标移入元素时，设置指针样式未默认
        });
      }
      fabric.Image.fromURL(currentFile.dataPath, (oImg: any) => {
        let scale = getDivis(testCanvas.width, oImg.width); // 横图，按宽度缩放
        setBgWH(oImg.width, oImg.height);
        if (oImg.width < oImg.height) { // 竖图，按高度缩放
          scale = testCanvas.height / oImg.height;
          if (testCanvas.width < oImg.width * scale) { // 如果缩放的比例后，宽度任然比画布的宽度大，需要按宽度缩放
            scale = getDivis(testCanvas.width, oImg.width);
          }
        }
        if (testCanvas.height < oImg.height * scale) { // 如果缩放的比例后，高度任然比画布的高度大，需要按高度缩放
          scale = getDivis(testCanvas.height, oImg.height);
        }
        bgScale = scale;
        setBgScale(bgScale);
        // 设置图片按画布的宽高缩放比例
        oImg.set('scaleX', scale).set('scaleY', scale).set('selectable', false).set('evented', false);
        if (currentFile.frameJson) { // 若是之前有标注框，从frameJson中渲染元素
          let objects = JSON.parse(currentFile.frameJson);
          let objsArr: Array<any> = [];
          objects.forEach((item: any) => {
            let parseItem = JSON.parse(item);
            if (markType === 'show') {
              let disableParams = {
                lockMovementX: true, // 禁止X轴移动
                lockMovementY: true, // 禁止Y轴移动
                lockRotation: true, // 禁止旋转
                lockScalingX: true, // 禁止左右拉伸
                lockScalingY: true, // 禁止上下拉伸
              };
              parseItem = {
                ...parseItem,
                ...disableParams,
              };
            }
            objsArr.push(parseItem);
          });
          let jsons = { objects: objsArr, version: '4.5.1' };
          testCanvas.loadFromJSON(JSON.stringify(jsons), () => { // 写入 Canvas
            testCanvas.renderAll();
            setImgLoading(false);
            let objs = testCanvas.getObjects();
            let oldScale = bgScale; // 原始图片的缩放比例
            objs.forEach((objItem: any, index: number) => {
              if (objItem.type === 'image') {
                oldScale = objItem.scaleX;
                testCanvas.sendToBack(objItem); // 将图片至于底层
              }
            });
            // // 因为页面宽度的变化，会导致图片显示不全，第一次标记时的页面宽度和后面情况的宽度可能不一致，基于第一次标记时的图片缩放就不支持后面的画布大小
            if (Math.abs(bgScale - oldScale) > 0.001) {
              bgScale = oldScale;
              setBgScale(bgScale);
              let newZoom = 1;
              let oldH = oImg.height * oldScale;
              let oldW = oImg.width * oldScale;
              if (oImg.width > oImg.height) {
                newZoom = testCanvas.width / oldW;
                if (newZoom * oldH > testCanvas.height) { // 若缩放后的高度超过画布高度，则以画布高度缩放
                  // newZoom = getDivis(testCanvas.height, oldH);
                  newZoom = testCanvas.height / oldH;
                }
              } else {
                newZoom = testCanvas.height / oldH;
                if (newZoom * oldW > testCanvas.width) { // 若缩放后的宽度超过画布宽度，则以画布宽度缩放
                  // newZoom = getDivis(testCanvas.width, oldW);
                  newZoom = testCanvas.width / oldW;
                }
              } // 获取图片的缩放比例，得到此比例下的画布大小和当前的画布大小做缩放
              testCanvas.setZoom(newZoom);
            }
            if (setMarkCanvas) { // 等待画布中的元素框都绘制完成后设值MarkCanvas
              setMarkCanvas(testCanvas);
            }
            setCanvas(testCanvas);
            setFreshFlag(freshFlag + 1);
          });
        } else { // 若之前没有标注过，则需要添加图片
          testCanvas.add(oImg);
          testCanvas.sendToBack(oImg);
          testCanvas.renderAll();
          setImgLoading(false);
          if (setMarkCanvas) {
            setMarkCanvas(testCanvas);
          }
          setCanvas(testCanvas); // 此处canvas的赋值不会触发更新，因为内存地址没有变化，使用{...testCanvas}方式会导致失真，所以使用下面的freshFlag来触发更新
          setFreshFlag(freshFlag + 1);
        }
      });
    }
  }, [currentFile]);
  // 刷新时清空并绑定事件
  useEffect(() => {
    if (freshFlag) {
      bindEvents();
    }
  }, [freshFlag]);
  // 切换操作时，设置画布光标
  useEffect(() => {
    if (canvas) {
      if (activeDrawType === IDrawType.helpMark || activeDrawType === IDrawType.helpAdd) {
        canvas.defaultCursor = 'crosshair'; // 默认光标改成十字
      } else {
        canvas.defaultCursor = 'pointer'; // 默认光标
      }
      let objs = canvas.getObjects();
      if (objs) {
        objs.forEach((item: any) => {
          let lock = activeDrawType === IDrawType.helpAdd;
          item.set('evented', !lock).set('hasControls', !lock); // 当在正负修正操作下，禁用操作事件
          item.set('fill', 'rgba(0,0,0, 0)');
        });
      }
      let act = canvas.getActiveObject();
      if (act) { // 给当前选中的对象设置填充色以区分
        act.set('fill', activeDrawType === IDrawType.helpAdd ? 'rgba(220,37,37,0.2)' : 'rgba(0,0,0, 0)');
      }
      canvas.renderAll();
    }
  }, [activeDrawType]);
  useEffect(() => {
    if (cancelFlag) {
      currCanvasObject = null;
      drawType = IDrawType.move;
      setActiveDrawType(IDrawType.move);
    }
  }, [cancelFlag]);
  useEffect(() => {
    if (helpPolygon && helpPolygon.length > 0) {
      if (helpPolygon[0] !== false && helpPolygon[0] !== EFabricOpt.cancelNet) { // 获取辅助点成功或者没有取消发送请求，可添加多边形标注
        addHelpPolygon();
      } else if (helpPolygon[0] === EFabricOpt.cancelNet && activeDrawType === IDrawType.helpAdd) { // 取消发送请求，且是正负修正时，需要删除之前的点
        deleteAllPoint(); // 删除标注的四个点
      } else if (helpPolygon[0] === false) {
        deleteAllPoint(); // 删除标注的四个点
        drawType = IDrawType.move;
        setActiveDrawType(IDrawType.move);
      }
    }
  }, [helpPolygon]);
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
    onMouseDBClick();
    onObjectSelection(); // 元素选中事件
  };
  const onMouseDown = () => {
    canvas.on('mouse:down', (o: any) => {
      if (o.target) {
        o.e.preventDefaultAction = true;
        o.e.preventDefault();
        o.e.stopPropagation();
      }
      if (currCanvasObject && drawType !== IDrawType.helpAdd) return;
      if (canvas.getActiveObject()) return;
      isDown = true;
      let offsetX = canvas.calcOffset().viewportTransform[4];
      let offsetY = canvas.calcOffset().viewportTransform[5];
      const x: number = Math.round(o.e.offsetX - offsetX);
      const y: number = Math.round(o.e.offsetY - offsetY);
      mouseFrom.x = x;
      mouseFrom.y = y;
      if (drawType === IDrawType.mousePoly) {
        mouseDown(mouseFrom, canvas, pencilColor, pencilWidth);
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
      mouseTo.x = x;
      mouseTo.y = y;
      if (drawType === IDrawType.move) {
        let delta = new fabric.Point(o.e.movementX, o.e.movementY);
        canvas.relativePan(delta);
      } else if (drawType === IDrawType.mousePoly) {
        mouseMove(mouseTo);
      } else if (drawType !== IDrawType.polyEdit) {
        if (onDrawMouseMove && !onDrawMouseMove()) return; // 若有mouseMove的事件，且返回为false，则不继续执行画框操作
        drawMark(x, y);
      }
    });
  };
  const onMouseDBClick = () => {
    canvas.on('mouse:dblclick', () => {
      if (drawType === IDrawType.mousePoly) { // 双击时若操作项是鼠标按点绘制多边形则使用
        mouseDBlclick();
        // 设置为false，绘制结束标识
        isDown = false;
      }
    });
  };
  const onMouseUp = () => {
    canvas.on('mouse:up', (o: any) => {
      // 若是当前操作项不是“鼠标按点绘制多边形”，则在up时将isDown设置为false作为绘制结束点标识
      if (drawType !== IDrawType.mousePoly) {
        isDown = false;
      }
      let offsetX = canvas.calcOffset().viewportTransform[4];
      let offsetY = canvas.calcOffset().viewportTransform[5];
      mouseTo.x = Math.round(o.e.offsetX - offsetX);
      mouseTo.y = Math.round(o.e.offsetY - offsetY);
      if (markType === 'draw' && (drawType === IDrawType.helpMark || drawType === IDrawType.helpAdd)) { // 若是开启了辅助标注，则在鼠标点击弹起的事件中打点
        let canHelpDraw = drawType === IDrawType.helpAdd;
        if (onDrawMouseMove && !onDrawMouseMove(canHelpDraw)) return;
        if ((!canHelpDraw && helpPoint.length < 4) || (canHelpDraw && helpPoint.length === 0)) { // 点数小于4个才能继续
          const zoom: any = canvas.getZoom();
          let pointItem: any = new fabric.Circle({
            left: mouseTo.x / zoom,
            top: mouseTo.y / zoom,
            originX: 'center',
            originY: 'center',
            stroke: pencilColor,
            fill: pencilColor,
            selectionBackgroundColor: 'rgba(100,100,100,0.25)',
            radius: 1,
            strokeWidth: pencilWidth,
            hasControls: true,
          });
          let key = helpMarkKey + '-' + helpPoint.length;
          pointItem[helpMarkKey] = key;
          helpPoint.push({ key: key, pointArr: [(mouseTo.x / zoom) / bgScale, (mouseTo.y / zoom) / bgScale] });
          setHelpPointList([...helpPoint]);
          canvas.add(pointItem);
          if (canHelpDraw && helpMarkEnd) {
            if (currCanvasObject && currCanvasObject[canvasMarkKey]) {
              let point = currCanvasObject.points.map((item: any) => ([item.x / bgScale, item.y / bgScale]));
              helpMarkEnd(helpPoint, true, JSON.stringify(point));
            }
          } else if (helpPoint.length > 3 && helpMarkEnd) { // 点数有4个执行方法，获取一个多边形的位置矩阵
            helpMarkEnd(helpPoint);
          }
        }
      } else if (currCanvasObject) {
        currCanvasObject[canvasMarkKey] = new Date().valueOf().toString();
        canvas.renderAll();
        if (markType === 'draw') {
          toUpdateMark(currCanvasObject);
        } else {
          let originPosition: IaCoords = { // 标注框基于图片上的位置
            tl: {
              x: currCanvasObject.aCoords.tl.x / bgScale,
              y: currCanvasObject.aCoords.tl.y / bgScale,
            },
            tr: {
              x: currCanvasObject.aCoords.tr.x / bgScale,
              y: currCanvasObject.aCoords.tr.y / bgScale,
            },
            bl: {
              x: currCanvasObject.aCoords.bl.x / bgScale,
              y: currCanvasObject.aCoords.bl.y / bgScale,
            },
            br: {
              x: currCanvasObject.aCoords.br.x / bgScale,
              y: currCanvasObject.aCoords.br.y / bgScale,
            }
          };
          onDrawMouseUp(originPosition, currCanvasObject);
        }
        currCanvasObject = null;
        lineList = [];
      }
    });
  };
  const onObjectSelection = () => { // 选中事件，选中的只会有一个元素，所以，只会create一次，后面的选中都是更新
    if (onSelection) {
      if (canvas.__eventListeners && canvas.__eventListeners['selection:created'] && canvas.__eventListeners['selection:created'].length > 0) { // 删除监听事件
        canvas.__eventListeners['selection:created'] = [];
        canvas.__eventListeners['selection:updated'] = [];
      }
      canvas.on('selection:updated', (o: any) => { // 选中更新事件
        onSelection(o.target, 'updated');
      });
      canvas.on('selection:created', (o: any) => { // 创建选中事件
        onSelection(o.target, 'create');
      });
    }
  };
  const onwheel = (e: any) => {
    if (canvas) {
      let zoom = (e.deltaY > 0 ? -0.2 : 0.2) + canvas.getZoom();
      zoom = Math.max(0.5, zoom); // 最小为原来的0.5
      zoom = Math.min(20, zoom); // 最大是原来的3倍
      canvas.setZoom(zoom);
    }
  };
  const drawMark = (offsetX: number, offsetY: number) => { // 画
    if (currCanvasObject && !currCanvasObject[canvasMarkKey]) { // 仅删除没有id的标注框
      // remove 仅将目前移除，clear 清除上一残留，只剩当前
      canvas.remove(currCanvasObject);
    }
    const zoom: any = canvas.getZoom();
    let canvasObject: any = null;
    let left: number = mouseFrom.x;
    let top: number = mouseFrom.y;
    switch (drawType) {
      case IDrawType.round:
        {
          const radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / zoom;
          canvasObject = new fabric.Circle({
            left: left / zoom,
            top: top / zoom,
            originX: 'center',
            originY: 'center',
            stroke: pencilColor,
            fill: 'rgba(255, 255, 255, 0)',
            selectionBackgroundColor: 'rgba(100,100,100,0.25)',
            radius: radius,
            strokeWidth: pencilWidth,
            hasControls: true,
          });
        }
        break;
      case IDrawType.rect:
        top = mouseFrom.y / zoom;
        left = mouseFrom.x / zoom;
        // 左上角为起点
        if (mouseFrom.x > mouseTo.x) { // 以x轴方向：向起始点左边拖动
          left = Math.abs(mouseTo.x) / zoom;
        }
        if (mouseFrom.y > mouseTo.y) { // 以y轴方向：向起始点上面拖动
          top = Math.abs(mouseTo.y) / zoom;
        }
        canvasObject = new fabric.Rect({
          top: top,
          left: left,
          width: Math.abs(mouseTo.x - mouseFrom.x) / zoom,
          height: Math.abs(mouseTo.y - mouseFrom.y) / zoom,
          stroke: pencilColor,
          selectionBackgroundColor: 'rgba(100,100,100,0.25)',
          strokeWidth: pencilWidth,
          fill: 'rgba(255, 255, 255, 0)',
        });
        break;
      case IDrawType.arrow: {
        /**
         * 箭头的话，是通过绘制路径Path来实现，Fabric.js中的Path包括一系列的命令，这基本上模仿一个笔从一个点到另一个。
         * 在“移动”，“线”，“曲线”，或“弧”等命令的帮助下，路径可以形成令人难以置信的复杂形状。同组的路径（路径组的帮助），开放更多的可能性，基本的为：
         “M” 代表 “move” 命令, 告诉笔到 0, 0 点
         “L” 代表 “line” 画一条0, 0 到 200, 100 的线
         'Z' 代表闭合路径
         */
        let x1 = mouseFrom.x;
        let x2 = mouseTo.x;
        let y1 = mouseFrom.y;
        let y2 = mouseTo.y;
        let w = (x2 - x1);
        let h = (y2 - y1);
        let sh = Math.cos(Math.PI / 4) * 16;
        let sin = h / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        let cos = w / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        let w1 = ((16 * sin) / 4);
        let h1 = ((16 * cos) / 4);
        let centerx = sh * cos;
        let centery = sh * sin;
        /**
         * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
         * w1 ，h1用于确定四个点
         */
        let path = ' M ' + x1 + ' ' + (y1);
        path += ' L ' + (x2 - centerx + w1) + ' ' + (y2 - centery - h1);
        path += ' L ' + (x2 - centerx + w1 * 2) + ' ' + (y2 - centery - h1 * 2);
        path += ' L ' + (x2) + ' ' + y2;
        path += ' L ' + (x2 - centerx - w1 * 2) + ' ' + (y2 - centery + h1 * 2);
        path += ' L ' + (x2 - centerx - w1) + ' ' + (y2 - centery + h1);
        path += ' Z';
        canvasObject = new fabric.Path(
          path,
          {
            stroke: pencilColor,
            fill: pencilColor,
            strokeWidth: pencilWidth
          }
        );
      } break;
      case IDrawType.polygon:
        lineList.push({
          x: offsetX / zoom,
          y: offsetY / zoom
        });
        canvasObject = new fabric.Polygon(lineList, {
          stroke: pencilColor,
          selectionBackgroundColor: 'rgba(100,100,100,0.25)',
          strokeWidth: pencilWidth,
          fill: 'rgba(255, 255, 255, 0)',
          borderDashArray: [5]
        });
        break;
      default:
        break;
    }
    if (canvasObject) {
      currCanvasObject = canvasObject;
      canvas.add(currCanvasObject);
    }
  };
  const setDrawType = (type: IDrawType) => {
    if (helpPoint.length === 4 && helpPolygon.length === 0) return; // 若是正在辅助标注请求中，不能切换操作按钮
    if (type === IDrawType.helpAdd && !canvas.getActiveObject()) {
      message.error('请选择一个标注进行修正！');
      return;
    }
    if ((type === IDrawType.helpAdd) && canvas.getActiveObject().type !== 'polygon') { // 只对多边形进行修正
      message.error('请选择一个多边形进行修正！');
      return;
    }
    if (type === IDrawType.helpAdd) {
      currCanvasObject = canvas.getActiveObject();
    } else {
      currCanvasObject = null;
    }
    if (activeDrawType === IDrawType.helpMark || activeDrawType === IDrawType.helpAdd) { // 若上一次操作是 辅助标注 | 正负修正，则在切换时要清空画布中的点
      deleteAllPoint();
    }
    drawType = type;
    setActiveDrawType(type);
  };
  const colorChange = (e: any) => {
    e.persist(); // 出于性能问题，将重用此合成事件。未保留之前，获取到的e.target为null，调用此方法保留原始合成事件
    pencilColor = e.target.value;
  };
  const pencilSizeChange = (value: any) => { pencilWidth = value; };
  const saveMark = () => {
    let canvasJson = canvas.toJSON([canvasMarkKey, 'autoInit', helpMarkKey]);
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
      onSaveCanvas(JSON.stringify(filterPoints));
    }
  };
  const addHelpPolygon = () => { // 辅助标注接口成功返回后，在画布中添加一个多边形，并删除点
    let kid = new Date().valueOf().toString();
    if (drawType === IDrawType.helpAdd && currCanvasObject) {
      kid = currCanvasObject[canvasMarkKey]; // 复用之前的kid，避免使用的新的kid标注框信息中保存的kid与其对应不上
      canvas.remove(currCanvasObject);
    }
    let canvasObject = new fabric.Polygon(helpPolygon, {
      stroke: pencilColor,
      // selectionBackgroundColor: 'rgba(100,100,100,0.25)',
      strokeWidth: pencilWidth,
      // selectable: false, // 禁止选择
      evented: activeDrawType !== IDrawType.helpAdd,
      fill: activeDrawType === IDrawType.helpAdd ? 'rgba(220,37,37,0.2)' : 'rgba(0,0,0, 0)',
    });
    currCanvasObject = canvasObject;
    currCanvasObject[canvasMarkKey] = kid;
    canvas.add(currCanvasObject);
    canvas.setActiveObject(currCanvasObject);
    deleteAllPoint(); // 删除标注的四个点
    if (drawType === IDrawType.helpMark) {
      toUpdateMark(currCanvasObject, true); // 打开新增编辑表单
    }
  };
  // 删除所有的辅助点
  const deleteAllPoint = () => {
    let activeObjects: Array<any> = [];
    const fabricCanvasObjectList = canvas.getObjects();
    for (let object of fabricCanvasObjectList) {
      if (object[helpMarkKey]) {
        activeObjects.push(object);
      }
    }
    for (let i = 0; i < activeObjects.length; i++) {
      canvas.remove(activeObjects[i]);
    }
    canvas.renderAll();
    helpPoint = [];
    setHelpPointList([]);
  };
  // 删除某一个辅助点
  const deleteHelpPointItem = (key: string) => {
    let deleteItem = getMarkObject(key);
    if (deleteItem) {
      let index = helpPoint.findIndex((item: any) => item.key === key);
      if (index > -1) {
        helpPoint.splice(index, 1);
        setHelpPointList([...helpPoint]);
      }
      canvas.remove(deleteItem);
    }
  };
  // 获取标注实体
  const getMarkObject = (key: any) => {
    let activeObjects;
    const fabricCanvasObjectList = canvas.getObjects();
    for (let object of fabricCanvasObjectList) {
      if (object[helpMarkKey] === key) {
        activeObjects = object;
      }
    }
    return activeObjects;
  };
  const btnType = (type: IDrawType) => {
    return activeDrawType === type ? 'primary' : 'default';
  };
  return (
    <Row style={{ paddingLeft: CommonSpace.md, paddingRight: CommonSpace.md }}>
      {markType !== 'show' && (
        <Row justify="space-between" style={{ width: '100%' }}>
          <Space wrap style={{ marginBottom: CommonSpace.xs }}>
            {markType === 'draw' && (
              <>
                <Button type={btnType(IDrawType.rect)} onClick={() => setDrawType(IDrawType.rect)} size="small" icon={<BorderOutlined />}>矩形</Button>
                <Button type={btnType(IDrawType.round)} onClick={() => setDrawType(IDrawType.round)} size="small" icon={<IconFont type="icon-yuanxing" />}>圆形</Button>
                <Button type={btnType(IDrawType.polygon)} onClick={() => setDrawType(IDrawType.polygon)} size="small" icon={<StarOutlined />}>多边形</Button>
                <Button type={btnType(IDrawType.mousePoly)} onClick={() => setDrawType(IDrawType.mousePoly)} size="small" icon={<StarOutlined />}>按点绘制多边形</Button>
                <Button type={btnType(IDrawType.arrow)} onClick={() => setDrawType(IDrawType.arrow)} size="small" icon={<ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} />}>箭头</Button>
                <Button type={btnType(IDrawType.helpMark)} onClick={() => setDrawType(IDrawType.helpMark)} size="small" icon={<HighlightOutlined />}>辅助标注</Button>
                <Button type={btnType(IDrawType.helpAdd)} onClick={() => setDrawType(IDrawType.helpAdd)} size="small" icon={<BorderInnerOutlined />}>正负修正</Button>
              </>
            )}
            {markType === 'choose' && <Button type={activeDrawType === IDrawType.rect ? 'primary' : 'default'} onClick={() => setDrawType(IDrawType.rect)} size="small" icon={<BorderOutlined />}>打点</Button>}
            <Button type={activeDrawType === IDrawType.move ? 'primary' : 'default'} onClick={() => setDrawType(IDrawType.move)} size="small" icon={<IconFont type="icon-hand" />}>拖拽</Button>
          </Space>
          <Space wrap style={{ marginBottom: CommonSpace.xs }}>
            {markType === 'draw' && (
              <>
                <Input type="color" onChange={colorChange} style={{ width: 100 }} defaultValue="#F44E3B" />
                <Slider defaultValue={2} onAfterChange={pencilSizeChange} style={{ width: 200 }} max={10} />
              </>
            )}
            {markType === 'draw' && (
              <Tooltip title={(
                <Space>
                  <span>移动标注框位置后，请手动保存标注！</span>
                  <Button icon={<CloseCircleOutlined style={{ color: '#fff' }} />} type="link" onClick={() => setSaveTooltipVisible(false)}></Button>
                </Space>
              )} visible={saveTooltipVisible}>
                <Button type="primary" loading={saveLoading} onClick={saveMark}>保存标注</Button>
              </Tooltip>
            )}
          </Space>
        </Row>
      )}
      <div ref={contentRef} style={{ width: '100%', height: 'calc(100vh - 300px)', backgroundColor: '#eee' }} onWheel={onwheel}>
        <Spin spinning={imgLoading}>
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <canvas id="fabricCanvasMark" />
            {activeDrawType === IDrawType.helpMark && helpPointList.length > 0 && (
              <div style={{ position: 'relative', right: 10, top: 5, height: 'fit-content' }}>
                <Space direction="vertical">
                  {helpPointList.map((item: any, index) => (
                    <Tag key={item.key} closable onClose={() => deleteHelpPointItem(item.key)}>辅助点{index + 1}</Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        </Spin>
      </div>
    </Row>
  );
};
export default FabricMark;
