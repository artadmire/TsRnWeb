// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function (webpackEnv) {
  return {
    entry: {
      app: './index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // 也可以这么写path: __dirname + 'dist')
      filename: '[name].[hash:6].js', // 截取hash的前几位 './js/[name].[hash: 6].js' 在dist下面生产js文件夹
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: ['>1%'], // 编译成全球占有率大于1%的浏览器都可以识别
                      },
                    },
                  ],
                ],
                plugins: [
                  [
                    'babel-plugin-transform-react-jsx',
                    {
                      prama: 'React.creatElement',
                    },
                  ],
                  ['@babel/plugin-transform-runtime'],
                  ['@babel/plugin-proposal-class-properties'],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // 30KB 以下的文件采用 url-loader
                limit: 1024 * 30,
                // 否则采用 file-loader，默认值就是 file-loader
                fallback: 'file-loader',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
        minify: {
          // 压缩
          removeComments: true, //删除注释
          collapseWhitespace: true, //删除空格，压缩
        },
        inject: true, // 是否自动引入 默认true true/false
      }),
    ],
    devServer: {
      contentBase: '/dist',
      //   hot:true,
      host: '0.0.0.0',
      compress: true,
      port: 9000,
      overlay: true,
      hotOnly: true, // 只用热更新 不用reload
    },
  };
};
