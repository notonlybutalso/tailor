const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

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
}

module.exports = Tailor;
