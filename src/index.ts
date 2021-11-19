import dva from 'dva';
import { createBrowserHistory as createHistory } from 'history';
// import "lib-flexible";
import './index.less';

// import {
//   registerMicroApps,
//   start,
//   setDefaultMountApp,
//   runAfterFirstMounted,
// } from "qiankun";

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

// const apps = [
//   {
//     name: "reactApp",
//     entry: "//localhost:3000",
//     activeRule: "/react",
//     container: "#subapp-viewport",
//   },
//   {
//     name: "vueApp",
//     entry: "//localhost:8686",
//     container: "#subapp-viewport",
//     activeRule: "/vue",
//   },
// ];

// registerMicroApps(apps, {
//   beforeLoad: (app): any => {
//     console.log("before load app.name=====>>>>>", app.name);
//   },
//   beforeMount: [
//     (app): any => {
//       console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
//     },
//   ],
//   afterMount: [
//     (app): any => {
//       console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
//     },
//   ],
//   afterUnmount: [
//     (app): any => {
//       console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name);
//     },
//   ],
// });

// setDefaultMountApp("/react");

// start();

// runAfterFirstMounted(() => {
//   console.log("[MainApp] first app mounted");
// });
