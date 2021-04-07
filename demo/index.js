import { devMiddleware } from './middleware/webpack-dev-middleware' // webpack-dev-middleware 中间件

const webpack = require('webpack');

// 引入项目 koa 主模块
const app = require('./app');


// webpack 配置文件
const webpackConfig = require('../build/webpack.config.js');

// https://webpack.docschina.org/api/compiler
const compiler = webpack(webpackConfig);

app.use(
    devMiddleware(compiler, {
        publicPath: '/' // 静态资源的路径
    })
);

app.on('error', (err, ctx) => {
    console.error('server error !!!!!!!!!!!!!', err, ctx);
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
    setTimeout(() => {
        console.log(`server is running at http://0.0.0.0:${PORT}`);
    }, 3000);
});

export default app;
