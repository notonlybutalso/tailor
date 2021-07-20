#!/usr/bin/env node

const Path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

const tailorRoot = Path.resolve(__dirname);
const projectRoot = Path.resolve(__dirname, '/../../../');
const commands = process.argv.slice(2);

const packageName = 'Tailor';
const strSpacerStart = chalk.gray(`============================== ${packageName} ==============================`);
const strSpacerEnd = chalk.gray(`====================================================================`);

/**
 * Execute commands
 */
//----  Webpack devevelopment build
if (commands.includes('dev')) {
    const cmd = spawn('./node_modules/.bin/webpack', [
        '--mode=development',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`Compiling Assets (${chalk.green('development')})`),
        chalk.white(`Assets compiled (${chalk.green('development')})`)
    );
}

//----  Webpack production build
if (commands.includes('prod')) {
    const cmd = spawn('./node_modules/.bin/webpack', [
        '--mode=production',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`Compiling Assets (${chalk.green('production')})`),
        chalk.white(`Assets compiled (${chalk.green('production')})`)
    );
}

//----  Webpack watch for development changes
if (commands.includes('watch-dev')) {
    const cmd = spawn('./node_modules/.bin/webpack', [
        '--mode=development',
        '--watch',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`,
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`Watching Assets (${chalk.green('development')})`),
    );
}

//----  Webpack watch for production changes
if (commands.includes('watch-prod')) {
    const cmd = spawn('./node_modules/.bin/webpack', [
        '--mode=production',
        '--watch',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ], { stdio: "inherit" });

    execCommand(
        cmd,
        chalk.white(`Watching Assets (${chalk.green('production')})`),
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
                `${strSpacerStart}\n` +
                `${start_message}\n` +
                `${strSpacerEnd}\n`
            );
        });
    }

    if (end_message) {
        spawn.on("close", code => {
            console.log(
                `\n${strSpacerStart}\n` +
                `${end_message}\n` +
                `${strSpacerEnd}`
            );
        });
    }
}
