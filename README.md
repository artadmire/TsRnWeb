什么是三端同构？
对于刚接触rn开发的同学可能不是太了解，简单介绍一下。三端指的是安卓、IOS、H5。rn本身就是跨平台框架，为了让RN能在不改动代码的情况下同时兼容H5，只需要引入一些库和配置一些细节即可。

本模板采用目前react-native@0.6x,react-navigation@5.x新版本，搭建ts开发环境。 新版本相关库的API与老rn版本有些是不兼容的，请不要随意更改主版本！

不管是对于刚入门RN的小白，还是熟练运用RN老版本的熟手，都能轻松上手

搭建流程（从零起步）
1. 安装RN
照着官网配置开发环境，建议一步步装客户端环境。
https://reactnative.cn/docs/environment-setup

2. 使用react-native来生成typescript模板

npx react-native init TsRnWeb --template react-native-template-typescript
npx生成rn for ts模板，安装完成后这就是一个官方可运行的RN项目了，接下来我们就来修改这个模板

3. 如果你环境已经配置好了，就可以在安卓哦和ios端跑起来看一一下项目的demo了。
  ### ios
 
 npm run start
 
 npm run ios
 
 ### android
 
 npm run android
 


4. 配置package.json
为了使用新版本的@react-navigation v5搭建完整可用的RN开发项目、以及我们要做的三端同构 ，需要新增一些npm依赖的包。

"dependencies": {
    // ...模板自带的包
    // ...
    "@react-native-community/async-storage": "1.9.0",  // 相当于localStorage（可选）
    "@react-native-community/masked-view": "0.1.9",    // 路由所需要的包 (必须)
    "@react-navigation/stack": "5.2.10",    // 路由所需要的包 (必须)
    "react": "16.11.0",
    "react-dom": "16.11.0",
    "react-native": "0.62.2",
    "react-native-gesture-handler": "1.6.0",      // 路由所需要的包，原生手势系统 (必须)
    "react-native-reanimated": "^1.8.0",    // 路由所需要的包 (必须)
    "react-native-safe-area-context": "0.7.3",    // 路由所需要的包 (必须)
    "react-native-screens": "^2.3.0",    // 路由所需要的包 (必须)
    "react-native-webview": "8.0.0",    // RN打开webView容器，原生调用 (可选)
    "react-redux": "5.0.7",
    "redux": "4.0.0",
    "redux-thunk": "2.3.0"
  },
"devDependencies": {
    // ...模板自带的包
    // ...
    "@babel/plugin-transform-runtime": "^7.9.0",    // babel的插件包（必须）
    "@babel/preset-typescript": "^7.9.0",      // babel的编译ts（必须）
    "@react-navigation/core": "3.4.2",        // rn路由在H5里运行的核心包（必须）
    "@react-navigation/web": "1.0.0-alpha.8",  // rn路由在H5里运行的核心包（必须）
    "babel-loader": "^8.1.0",    // webpack loader（必须）
    "file-loader": "3.0.1",          // webpack loader（必须）
    "html-webpack-plugin": "^4.2.0",          // webpack plugin（必须）
    "react-native-web": "0.12.2",      // rn组件映射为WEB的dom（必须）
    "webpack": "4.42.1",      // 打包rn项目到h5（必须）
    "webpack-cli": "3.3.2",    // 打包rn项目到h5（必须）
    "webpack-dev-server": "3.5.1"    // 调试rn项目到h5（必须）
  },
该装的都装上别漏了，建议梭哈

4. 配置weback和文件入口
首先新建一个index.html文件作为H5打包模板 根目录下index.ts为RN为原生打包的入口，新建一个index.web.ts当做H5的打包入口，注意在webpack中添加

resolve: {
        extensions: [
            '.web.ts',
            '.web.tsx',
            '.ts',
            '.tsx',
            '.js',
            '.jsx'
        ],
        alias: {
            'react-native$': 'react-native-web'
        }
    },
extensions配置的目的是为了让我们的项目能够在import XX from './xx'引入文件时，能够编写两个不同后缀的文件xx.web.ts，xx.ts。一个给RN打包给原生，一个给webpack打包给H5，用来对不同平台的代码做定制化开发，这一点在路由上是极其有用的。.web.ts一定要配置在.ts前面，让webpack优先找到属于H5的文件打包。

