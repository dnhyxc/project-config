import React from 'react';
import { Route, Switch, routerRedux } from 'dva/router';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import Home from './routes/home';
import Detail from './routes/detail';
import App from './routes/app';

const { ConnectedRouter } = routerRedux;

const RouterConfig = ({ history }: any) => {
  return (
    <ConfigProvider locale={zh_CN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/dnhyxc" component={App} />
          <Route path="/home" component={Home} />
          <Route path="/detail" component={Detail} />
        </Switch>
      </ConnectedRouter>
    </ConfigProvider>
  );
};

export default RouterConfig;
