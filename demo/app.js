import * as Koa from 'koa';
import * as path from 'path';
import * as Router from 'koa-router';

const app = new Koa();
app.use(require('koa-static')(__dirname, './static'));

const ejsVariables = require('../build/ejs-variables.js');
const env = process.env.NODE_ENV || 'development';
const isDev = env.includes('development');

// render
require('koa-ejs')(app, {
    // root 为经过 webpack 编译后的真实模板路径
    root: path.resolve(__dirname, isDev ? './public' : '../dist'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

// router
const router = new Router();

router
    .get('/', async (ctx) => {
        await ctx.render('index', {
            ...ejsVariables,
            title: 'uikit-starter'
        });
    });

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
export default app;
