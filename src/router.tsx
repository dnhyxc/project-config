import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Home from './routes/home';
import Detail from './routes/detail';

function RouterConfig({ history }: any) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/detail" exact component={Detail} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
