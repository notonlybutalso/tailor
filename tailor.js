#!/usr/bin/env node

// import { resolve } from 'path';
// const TailorClass = require(resolve(__dirname, './src/Tailor'));
// const Tailor = new TailorClass();

import { runDevelopment, runProduction, watchDevelopment, watchProduction } from './src/Tailor.js';

const commands = process.argv.slice(2);

/**
 * Execute commands
 */
//----  Webpack devevelopment build
if (commands.includes('dev')) {
    runDevelopment();
}

//----  Webpack production build
if (commands.includes('prod')) {
    runProduction();
}

//----  Webpack watch for development changes
if (commands.includes('watch-dev')) {
    watchDevelopment();
}

//----  Webpack watch for production changes
if (commands.includes('watch-prod')) {
    watchProduction();
}
