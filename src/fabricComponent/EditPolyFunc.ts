/**
 *@description 编辑多边形方法
 *@author cy
 *@date 2022-04-06 13:54
 **/
import { fabric } from 'fabric';

export const editPolyFunc = () => {

  // 编辑多边形
  const editPoly = (canvas: any, currCanvasObject: any) => {
    canvas.setActiveObject(currCanvasObject);
    currCanvasObject.objectCaching = false; // 当`true`时，对象被缓存到一个额外的画布上。当' false '时，除非必要，否则对象不会被缓存(clipPath)默认为true
    currCanvasObject.transparentCorners = false; // 当为真时，对象的控制角内部呈现为透明(即笔画而不是填充)
    console.log('currCanvasObject.edit', currCanvasObject.edit);
    // let editShow = currCanvasObject.edit;
    // if (!editShow) {
      currCanvasObject.edit = true;
      let lastControl = currCanvasObject.points.length - 1;
      currCanvasObject.cornerStyle = 'circle';
      currCanvasObject.cornerColor = 'rgba(0,0,255,0.5)';
      currCanvasObject.hasBorders = false;
      currCanvasObject.controls = currCanvasObject.points.reduce((acc: any, point: any, index: number) => {
        acc['p' + index] = new fabric.Control({
          positionHandler: (dim: any, finalMatrix: any, fabricObject: any) => polygonPositionHandler(fabricObject, index),
          actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
          actionName: 'modifyPolygon',
          pointIndex: index
        });
        return acc;
      }, { });
    // } else {
    //   currCanvasObject.transparentCorners = true;
    //   currCanvasObject.cornerColor = 'rgb(178,204,255)';
    //   currCanvasObject.cornerStyle = 'rect';
    //   currCanvasObject.controls = fabric.Object.prototype.controls;
    // }
    // currCanvasObject.hasBorders = !editShow;
    canvas.requestRenderAll();
  };
  const cancelEdit = (canvas: any) => {
    let polyArr = canvas.getObjects('polygon');
    polyArr.forEach((item: any) => {
      if (item.edit) {
        item.edit = false;
        item.transparentCorners = true;
        item.cornerColor = 'rgb(178,204,255)';
        item.cornerStyle = 'rect';
        item.controls = fabric.Object.prototype.controls;
        item.hasBorders = true;
      }
    });
  };
  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  const polygonPositionHandler = (fabricObject: any, pointIndex: number) => {
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
      let fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint({
          x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
          y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
        }, fabricObject.calcTransformMatrix()),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = fabricObject._getNonTransformedDimensions(),
        newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
        newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };
  return { editPoly, cancelEdit };
};