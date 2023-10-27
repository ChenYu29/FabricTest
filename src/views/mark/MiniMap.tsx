/**
 *@description fabric 鹰眼组件
 *@author cy
 *@date 2023-10-27 09:52
 **/
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { IDrawType } from '../../fabricComponent/FabricComponent';

interface IProps {
  design: any; // 大画布
  canvasFresh: number; // 触发design更新的值
  activeOpt: IDrawType; // 当前画布的操作类型
  show?: boolean; // 是否显示
}
const MiniMap = (props: IProps) => {
  const { design, canvasFresh, activeOpt = IDrawType.dragCanvas, show = true } = props;
  const minimap = useRef();
  const isDragging = useRef(false);
  const designLastPos = useRef({ x: 0, y: 0 });
  const activeDraw = useRef(IDrawType.dragCanvas);
  useEffect(() => {
    minimap.current = new fabric.Canvas('minimap', { containerClass: 'minimap', selection: false });
    return () => {
      minimap.current.clear();
      minimap.current = null;
    };
  }, []);
  useEffect(() => {
    activeDraw.current = activeOpt;
  }, [activeOpt]);
  useEffect(() => {
    if (design) {
      setTimeout(() => { // 设置延时，解决图层还未渲染完成，小地图的事件和大画布的事件冲突了
        minimap.current.clear();
        designBindEvent();
        initMinimap();
      }, 500);
    }
  }, [design, canvasFresh]);
  const createCanvasEl = () => {
    let designSize = { width: design.width, height: design.height };
    let originalVPT = design.viewportTransform;
    // zoom to fit the design in the display canvas
    let designRatio = fabric.util.findScaleToFit(designSize, design);

    // zoom to fit the display the design in the minimap.
    let minimapRatio = fabric.util.findScaleToFit(design, minimap.current);
    let scaling = minimap.current.getRetinaScaling();
    let finalWidth =  designSize.width * designRatio;
    let finalHeight =  designSize.height * designRatio;

    design.viewportTransform = [
      designRatio, 0, 0, designRatio,
      (design.getWidth() - finalWidth) / 2,
      (design.getHeight() - finalHeight) / 2
    ];
    let canvas = design.toCanvasElement(minimapRatio * scaling);
    design.viewportTransform = originalVPT;
    return canvas;
  };

  const updateMiniMap = () => {
    let canvas = createCanvasEl();
    minimap.current.backgroundImage._element = canvas;
    minimap.current.requestRenderAll();
  };
  const updateMiniMapVP = () => {
    let designSize = { width: design.width, height: design.height };
    let rect = minimap.current.getObjects()[0];
    let designRatio = fabric.util.findScaleToFit(designSize, design);
    let totalRatio = fabric.util.findScaleToFit(designSize, minimap.current);
    let finalRatio = designRatio / design.getZoom();
    rect.scaleX = finalRatio;
    rect.scaleY = finalRatio;
    rect.top = minimap.current.backgroundImage.top - design.viewportTransform[5] * totalRatio / design.getZoom();
    rect.left = minimap.current.backgroundImage.left - design.viewportTransform[4] * totalRatio / design.getZoom();
    minimap.current.requestRenderAll();
  };

  const initMinimap = () => {
    let canvas = createCanvasEl();
    let backgroundImage = new fabric.Image(canvas);
    backgroundImage.scaleX = 1 / design.getRetinaScaling();
    backgroundImage.scaleY = 1 / design.getRetinaScaling();
    minimap.current.centerObject(backgroundImage);
    minimap.current.backgroundColor = 'white';
    minimap.current.backgroundImage = backgroundImage;
    minimap.current.requestRenderAll();
    let minimapView = new fabric.Rect({
      top: backgroundImage.top,
      left: backgroundImage.left,
      width: backgroundImage.width / design.getRetinaScaling(),
      height: backgroundImage.height / design.getRetinaScaling(),
      fill: 'rgba(0, 0, 255, 0.3)',
      cornerSize: 6,
      transparentCorners: false,
      cornerColor: 'blue',
      strokeWidth: 0,
    });
    minimapView.controls = {
      br: fabric.Object.prototype.controls.br,
    };
    minimap.current.on('object:moving', (opt) => {
      let designSize = { width: design.width, height: design.height };
      let totalRatio = fabric.util.findScaleToFit(designSize, minimap.current);
      let rect = opt.target;
      design.viewportTransform[5] = design.getZoom() * (minimap.current.backgroundImage.top - rect.top) / totalRatio;
      design.viewportTransform[4] = design.getZoom() * (minimap.current.backgroundImage.left - rect.left) / totalRatio;
      design.requestRenderAll();
    });
    minimap.current.add(minimapView);
  };
  const designBindEvent = () => {
    design.on('mouse:wheel', function(opt) {
      let delta = opt.e.deltaY;
      let zoom = design.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      design.setZoom(zoom);
      updateMiniMapVP();
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    design.on('mouse:down', function(opt) {
      let evt = opt.e;
      if (evt.altKey === true || activeDraw.current === IDrawType.dragCanvas) {
        isDragging.current = true;
        // this.selection = false;
        designLastPos.current.x = evt.clientX;
        designLastPos.current.y = evt.clientY;
      }
    });
    design.on('mouse:move', function(opt) {
      if (isDragging.current) {
        let e = opt.e;
        let vpt = design.viewportTransform;
        vpt[4] += e.clientX - designLastPos.current.x;
        vpt[5] += e.clientY - designLastPos.current.y;
        design.requestRenderAll();
        updateMiniMapVP();
        designLastPos.current.x = e.clientX;
        designLastPos.current.y = e.clientY;
      }
    });
    design.on('mouse:up', function(opt) {
      isDragging.current = false;
      // this.selection = true;
    });
  };
  // var debouncedMiniMap = _.debounce(updateMiniMap, 250);

  // design.on('object:modified', function() {
  //   updateMiniMap();
  // });
  return (
    <div style={{ position: 'absolute', bottom: 10, right: 10, display: show ? 'block' : 'none' }}>
      <canvas id="minimap" width="130" height="130"></canvas>
    </div>
  );
};
export default MiniMap;