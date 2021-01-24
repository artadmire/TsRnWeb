
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV

module.exports = function () {
  return {
    mode: env,
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'), // 也可以这么写path: __dirname + 'dist')
      filename: env === 'development' ? '[name].js' : '[name].[chunkhash:6].js', // 截取hash的前几位 './js/[name].[hash: 6].js' 在dist下面生产js文件夹
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
        // {
        //   test: /\.css$/,
        //   use: [
        //     {
        //       loader: MiniCssExtractPlugin.loader,
        //     },
        //     {
        //       loader: 'css-loader', // 让js文件识别css文件
        //       options: {
        //         modules: true,
        //       },
        //     },
        //     {
        //       loader: 'postcss-loader',
        //       options: {
        //         ident: 'postcss',
        //         plugins: [require('autoprefixer')()],
        //       },
        //     },
        //   ]
        // },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: {
              loader: 'style-loader',
              options: {
                insertAt: 'top', // 'bottom' 相对于头部(只在头部区域)的top和bottom, style标签插入的位置 {before: '#mydiv'}
              },
            },
            use: [
              {
                loader: 'css-loader', // 让js文件识别css文件
                options: {
                  modules: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [require('autoprefixer')()],
                },
              },
            ],
          }),
        },
        {
          test: /\.(png|jpg|jgeg|gif|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './img',
                publicPath: '',
                esModule: false,
                limit: 30 * 1024,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true, // 压缩代码，减少体积
      splitChunks: {
        name: true,
        chunks: 'all', // 'initial' 只对入口文件进行公共模块分析， 'all' 对所有文件进行模块分析 'async'
        minSize: 30000, // 默认30000， 大于30kb的文件进行提取
        cacheGroups: {
          vendor: {
            // 提取node_modules中文件 都喜欢把第三方依赖都打包在一起
            test: /([\\/]node_modules[\\/])/,
            name: 'vendor',
          },
        },
      },
      runtimeChunk: true, // 把webpack运行代码的提取出来
    },
    resolve: {
      alias: {
        'react-native': 'react-native-web',
        '@': './src',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    externals: {
    },
    plugins: [
      // 提取css文件
      // new MiniCssExtractPlugin({
      //   filename: '[name].[contenthash].css',
      //   chunkFilename: '[id].[contenthash].css',
      // }),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
      }),
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
      hot: true,
      host: '0.0.0.0',
      compress: true,
      port: 9000,
      overlay: true,
      // hotOnly: true, // 只用热更新 不用reload
    },
  };
};
