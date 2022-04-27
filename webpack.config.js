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
        stats: Tailor.webpackSettings.stats,

        performance: Tailor.webpackSettings.performance,

        entry: Tailor.webpackSettings.entry,

        output: Tailor.webpackSettings.output,

        resolve: Tailor.webpackSettings.resolve,

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

                new ImageMinimizerPlugin({
                    severityError: 'warning',
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: Tailor.imageOptimisationSettings(isProduction),
                        },
                    },
                }),
            ],
        },

        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
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
                    test: /\.svg$/,
                    type: 'asset/source',
                },
                {
                    test: /\.(js?)$/,
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
                filename: `${Tailor.providerSettings.cssDir}[name].min.css`,
            }),

            new CopyPlugin(Tailor.copySettings(isProduction)),

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
