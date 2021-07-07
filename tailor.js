#!/usr/bin/env node

const Path = require('path');
const { spawn } = require("child_process");

const tailorRoot = Path.resolve(__dirname);
const projectRoot = Path.resolve(__dirname, '/../../../');
const commands = process.argv.slice(2);

/**
 * Execute commands
 */
//----  Webpack devevelopment build
if (commands.includes('dev')) {
    const run = spawn('./node_modules/.bin/webpack', [
        '--mode=development',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ]);

    execCommand(run, 'Compiling assets for development...', 'Assets finished compiling.');
}

//----  Webpack production build
if (commands.includes('prod')) {
    const run = spawn('./node_modules/.bin/webpack', [
        '--mode=production',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ]);

    execCommand(run, 'Compiling assets for production...', 'Assets finished compiling.');
}

//----  Webpack watch for development changes
if (commands.includes('watch-dev')) {
    const run = spawn('./node_modules/.bin/webpack', [
        '--mode=development',
        '--watch',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ]);

    execCommand(run, 'Watching assets for development...', 'Assets finished compiling.');
}

//----  Webpack watch for production changes
if (commands.includes('watch-prod')) {
    const run = spawn('./node_modules/.bin/webpack', [
        '--mode=production',
        '--watch',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ]);

    execCommand(run, 'Watching assets for production...', 'Assets finished compiling.');
}

/**
 * Process for executing commands
 *
 * @param {ChildProcessWithoutNullStreams} spawn
 */
function execCommand(spawn, start_message = '', end_message = '') {
    spawn.stdout.on("data", data => {
        console.log(`${data}`);
    });

    // runDev.stderr.on("data", data => {
    //     console.log(`${data}`);
    // });

    if (start_message) {
        spawn.on("spawn", code => {
            console.log(start_message);
        });
    }

    spawn.on('error', (error) => {
        console.log(`Error: ${error.message}`);
    });

    if (end_message) {
        spawn.on("close", code => {
            console.log(end_message);
        });
    }
}