另外alias就是将react-native整个库的组件映射为react-native-web，实际上这个库的原理就是为RN每个组件写对应的dom然后传入props。因为你也可以自行拓展，有的原生组件react-native-web是没有的，比如一开始提到的webView。

{
            test: /\.(js|jsx|ts|tsx)$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: false,
                        presets: [
                            'module:metro-react-native-babel-preset',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            ],
            exclude: /node_modules/
        }
其次配置babel-loader来编译ts，这里尤其要注意： 不能使用ts-loader来编译！ 因为跟文件tsconfig.json中我们配的jsx识别为react-native，是用来编译给客户端的，但是实际上面我们将其代理成了dom元素，打包会产生冲突导致loader编译错误。解决方案为直接使用babel-loader进行配置编译TS，生成sourcemap

5. 配置React-navigation、Redux
Redux状态管理和普通react一样，也可以用别的库，毕竟状态管理不涉及到渲染。主要说明React-navigation，这个RN的路由库，每个版本的API差异很大，V5的版本将API拆分为多个组@react-navigation/，有很多种路由配置选择，我这里提供一种：

// router.ts
import 'react-native-gesture-handler';
import React from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {
    InitialState,
    useLinking,
    NavigationContainerRef,
    NavigationContainer,
    DefaultTheme,
    DarkTheme
} from '@react-navigation/native';
import {
    createStackNavigator,
    HeaderStyleInterpolators
} from '@react-navigation/stack';

import routes from './config';

type RootDrawerParamList = {
    [key: string]: any;
};

const Stack = createStackNavigator<RootDrawerParamList>();

const HeaderNull = function(): React.ReactNode {
    return null;
};

const MyApp = function() {
    const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

    const containerRef = React.useRef<NavigationContainerRef>(null);
    const [initialState, setInitialState] = React.useState<
        InitialState | undefined
    >();
    const [theme, setTheme] = React.useState(DefaultTheme);

    return <NavigationContainer
        ref={containerRef}
        initialState={initialState}
        onStateChange={async (state) => {
            try {
                await AsyncStorage.setItem(
                    NAVIGATION_PERSISTENCE_KEY,
                    JSON.stringify(state)
                );
            } catch (e) {
                console.log(e);
            }
        }}
        theme={theme}
    >
        <Stack.Navigator>
            {(Object.keys(routes) as (keyof typeof routes)[]).map(
                (name) => (
                    <Stack.Screen
                        key={name}
                        name={name}
                        component={routes[name].screen}
                        options={{
                            header: props => HeaderNull()
                        }}
                    />
                )
            )}
        </Stack.Navigator>
    </NavigationContainer>;
};

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(MyApp);
简单来说就是把路由配置导入就行了，但是这个config要抽离出来，因为我们在这个目录下还有一个route.web.ts，同样要引用这个配置，但是引用配置的库却是不同的，在H5里我们使用@react-navigation/web：

// router.web.ts
import { connect } from 'react-redux';
import { createSwitchNavigator } from '@react-navigation/core';
import { createBrowserApp } from '@react-navigation/web';

import routes from './config';

const MyNavigator = createSwitchNavigator(routes);

const MyApp = createBrowserApp(MyNavigator);

const mapStateToProps = state => state;

export default connect(mapStateToProps)(MyApp);
这样一来，我们就能保证路由的每个页面都是引用的相同的组件了

6. link所使用的原生组件库
该项目最开始配置package.json有两个原生模块模块包，需要使用link进行关联操作，否则构建客户端报错。在npm i后执行：

npx react-native link react-native-gesture-handler 这个是react-navigation使用的原生的手势系统。
npx react-native link @react-native-community/async-storage 这个类似于浏览器的localStorage原生缓存。
7. 让模板启动起来吧~
配置好npm启动命令

// package.json
"scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "web:dev": "webpack-dev-server --config webpack.config.web.ts --inline --hot --colors",
    "web": "webpack -p --config webpack.config.web.ts"
  },
原生客户端使用npm run android或npx react-native run-android(npm v5.2+)启动
npm run web:dev启动webpack-dev-server调试，和普通移动端开发一样
npm run web打包为生产环境代码到dist-H5
