#!/usr/bin/env node

const Path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');
const TailorClass = require('./src/Tailor');

const Tailor = new TailorClass();

const commands = process.argv.slice(2);

/**
 * Execute commands
 */
//----  Webpack devevelopment build
if (commands.includes('dev')) {
    const cmd = spawn(Tailor.providerSettings.root + '/node_modules/.bin/webpack', [
        '--mode=development',
        `--config=${Path.resolve(Tailor.root, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`${chalk.magenta('==>')} Compiling assets (${chalk.green('development')})...`),
        chalk.white(`${chalk.green('\u2714')} Assets compiled (${chalk.green('development')})`)
    );
}

//----  Webpack production build
if (commands.includes('prod')) {
    const cmd = spawn(Tailor.providerSettings.root + '/node_modules/.bin/webpack', [
        '--mode=production',
        `--config=${Path.resolve(Tailor.root, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`${chalk.magenta('==>')} Compiling assets (${chalk.green('production')})...`),
        chalk.white(`${chalk.green('\u2714')} Assets compiled (${chalk.green('production')})`)
    );
}

//----  Webpack watch for development changes
if (commands.includes('watch-dev')) {
    const cmd = spawn(Tailor.providerSettings.root + '/node_modules/.bin/webpack', [
        '--mode=development',
        '--watch',
        `--config=${Path.resolve(Tailor.root, 'webpack.config.js')}`,
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`${chalk.magenta('==>')} Watching assets (${chalk.green('development')})...`)
    );
}

//----  Webpack watch for production changes
if (commands.includes('watch-prod')) {
    const cmd = spawn(Tailor.providerSettings.root + '/node_modules/.bin/webpack', [
        '--mode=production',
        '--watch',
        `--config=${Path.resolve(Tailor.root, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`${chalk.magenta('==>')} Watching assets (${chalk.green('production')})...`)
    );
}

/**
 * Process for executing commands
 *
 * @param {ChildProcessWithoutNullStreams} spawn
 */
function execCommand(spawn, start_message = '', end_message = '') {
    if (start_message) {
        spawn.on("spawn", code => {
            console.log(
                `${Tailor.cmdSettings.spacerStart}\n` +
                `${start_message}\n`
            );
        });
    }

    if (end_message) {
        spawn.on("close", code => {
            console.log(
                `\n${end_message}\n` +
                `${Tailor.cmdSettings.spacerStart}`
            );
        });
    }
}
