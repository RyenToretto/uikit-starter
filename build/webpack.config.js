const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const ejsVariables = require('../build/ejs-variables.js');

module.exports = (env, argv) => {
    let isProduction = (argv.mode === 'production');
    let config = {
        entry: {
            index: path.resolve(__dirname, '../src/js/app.js')
        },
        devtool: "inline-source-map",
        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: 'static/js/[name].js',
            publicPath: "/"
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "static/css/[name].css",
                chunkFilename: "static/css/[name].css"
            }),
            new OptimizeCSSAssetsPlugin({ safe: true, map: false, discardComments: { removeAll: true } }),
            new CopyPlugin([
                {from: 'assets', to: 'static'}
            ]),
            new ImageminPlugin({
                disable: false,
                test: /\.(jpe?g|png|gif)$/i,
                pngquant: {quality: '70-85'},
                optipng: {optimizationLevel: 9}
            })
        ],
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

        // custom loaders configuration
        module: {
            rules: [
                // styles loader
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ],
                },

                // images loader
                {
                    test: /\.(png|jpe?g|gif)$/,
                    loaders: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "img/[name].[ext]"
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                disable: false,
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                optipng: {enabled: false},
                                gifsicle: {interlaced: false},
                                webp: {quality: 75}
                            }
                        },
                    ],
                },

                // fonts loader
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "fonts/[name].[ext]"
                            }
                        },
                    ],
                },

                // svg inline 'data:image' loader
                {
                    test: /\.svg$/,
                    loader: "svg-url-loader"
                },
            ]
        },

        devServer: {
            disableHostCheck: true,
            port: 8888,
            host: '0.0.0.0'
        }
    };

    // PRODUCTION ONLY configuration
    if (isProduction) {
        config.plugins.push(
            // clean 'dist' directory
            new CleanWebpackPlugin()
        );
    }
    config.plugins.push(
        new HtmlWebpackPlugin({
            inject: true, // 是否自动引入 js/css
            filename: 'index.html',
            template: path.resolve(__dirname, `../index.html`),
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

    return config;
};
