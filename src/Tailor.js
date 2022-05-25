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

        this.providerConfig = require(this.providerSettings.root + '/tailor.config.js');

        this.providerSettings = {
            ...{
                assetsDir: this.providerConfig.assetsDir ?? this.providerSettings.root + '/assets',
                buildDir: this.providerConfig.buildDir ?? this.providerSettings.root + '/dist',
                cssDir: '../css/',
            },
            ...this.providerSettings,
        };

        this.webpackSettings = {
            cliPath: this.root + '/node_modules/.bin/webpack',
            configPath: this.root + '/webpack.config.js',
            stats: 'minimal',
            performance: {
                hints: false,
            },
            entry: this.providerConfig.entry ?? {},
            output: {
                filename: '[name].min.js',
                path: path.resolve(this.providerSettings.buildDir, "js"),
            },
            resolve: {
                alias: {
                    "../img": path.resolve(this.providerSettings.assetsDir, "img"),
                },
            }
        };

        if (this.providerConfig.buildFlat == true) {
            this.webpackSettings.output.path = path.resolve(this.providerSettings.buildDir);
            this.providerSettings.cssDir = '';
        }

        this.cmdSettings = {
            spacerStart: chalk.gray(`============================== ${this.name} ==============================`),
            spacerEnd: chalk.gray(`====================================================================`),
        };
    }

    runDevelopment() {
        let cmd = spawn(
            this.webpackSettings.cliPath,
            [
                '--mode=development',
                `--config=${this.webpackSettings.configPath}`
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
            this.webpackSettings.cliPath,
            [
                '--mode=production',
                `--config=${this.webpackSettings.configPath}`
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
            this.webpackSettings.cliPath,
            [
                '--mode=development',
                '--watch',
                `--config=${this.webpackSettings.configPath}`,
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
            this.webpackSettings.cliPath,
            [
                '--mode=production',
                '--watch',
                `--config=${this.webpackSettings.configPath}`,
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
        let destinationDirectory = `${this.providerSettings.root}/theme`;

        let deleteSettings = this.providerConfig.deleteOnEnd ?? [];
        let copySettings = this.providerConfig.copyOnEnd ?? [];

        if (isProduction) {
            settings.onStart = {
                delete: [
                    destinationDirectory,
                ],
            };

            settings.onEnd = {
                mkdir: [
                    destinationDirectory,
                ],
            };

            //---- Copy
            copySettings.push({
                source: `${this.providerSettings.root}/*.php`,
                destination: destinationDirectory,
            });

            copySettings.push({
                source: `${this.providerSettings.root}/screenshot.*`,
                destination: destinationDirectory,
            });

            if (existsSync(this.providerSettings.root + '/style.css')) {
                copySettings.push({
                    source: `${this.providerSettings.root}/style.css`,
                    destination: `${destinationDirectory}/style.css`,
                });
            }

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

            if (copySettings.length) {
                settings.onEnd = {
                    ...settings.onEnd,
                    ...{
                        copy: copySettings,
                    }
                };
            }

            //---- Delete
            if (existsSync(destinationDirectory)) {
                deleteSettings.push(destinationDirectory);
            }

            if (deleteSettings.length) {
                settings.onEnd = {
                    ...settings.onEnd,
                    ...{
                        delete: deleteSettings,
                    }
                };
            }
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
        let buildDir = path.resolve(this.providerSettings.buildDir, 'img');

        if (this.providerConfig.buildFlat == true) {
            buildDir = path.resolve(this.providerSettings.buildDir, '[name][ext]');
        }

        return {
            patterns: [
                ...this.providerConfig.copySettings ?? [],
                ...[
                    {
                        from: path.resolve(this.providerSettings.assetsDir, 'img'),
                        to: buildDir,
                        noErrorOnMissing: true,
                    }
                ],
            ],
        };
    }
}
