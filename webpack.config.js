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

    let filemanagerSettings = {
        onEnd: {
            delete: Tailor.providerSettings.config.deleteOnEnd ?? ['| Nothing to delete.'],
        },
    };

    if (isProduction) {
        filemanagerSettings.onEnd = {
            ...filemanagerSettings.onEnd,
            ...{
                delete: [
                    Tailor.providerSettings.root + '/theme',
                ],
                mkdir: [
                    Tailor.providerSettings.root + '/theme',
                ],
                copy: [
                    {
                        source: Tailor.providerSettings.root + '/dist/',
                        destination: Tailor.providerSettings.root + '/theme/dist',
                    },
                    {
                        source: Tailor.providerSettings.root + '/includes/',
                        destination: Tailor.providerSettings.root + '/theme/includes',
                    },
                    {
                        source: Tailor.providerSettings.root + '/src/',
                        destination: Tailor.providerSettings.root + '/theme/src',
                    },
                    {
                        source: Tailor.providerSettings.root + '/templates/',
                        destination: Tailor.providerSettings.root + '/theme/templates',
                    },
                    {
                        source: Tailor.providerSettings.root + '/vendor/',
                        destination: Tailor.providerSettings.root + '/theme/vendor',
                    },
                    {
                        source: Tailor.providerSettings.root + '/*.php',
                        destination: Tailor.providerSettings.root + '/theme/',
                    },
                    {
                        source: Tailor.providerSettings.root + '/style.css',
                        destination: Tailor.providerSettings.root + '/theme/',
                    },
                    {
                        source: Tailor.providerSettings.root + '/screenshot.*',
                        destination: Tailor.providerSettings.root + '/theme/',
                    },
                ],
            }
        };
    }

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
                            drop_console: true,
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

            new CopyPlugin({
                patterns: [
                    {
                        from: Path.resolve(Tailor.providerSettings.assetsDir + '/img'),
                        to: Path.resolve(Tailor.providerSettings.buildDir + '/img'),
                        noErrorOnMissing: true,
                    },
                ],
            }),

            new ImageMinimizerPlugin({
                severityError: 'warning',
                loader: false,
                minimizerOptions: {
                    plugins: Tailor.imageOptimisationSettings(isProduction),
                },
            }),

            new FileManagerPlugin({
                events: filemanagerSettings,
            }),

            new WebpackNotifierPlugin({
                emoji: true,
                alwaysNotify: true,
                title: function () {
                    return 'Tailor';
                },
            }),
        ],
    }
};
