import { devMiddleware } from './middleware/webpack-dev-middleware' // webpack-dev-middleware 中间件

/**** 获取本机ip ****/
const os = require('os');
let ip = '';
const iFaces = os.networkInterfaces()
function getMyIp () {
    for (let i in iFaces) {
        for (let j in iFaces[i]) {
            let val = iFaces[i][j]
            if (val.family === 'IPv4' && val.address !== '127.0.0.1') {
                ip = val.address
                return
            }
        }
    }
}
getMyIp()
/*********************/

const convert = require('koa-convert');

const webpack = require('webpack');

// 引入项目 koa 主模块env
const app = require('./app');

// webpack 配置文件
const webpackConfig = require('../build/webpack.config.js');

// https://webpack.docschina.org/api/compiler
const compiler = webpack(webpackConfig);

app.use(convert(
    devMiddleware(compiler, {
        publicPath: '/' // 静态资源的路径
    })
));

app.on('error', (err, ctx) => {
    console.error('server error !!!!!!!!!!!!!', err, ctx);
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
    setTimeout(() => {
        console.log(`server is running at http://${ip}:${PORT}`);
    }, 3000);
});

export default app;
