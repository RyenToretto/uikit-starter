const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ejsVariables = require('../build/ejs-variables.js');

const env = process.env.NODE_ENV || 'development';
const isProd = env.includes('production');

const cdnPath = './'

const generateLocalHost = env.includes('local-host');
if (generateLocalHost || !isProd) {
    ejsVariables.prefix = '/';
}


const config = {
    mode: isProd ? 'production' : 'development',
    entry: {
        app: path.resolve(__dirname, '../src/js/app.js')
    },
    output: {
        path: path.resolve(__dirname, isProd ? '../dist' : '../demo/public'),
        filename: 'static/js/[name].js',
        publicPath: "./"
    },
    devtool: isProd ? false : 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        disableHostCheck: true,
        port: 8888,
        host: '0.0.0.0'
    },
    optimization: {
        minimizer: [
            new TerserPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'app',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/i,
                loaders: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            esModule: false,
                            publicPath: isProd ? cdnPath : './',
                            name: isProd ? 'static/img/[name].[hash:7].[ext]' : 'static/img/[name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 90
                            },
                            pngquant: {
                                quality: '80-90',
                                speed: 4
                            },
                            optipng: {enabled: false},
                            gifsicle: {interlaced: false},
                            webp: {quality: 95}
                        }
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "static/fonts/[name].[ext]"
                        }
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: "svg-url-loader"
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].css"
        }),
        new OptimizeCSSAssetsPlugin({ safe: true, map: false, discardComments: { removeAll: true } }),
        /* new CopyPlugin([
            {from: path.resolve(__dirname, "../src/lib"), to: 'static/lib'}
        ]), */
        new ImageminPlugin({
            disable: true,
            test: /\.(jpe?g|png|gif)$/i,
            pngquant: {quality: '90-100'},
            optipng: {optimizationLevel: 9}
        })
    ],
};

if (isProd) {
    config.plugins.push(
        new CleanWebpackPlugin()
    );
}

config.plugins.push(
    new HtmlWebpackPlugin({
        inject: true, // 是否自动引入 js/css
        template: path.resolve(__dirname, `../src/index.html`),
        filename: 'index.html',
        chunks: ['app', 'index'],
        templateParameters: ejsVariables,
        alwaysWriteToDisk: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: false,
            minifyCSS: true,
            minifyJS: true
        }
    })
);

config.plugins.push(new HtmlWebpackHarddiskPlugin());

module.exports = config;
