const path = require("path");
// const { name, version } = require('./package.json');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const postcssNormalize = require("postcss-normalize");
const apiMocker = require('mocker-api');

const matchSVGSprite = /assets\/icons\/|components\/Base\/Icon\/icons\//;
const { ESLINT_LOADER_DISABLED, IS_REAL_PROD } = process.env; // 通过环境变量禁用 eslint-loader

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";
  // const publicPath = devMode ? '/' : `//t.newscdn.cn/${name}/${version}/`;

  return {
    entry: "./src/index.ts",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "build"),
      // publicPath
    },

    // 生产模式下关闭map文件
    devtool: devMode ? "source-map" : "none",

    // 配置路径别名
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
        $: path.resolve(__dirname, "./typings"),
      },
    },

    module: {
      rules: [
        !devMode && !ESLINT_LOADER_DISABLED ? {
          enforce: 'pre',
          test: /\.jsx?|\.tsx?$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'eslint-loader',
          options: {
            cache: true,
          },
        } : {},
        /**
         * 解析样式资源，需要安装style-loader、css-loader、less、less-loader、postcss-normalize
         */
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
        /**
         * 使用babel-loader编译js|jsx|ts|tsx
         * 需要下载 @babel/core @babel/preset-env babel-loader
         * @babel/preset-react @babel/plugin-transform-runtime
         * ts-loader typescript
         */
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
        /**
         * 打包图片资源，需要下载 url-loader html-loader file-loader
         */
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
          exclude: matchSVGSprite,
        },
        {
          test: /\.html$/,
          loader: "html-loader",
        },
        /**
         * 打包svg资源，需要下载 svg-sprite-loader(用于将svg图以img标签的形式引入)
         */
        {
          test: /\.svg$/,
          include: matchSVGSprite,
          use: [
            {
              loader: "svg-sprite-loader",
              options: {
                symbolId: "icon-[name]",
              },
            },
          ],
        },
      ],
    },

    /**
     * plugins配置，需要下载：html-webpack-plugin、mini-css-extract-plugin
     */
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
    ],

    /**
     * 热更新
     */
    devServer: {
      port: 8000,
      host: "localhost",
      // open: true,
      disableHostCheck: true,
      historyApiFallback: true,
      // hot: true,
      // compress: true,
      // clientLogLevel: "none",
      // quiet: true,
      // publicPath: '/',
      proxy: {
        "/api": {
          target: "http://test.bat.xinhuazhiyun.com",
          changeOrigin: true,
        },
      },
      before(app) {
        apiMocker(app, path.resolve(__dirname, './mock/mock.js'));
      },
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: true,
        publicPath: false,
        warningsFilter: /export .* was not found in/,
      },
    },

    stats: {
      children: false,
      warningsFilter: warning => /Conflicting order between/gm.test(warning),
    },
  };
};