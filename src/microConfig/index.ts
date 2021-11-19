import {
  registerMicroApps,
  start,
  setDefaultMountApp,
  runAfterFirstMounted,
} from 'qiankun';

import { apps } from './subRouteConfig';

const registerApps = (getLoading: Function) => {
  registerMicroApps(apps, {
    beforeLoad: (app): any => {
      console.log('before load app.name=====>>>>>', app.name);
    },
    beforeMount: (app): any => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
    },
    afterMount: (app): any => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
      getLoading && getLoading();
    },
    afterUnmount: (app): any => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
    },
  });

  setDefaultMountApp('/react');

  start();

  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });
};

export { registerApps };
