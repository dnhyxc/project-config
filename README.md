### dva 配置

#### 安装 dva

1，全局安装 dva-cli：

```js
npm install dva-cli -g
```

2，初始化 dva 项目：

- 安装方式一：dva new myapp。

- 安装方式二：在创建好的项目文件夹中运行 dva init。

### 配置 typescript

#### 配置 tsconfig.json

1，文件具体配置如下：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es6", "es2016", "es2017", "es2018", "esnext", "dom"],
    "allowJs": true,
    "skipLibCheck": true,
    "jsx": "react",
    "sourceMap": true,
    "noEmit": true,
    "importHelpers": true,
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "$/*": ["typings/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true
  },
  "include": ["src", "typings"],
  "exclude": ["build", "vendor", "**/*/_*", "src/components/VideoClipper"]
}
```

#### 增加 typings 文件配置

> 说明：由于当使用模块化引入 less 样式资源文件时，防止报找不到模块的错误，因此需要全局导出相应的资源文件。

1，在 typings 文件夹中增加 index.d.ts 文件，相关配置如下：

```js
declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.webp' {
  const url: string;
  export default url;
}

declare module '*.webm' {
  const url: string;
  export default url;
}

declare module '*.mp4' {
  const url: string;
  export default url;
}

declare module '*.jpg' {
  const url: string;
  export default url;
}

/**
 * 考虑使用 typed-css-modules 对 less 自动生成 d.ts （主要是需要开进程 watch 编译，比较麻烦）
 * 或者调研 TypeScript 扩展
 */
declare module '*.less' {
  const styles: Record<string, string>;
  export default styles;
}

declare module 'dva-loading' {
  export default function createLoading(options: any): any;
}

declare module '*.woff';
declare module '*.woff2';
declare module '*.otf';

declare module '*.json' {
  const value: any;
  export default value;
}

declare interface Window {
  liangzhu_data_info: any;
}

declare module 'echarts/map/json/*.json' {
  const json: any;
  export default json;
}
declare module 'react-lines-ellipsis' {
  // type definitions goes here
  const LinesEllipsis: any;
  export default LinesEllipsis;
}

declare module 'react-lines-ellipsis/lib/responsiveHOC' {
  const responsiveHOC: any;
  export default responsiveHOC;
}

declare module 'react-useanimations' {
  const UseAnimations: any;
  export default UseAnimations;
}

interface HTMLVideoElement {
  __hls__?: Hls;
}

interface Window {
  HLS_JS_DEBUG?: boolean;
}

declare module 'china-division/dist/*.json' {
  const json: any;
  export default json;
}

declare module 'braft-utils' {
  const ContentUtils: any;
  export { ContentUtils };
}

declare module 'rc-form' {
  const createForm: any;
  export { createForm };
}
```

### 安装 webpack

#### 安装 webpack webpack-cli webpack-dev-server

> 注意：webpack webpack-cli 下载的版本需要与全局的版本保持一致，防止出现不必要的错误，webpack-dev-server 版本不能下太高，否则可能出现兼容性错误。

1，我本地 webpack webpack-cli 分别为：webpack@4.44.2，webpack-cli@4.4.0。webpack-dev-server 为：webpack-dev-server@3.11.2

```js
npm i webpack@4.44.2 webpack-cli@4.4.0 webpack-dev-server@3.11.2 -D
```

### 配置 webpack.config.js 文件

> 在项目根目录中创建 webpack.config.js 文件。

#### 配置 入口及输出路径

1，相关配置如下：

```js
entry: "./src/index.ts",
output: {
  filename: "bundle.js",
  path: path.resolve(__dirname, "build"),
},
```

#### 打包样式资源

1，打包样式资源需要使用的 loader（以下 loader 具体的用处可自行百度）：

- style-loader、css-loader、less、less-loader、postcss-normalize。

```js
npm i style-loader css-loader less less-loader postcss-normalize -D
```

2，如果是移动端，可以配置 px2rem-loader 将 px 自动转为 rem。

- 安装 px2rem-loader 的同时还需安装 lib-flexible。

```js
npm i px2rem-loader lib-flexible -D
```

- 安装完毕以后需要在项目入口 js/ts 文件中引入 lib-flexible。

```js
import "lib-flexible";
```

3，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.(css|less)$/,
      use: [
        devMode ? MiniCssExtractPlugin.loader : "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              mode: "local",
              localIdentName: "[name]__[local]",
            },
            importLoaders: 1,
          },
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              // modifyVars: {
              //   'primary-color': 'green',
              //   'menu-item-active-bg': 'green',
              // },
              javascriptEnabled: true,
            },
          },
        },
        {
          loader: "px2rem-loader",
          options: {
            importLoaders: 1,
            remUnit: 37.5,
            min: 2,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              ident: "postcss",
              plugins: [
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      // browsers: [
                      //   '>1%',
                      //   'last 4 versions',
                      //   'Firefox ESR',
                      //   'not ie < 9',
                      // ],
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
                postcssNormalize(),
              ],
            },
            sourceMap: false,
          },
        },
      ],
    },
  ];
}
```

