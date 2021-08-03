/**
 * @description: 路由
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from 'views/home/Home';
import OptImg from './views/img/OptImg';

const platform = '/';
const App = () => {
  return (
    <Router>
      <Switch>
        <Home>
          <Switch>
            <Route exact path={platform} component={OptImg} />
          </Switch>
        </Home>
      </Switch>
    </Router>
  );
};
export default App;
