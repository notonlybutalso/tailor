const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');
const { existsSync } = require('fs');

module.exports = class Tailor {
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
                config: require(this.providerSettings.root + '/tailor.config.js'),
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
        let settings = {};
        let destinationDirectory = `${this.providerSettings.root}/theme/`;

        let deleteSettings = this.providerSettings.config.deleteOnEnd ?? [];

        if (deleteSettings.length) {
            settings.onEnd = {
                delete: deleteSettings,
            };
        }

        if (isProduction) {
            if (existsSync(destinationDirectory)) {
                deleteSettings.push(destinationDirectory);
            }

            let copySettings = [
                {
                    source: `${this.providerSettings.root}/*.php`,
                    destination: destinationDirectory,
                },
                {
                    source: `${this.providerSettings.root}/style.css`,
                    destination: destinationDirectory,
                },
                {
                    source: `${this.providerSettings.root}/screenshot.*`,
                    destination: destinationDirectory,
                },
            ];

            if (existsSync(this.providerSettings.root + '/dist')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/dist/`,
                    destination: `${destinationDirectory}/dist`,
                });
            }

            if (existsSync(this.providerSettings.root + '/inc')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/inc/`,
                    destination: `${destinationDirectory}/inc`,
                });
            }

            if (existsSync(this.providerSettings.root + '/includes')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/includes/`,
                    destination: `${destinationDirectory}/includes`,
                });
            }

            if (existsSync(this.providerSettings.root + '/src')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/src/`,
                    destination: `${destinationDirectory}/src`,
                });
            }

            if (existsSync(this.providerSettings.root + '/templates')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/templates/`,
                    destination: `${destinationDirectory}/templates`,
                });
            }

            if (existsSync(this.providerSettings.root + '/resources')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/resources/`,
                    destination: `${destinationDirectory}/resources`,
                });
            }

            if (existsSync(this.providerSettings.root + '/config')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/config/`,
                    destination: `${destinationDirectory}/config`,
                });
            }

            if (existsSync(this.providerSettings.root + '/vendor')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/vendor/`,
                    destination: `${destinationDirectory}/vendor`,
                });
            }

            settings.onEnd = {
                ...settings.onEnd,
                ...{
                    delete: deleteSettings,
                    mkdir: [
                        destinationDirectory,
                    ],
                    copy: copySettings,
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