#### 打包 js/jsx/ts/tsx 等资源

1，打包 js/jsx/ts/tsx 等资源需要使用的 loader（以下 loader 具体的用处可自行百度）：

- @babel/core、@babel/preset-env、babel-loader、@babel/preset-react、@babel/plugin-transform-runtime、ts-loader、typescript

```js
npm i @babel/core @babel/preset-env babel-loader @babel/preset-react @babel/plugin-transform-runtime ts-loader typescript -D
```

2，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  useESModules: true,
                  corejs: 3,
                },
              ],
            ],
          },
        },
        {
          loader: "ts-loader",
          options: {
            happyPackMode: true,
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
              module: "esnext",
              target: devMode ? "es2017" : "es5",
            },
          },
        },
      ],
      exclude: [/node_modules/],
    },
  ];
}
```

#### 打包图片资源

1，打包图片资源需要使用的 loader（以下 loader 具体的用处可自行百度）：

- url-loader、html-loader、file-loader

```js
npm i url-loader html-loader file-loader -D
```

2，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.(mp4|png|jpg|jpeg|png|svg|cur|gif|webp|webm|otf)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "static/[name].[hash:11].[ext]",
          },
        },
      ],
      exclude: /assets\/icons\/|components\/Base\/Icon\/icons\//,
    },
    {
      test: /\.html$/,
      loader: "html-loader",
    },
  ];
}
```

#### 打包 svg 资源

1，打包 svg 资源需要使用的 loader（以下 loader 具体的用处可自行百度）：

- svg-sprite-loader

```js
npm i svg-sprite-loader -D
```

2，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.svg$/,
      include: /assets\/icons\/|components\/Base\/Icon\/icons\//,
      use: [
        {
          loader: "svg-sprite-loader",
          options: {
            symbolId: "icon-[name]",
          },
        },
      ],
    },
  ];
}
```

#### plugins 配置

1，所需插件：html-webpack-plugin、mini-css-extract-plugin、optimize-css-assets-webpack-plugin

```js
npm i html-webpack-plugin mini-css-extract-plugin optimize-css-assets-webpack-plugin -D
```

2，具体配置如下：

```js
plugins: [
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: path.resolve(__dirname, "./src/index.ejs"),
    minify: {
      removeComments: true, // 移除注释
      collapseWhitespace: true, // 移除空格
    },
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css",
  }),
  new OptimizeCSSAssetsPlugin(),
];
```

#### 更改 package.json

1，具体更改如下：

```json
"start": "webpack serve --mode=development --config=webpack.config.js --hot --inline",
"build": "npm i && webpack --mode=production --progress",
```

#### 异常报错

1，TypeError: cli.isValidationError is not a function at Command.cli.makeCommand。

- 解决方式：升级 webpack-cli。

2，TypeError: Cannot read property 'tap' of undefined at HtmlWebpackPlugin.apply。

- 解决方式：将 html-webpack-plugin 版本问题导致，可将其降级成 4.5.1 版本。

3，UnhandledPromiseRejectionWarning: TypeError: expecting a function but got [object Undefined]

- 解决方式：由于没有安装 html-webpack-plugin，将其装上即可。

4，TypeError: this.getOptions is not a function at Object.lessLoader。

- 解决方式：该错误由于 less-loader 版本问题导致，可将其降级为：5.0.0 即可。

5，Can't resolve '@babel/runtime-corejs3/helpers/esm/classCallCheck'。

- 解决方式：安装 @babel/runtime-corejs3 即可。

6，Error: Failed to load plugin @typescript-eslint: Cannot find module 'eslint-plugin-@typescript-eslint'。

- 解决方式：该错误由于没有安装 eslint-loader 导致，安装即可。
