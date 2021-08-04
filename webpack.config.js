const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const projectRoot = Path.resolve(__dirname, '../../../');
const assetsDir = Path.resolve(projectRoot, 'assets');
const buildDir = Path.resolve(projectRoot, 'dist');

const themeConfig = require(projectRoot + '/tailor.js');

module.exports = (env, options) => {
    const isProduction = options.mode == 'production';

    let ImageMinimizerPlugins = [
        ['gifsicle'],
        ['jpegtran'],
        ['optipng'],
    ];

    if (isProduction) {
        ImageMinimizerPlugins.push(['svgo', {
            plugins: [
                {
                    name: "removeViewBox",
                    active: false,
                },
                {
                    name: "minifyStyles",
                    active: true,
                },
                {
                    name: "removeDoctype",
                    active: true,
                },
                {
                    name: "collapseGroups",
                    active: true,
                },
                {
                    name: "removeTitle",
                    active: true,
                },
            ],
        }]);
    }

    return {
        stats: 'minimal',

        performance: {
            hints: false,
        },

        entry: {
            ...(themeConfig.entry ?? {}),
        },

        output: {
            filename: '[name].min.js',
            path: Path.resolve(buildDir + '/js'),
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
                        from: Path.resolve(assetsDir + '/img'),
                        to: Path.resolve(buildDir + '/img'),
                    },
                ],
            }),

            new ImageMinimizerPlugin({
                severityError: 'warning',
                loader: false,
                minimizerOptions: {
                    plugins: ImageMinimizerPlugins,
                },
            }),

            new FileManagerPlugin({
                events: {
                    onEnd: {
                        delete: themeConfig.deleteOnEnd ?? ['| Nothing to delete.'],
                    },
                },
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
