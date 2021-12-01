const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const TailorClass = require('./src/Tailor');

const Tailor = new TailorClass();

module.exports = (env, options) => {
    const isProduction = options.mode == 'production';

    return {
        stats: 'minimal',

        performance: {
            hints: false,
        },

        entry: {
            ...(Tailor.providerSettings.config.entry ?? {}),
        },

        output: {
            filename: '[name].min.js',
            path: Path.resolve(Tailor.providerSettings.buildDir + '/js'),
        },

        resolve: {
            alias: {
                'bxslider': 'bxslider/src/js/jquery.bxslider',
            },
        },

        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            pure_funcs: [
                                'console.log',
                            ],
                        },
                        format: {
                            comments: false,
                        },
                    },
                }),
            ],
        },

        module: {
            rules: [
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "autoprefixer",
                                        ],
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/plugin-transform-template-literals',
                                '@babel/plugin-transform-block-scoping',
                                '@babel/plugin-proposal-nullish-coalescing-operator',
                            ],
                        },
                    },
                },
            ]
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: '../css/[name].min.css',
            }),

            new CopyPlugin(Tailor.copySettings(isProduction)),

            new ImageMinimizerPlugin({
                severityError: 'warning',
                loader: false,
                minimizerOptions: {
                    plugins: Tailor.imageOptimisationSettings(isProduction),
                },
            }),

            new FileManagerPlugin({
                events: Tailor.fileManagerSettings(isProduction),
            }),

            new WebpackNotifierPlugin({
                emoji: true,
                alwaysNotify: true,
                timeout: false,
                title: function () {
                    return 'Tailor';
                },
            }),
        ],
    }
};
