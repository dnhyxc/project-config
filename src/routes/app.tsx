import React, { useState } from 'react';
import { Link } from 'dva/router';

import {
  registerMicroApps,
  start,
  // setDefaultMountApp,
  runAfterFirstMounted,
} from 'qiankun';

import styles from './app.less';

const App: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const apps = [
    {
      name: 'reactApp',
      entry: 'http://localhost:8989',
      activeRule: '/dnhyxc/react',
      container: '#subapp-viewport',
    },
    {
      name: 'vueApp',
      entry: 'http://localhost:8989',
      container: '#subapp-viewport',
      activeRule: '/dnhyxc/vue',
    },
  ];

  registerMicroApps(apps, {
    beforeLoad: (app): any => {
      console.log('before load app.name=====>>>>>', app.name);
    },
    beforeMount: (app): any => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
    },
    afterMount: (app): any => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
      setLoading(false);
    },
    afterUnmount: (app): any => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
    },
  });

  // setDefaultMountApp("/dnhyxc");

  start();

  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });

  return (
    <div className={styles.flexContent}>
      <header className="menu">
        <Link to="/dnhyxc/react">reactApp</Link>
        <Link to="/dnhyxc/vue">vueApp</Link>
        <Link to="/dnhyxc/angular">angularApp</Link>
      </header>

      {loading && <div>loading...</div>}

      <div id="subapp-viewport" />
    </div>
  );
};

export default App;
