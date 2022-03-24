/**
 * @description: 路由
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from 'views/home/Home';
import OptImg from './views/img/OptImg';
import FabricMarkUse from './views/mark/FabricMarkUse';
import EditPolygon from './views/mark/EditPolygon';
import AddPolyByClick from './views/mark/AddPolyByClick';
import { platform } from '@utils/ProjectVars';
import FabricUse from './fabricComponent/FabricUse';
export const menuList = [
  { path: platform, name: '', component: EditPolygon },
  { path: platform + 'img', name: '加载图片', component: OptImg },
  { path: platform + 'mark', name: '添加框', component: FabricMarkUse },
  { path: platform + 'editPoly', name: '编辑多边形', component: EditPolygon },
  { path: platform + 'addPolyByClick', name: '鼠标点击绘制多边形', component: AddPolyByClick },
  { path: platform + 'fabricComponent', name: '组件模板', component: FabricUse },
];
const App = () => {
  return (
    <Router>
      <Switch>
        <Home>
          <Switch>
            {menuList.map((item: any, index: number) => (
              <Route key={index} exact path={item.path} render={(props: any) => <item.component {...props} />} />
            ))}
          </Switch>
        </Home>
      </Switch>
    </Router>
  );
};
export default App;
