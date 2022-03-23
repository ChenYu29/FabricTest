/**
 *@description 可编辑的多边形
 *@author cy
 *@date 2022-03-23 14:38
 **/
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Button } from 'antd';

let canvas;
const EditPolygon = () => {
  const contentRef: any = useRef();
  useEffect(() => {
    canvas = new fabric.Canvas('editPoly', {
      backgroundColor: '#eee',
      width: contentRef.current.clientWidth, // 设置和外面div的宽高一样
      height: contentRef.current.clientHeight,
      selection: false, // 不会出现拖曳选择区块
      hoverCursor: 'default' // 鼠标移入元素时，设置指针样式未默认
    });
    let json = '{"type":"polygon","objectCaching":false,"version":"4.6.0","originX":"left","originY":"top","left":218.34,"top":251.56,"width":54.56,"height":59.4,"fill":"rgba(0,0,0,0)","stroke":"#F44E3B","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"kid":"1645171737931","points":[{"x":247.28,"y":252.56},{"x":226.6,"y":260.92},{"x":219.34,"y":282.48},{"x":219.34,"y":304.48},{"x":234.08,"y":309.98},{"x":252.78,"y":311.96},{"x":270.16,"y":302.5},{"x":273.9,"y":281.16},{"x":265.1,"y":260.26}]}';
    let objsArr = JSON.parse(json);
    let testJson = '{"type":"polygon","version":"4.6.0","originX":"left","originY":"top","left":70.34,"top":99,"width":114,"height":143,"fill":"rgba(0,0,0,0)","stroke":"#F44E3B","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"kid":"1648019867538","points":[{"x":92,"y":125},{"x":92,"y":126},{"x":91,"y":126},{"x":90,"y":127},{"x":90,"y":128},{"x":89,"y":128},{"x":88,"y":128},{"x":87,"y":129},{"x":85,"y":130},{"x":85,"y":131},{"x":84,"y":132},{"x":83,"y":134},{"x":83,"y":135},{"x":82,"y":135},{"x":82,"y":137},{"x":82,"y":138},{"x":81,"y":139},{"x":81,"y":140},{"x":80,"y":141},{"x":79,"y":142},{"x":79,"y":143},{"x":79,"y":144},{"x":78,"y":145},{"x":78,"y":146},{"x":78,"y":147},{"x":78,"y":149},{"x":77,"y":151},{"x":77,"y":153},{"x":77,"y":156},{"x":77,"y":157},{"x":77,"y":159},{"x":77,"y":162},{"x":77,"y":163},{"x":77,"y":166},{"x":77,"y":167},{"x":77,"y":169},{"x":77,"y":170},{"x":77,"y":172},{"x":77,"y":174},{"x":77,"y":175},{"x":77,"y":176},{"x":77,"y":178},{"x":77,"y":181},{"x":77,"y":183},{"x":78,"y":185},{"x":80,"y":188},{"x":80,"y":189},{"x":81,"y":190},{"x":81,"y":191},{"x":84,"y":195},{"x":85,"y":196},{"x":86,"y":199},{"x":88,"y":201},{"x":89,"y":202},{"x":91,"y":204},{"x":94,"y":207},{"x":96,"y":208},{"x":97,"y":208},{"x":99,"y":209},{"x":100,"y":210},{"x":71.34375,"y":227},{"x":104,"y":211},{"x":109,"y":213},{"x":113,"y":214},{"x":117,"y":214},{"x":123,"y":215},{"x":127,"y":215},{"x":103.34375,"y":235},{"x":137,"y":216},{"x":140,"y":216},{"x":144,"y":216},{"x":147,"y":216},{"x":148,"y":216},{"x":150,"y":216},{"x":151,"y":216},{"x":153,"y":216},{"x":155,"y":216},{"x":156,"y":216},{"x":155.34375,"y":243},{"x":158,"y":216},{"x":158,"y":215},{"x":160,"y":213},{"x":160,"y":211},{"x":160,"y":209},{"x":162,"y":207},{"x":163,"y":204},{"x":163,"y":203},{"x":164,"y":200},{"x":165,"y":197},{"x":165,"y":196},{"x":165,"y":195},{"x":165,"y":193},{"x":165,"y":190},{"x":165,"y":187},{"x":165,"y":186},{"x":165,"y":184},{"x":165,"y":181},{"x":165,"y":180},{"x":165,"y":178},{"x":165,"y":177},{"x":165,"y":176},{"x":179.34375,"y":213},{"x":165,"y":172},{"x":165,"y":170},{"x":165,"y":169},{"x":165,"y":166},{"x":164,"y":164},{"x":164,"y":162},{"x":164,"y":160},{"x":163,"y":158},{"x":162,"y":156},{"x":161,"y":154},{"x":160,"y":152},{"x":159,"y":151},{"x":159,"y":150},{"x":159,"y":148},{"x":157,"y":147},{"x":157,"y":146},{"x":157,"y":145},{"x":157,"y":144},{"x":156,"y":143},{"x":155,"y":143},{"x":155,"y":142},{"x":155,"y":141},{"x":155,"y":139},{"x":154,"y":139},{"x":154,"y":138},{"x":185.34375,"y":168},{"x":165.34375,"y":126},{"x":160.34375,"y":103},{"x":140.34375,"y":100}]}';
    let jsons = { objects: [objsArr, JSON.parse(testJson)], version: '4.5.1' };
    canvas.loadFromJSON(JSON.stringify(jsons), () => { // 写入 Canvas
      canvas.renderAll();
    });
  }, []);
  const Edit = () => {
    let poly = canvas.getActiveObject();
    canvas.setActiveObject(poly);
    poly.objectCaching = false; // 当`true`时，对象被缓存到一个额外的画布上。当' false '时，除非必要，否则对象不会被缓存(clipPath)默认为true
    poly.transparentCorners = false; // 当为真时，对象的控制角内部呈现为透明(即笔画而不是填充)

    poly.edit = !poly.edit;
    if (poly.edit) {
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.controls = poly.points.reduce((acc: any, point: any, index: number) => {
        acc['p' + index] = new fabric.Control({
          positionHandler: (dim: any, finalMatrix: any, fabricObject: any) => polygonPositionHandler(fabricObject, index),
          actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
          actionName: 'modifyPolygon',
          pointIndex: index
        });
        return acc;
      }, { });
    } else {
      poly.cornerColor = 'blue';
      poly.cornerStyle = 'rect';
      poly.controls = fabric.Object.prototype.controls;
    }
    poly.hasBorders = !poly.edit;
    canvas.requestRenderAll();
  };
  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  const polygonPositionHandler = (fabricObject: any, pointIndex: number) => {
    // console.log('fabricObject', [currentControl, fabricObject]);
    // let x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x);
    // let y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
    let x = (fabricObject.points[pointIndex].x - fabricObject.pathOffset.x);
    let y = (fabricObject.points[pointIndex].y - fabricObject.pathOffset.y);
    return fabric.util.transformPoint(
      { x: x, y: y },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  };

  // define a function that will define what the control does
  // this function will be called on every mouse move after a control has been
  // clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  const actionHandler = (eventData: any, transform: any, x: any, y: any) => {
    let polygon = transform.target;
    let currentControl = polygon.controls[polygon.__corner];
    let mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center');
    let polygonBaseSize = polygon._getNonTransformedDimensions();
    let size = polygon._getTransformedDimensions(0, 0);
    let finalPointPosition = {
      x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
      y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
    };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
  };

  // define a function that can keep the polygon in the same position when we change its
  // width/height/top/left.
  const anchorWrapper = (anchorIndex: any, fn: any) => {
    return (eventData: any, transform: any, x: any, y: any) => {
      let fabricObject = transform.target;
      let absolutePoint = fabric.util.transformPoint({
        x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
        y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
      }, fabricObject.calcTransformMatrix());
      let actionPerformed = fn(eventData, transform, x, y);
      let newDim = fabricObject._setPositionDimensions({});
      let polygonBaseSize = fabricObject._getNonTransformedDimensions();
      let newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x;
      let newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };
  return (
    <div ref={contentRef} style={{ width: '100%', height: 'calc(100vh - 300px)' }}>
      <Button onClick={Edit}>切换编辑</Button>
      <canvas id="editPoly" />
    </div>
  );
};
export default EditPolygon;