#!/usr/bin/env node

const Path = require('path');
const { spawn } = require("child_process");

const tailorRoot = Path.resolve(__dirname);
const projectRoot = Path.resolve(__dirname, '/../../../');
const commands = process.argv.slice(2);

if (commands.includes('dev')) {
    const runDev = spawn('./node_modules/.bin/webpack', [
        '--mode=development',
        `--config=${Path.resolve(tailorRoot, 'webpack.config.js')}`
    ]);

    runDev.stdout.on("data", data => {
        console.log(`${data}`);
    });

    // runDev.stderr.on("data", data => {
    //     console.log(`${data}`);
    // });

    runDev.on("spawn", code => {
        console.log('Assets compiling...');
    });

    runDev.on('error', (error) => {
        console.log(`Error: ${error.message}`);
    });

    runDev.on("close", code => {
        console.log('Assets finished compiling.');
    });
}
