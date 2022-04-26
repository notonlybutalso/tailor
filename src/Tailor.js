const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');
const { existsSync } = require('fs');

class Tailor {
    constructor() {
        this.name = 'Tailor';
        this.root = path.resolve(__dirname, '../');

        this.providerSettings = {
            root: path.resolve(process.cwd()),
        };

        this.providerSettings = {
            ...{
                assetsDir: this.providerSettings.root + '/assets',
                buildDir: this.providerSettings.root + '/dist',
                config: require(this.providerSettings.root + '/tailor.js'),
            },
            ...this.providerSettings,
        };

        this.webpackCliPath = this.root + '/node_modules/.bin/webpack';
        this.webpackConfigPath = this.root + '/webpack.config.js';

        this.cmdSettings = {
            spacerStart: chalk.gray(`============================== ${this.name} ==============================`),
            spacerEnd: chalk.gray(`====================================================================`),
        };
    }

    runDevelopment() {
        let cmd = spawn(
            this.webpackCliPath,
            [
                '--mode=development',
                `--config=${this.webpackConfigPath}`
            ],
            { stdio: "inherit" }
        );

        this.executeCommand(
            cmd,
            chalk.white(`${chalk.magenta('==>')} Compiling assets (${chalk.green('development')})...`),
            chalk.white(`${chalk.green('\u2714')} Assets compiled (${chalk.green('development')})`)
        );
    }

    runProduction() {
        let cmd = spawn(
            this.webpackCliPath,
            [
                '--mode=production',
                `--config=${this.webpackConfigPath}`
            ],
            { stdio: "inherit" }
        );

        this.executeCommand(
            cmd,
            chalk.white(`${chalk.magenta('==>')} Compiling assets (${chalk.green('production')})...`),
            chalk.white(`${chalk.green('\u2714')} Assets compiled (${chalk.green('production')})`)
        );
    }

    watchDevelopment() {
        const cmd = spawn(
            this.webpackCliPath,
            [
                '--mode=development',
                '--watch',
                `--config=${this.webpackConfigPath}`,
            ],
            { stdio: "inherit" }
        );

        this.executeCommand(
            cmd,
            chalk.white(`${chalk.magenta('==>')} Watching assets (${chalk.green('development')})...`)
        );
    }

    watchProduction() {
        const cmd = spawn(
            this.webpackCliPath,
            [
                '--mode=production',
                '--watch',
                `--config=${this.webpackConfigPath}`,
            ],
            { stdio: "inherit" }
        );

        this.executeCommand(
            cmd,
            chalk.white(`${chalk.magenta('==>')} Watching assets (${chalk.green('production')})...`)
        );
    }

    /**
     * Process for executing commands
     *
     * @param {ChildProcessWithoutNullStreams} spawn
     */
    executeCommand(spawn, start_message = '', end_message = '') {
        if (start_message) {
            spawn.on("spawn", code => {
                console.log(
                    `${this.cmdSettings.spacerStart}\n` +
                    `${start_message}\n`
                );
            });
        }

        if (end_message) {
            spawn.on("close", code => {
                console.log(
                    `\n${end_message}\n` +
                    `${this.cmdSettings.spacerStart}`
                );
            });
        }
    }

    /**
     * Settings for ImageMinimizerPlugin
     *
     * @param {boolean} isProduction
     * @returns {string[][]}
     */
    imageOptimisationSettings(isProduction = false) {
        let settings = [
            ['jpegtran'],
            ['optipng'],
        ];

        if (isProduction) {
            settings.push(['svgo', {
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

        return settings;
    }

    /**
     * Settings for FileManagerPlugin
     *
     * @param {boolean} isProduction
     * @returns {object}
     */
    fileManagerSettings(isProduction = false) {
        let toDelete = this.providerSettings.config.deleteOnEnd ?? ['| Nothing to delete.'];

        let settings = {
            onEnd: {
                delete: toDelete,
            },
        };

        if (isProduction) {
            toDelete.push(this.providerSettings.root + '/theme');

            let copy_settings = [
                {
                    source: this.providerSettings.root + '/dist/',
                    destination: this.providerSettings.root + '/theme/dist',
                },
                {
                    source: this.providerSettings.root + '/includes/',
                    destination: this.providerSettings.root + '/theme/includes',
                },
                {
                    source: this.providerSettings.root + '/src/',
                    destination: this.providerSettings.root + '/theme/src',
                },
                {
                    source: this.providerSettings.root + '/templates/',
                    destination: this.providerSettings.root + '/theme/templates',
                },
                {
                    source: this.providerSettings.root + '/vendor/',
                    destination: this.providerSettings.root + '/theme/vendor',
                },
                {
                    source: this.providerSettings.root + '/*.php',
                    destination: this.providerSettings.root + '/theme/',
                },
                {
                    source: this.providerSettings.root + '/style.css',
                    destination: this.providerSettings.root + '/theme/',
                },
                {
                    source: this.providerSettings.root + '/screenshot.*',
                    destination: this.providerSettings.root + '/theme/',
                },
            ];

            if (existsSync(this.providerSettings.root + '/woocommerce')) {
                copy_settings.push({
                    source: this.providerSettings.root + '/woocommerce',
                    destination: this.providerSettings.root + '/theme/woocommerce',
                });
            }

            if (existsSync(this.providerSettings.root + '/template-parts')) {
                copy_settings.push({
                    source: this.providerSettings.root + '/template-parts',
                    destination: this.providerSettings.root + '/theme/template-parts',
                });
            }

            if (existsSync(this.providerSettings.root + '/languages')) {
                copy_settings.push({
                    source: this.providerSettings.root + '/languages',
                    destination: this.providerSettings.root + '/theme/languages',
                });
            }

            settings.onEnd = {
                ...settings.onEnd,
                ...{
                    delete: toDelete,
                    mkdir: [
                        this.providerSettings.root + '/theme',
                    ],
                    copy: copy_settings,
                },
            };
        }

        return settings;
    }

    /**
     * Settings for CopyPlugin
     *
     * @param {boolean} isProduction
     * @returns {object}
     */
    copySettings(isProduction = false) {
        let userSettings = this.providerSettings.config.copySettings ?? [];
        let defaultSettings = [
            {
                from: this.providerSettings.assetsDir + '/img',
                to: this.providerSettings.buildDir + '/img',
                noErrorOnMissing: true,
            },
        ];

        return {
            patterns: [
                ...userSettings,
                ...defaultSettings,
            ]
        };
    }
}

module.exports = Tailor;
