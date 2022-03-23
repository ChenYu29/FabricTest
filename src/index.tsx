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

const platform = '/';
const App = () => {
  return (
    <Router>
      <Switch>
        <Home>
          <Switch>
            <Route exact path={platform} component={EditPolygon} />
            <Route exact path={platform + 'img'} component={OptImg} />
            <Route exact path={platform + 'mark'} component={FabricMarkUse} />
            <Route exact path={platform + 'editPoly'} component={EditPolygon} />
          </Switch>
        </Home>
      </Switch>
    </Router>
  );
};
export default App;
