#!/usr/bin/env node

const TailorClass = require('./src/Tailor');
const Tailor = new TailorClass();

const commands = process.argv.slice(2);

/**
 * Execute commands
 */
//----  Webpack devevelopment build
if (commands.includes('dev')) {
    Tailor.runDevelopment();
}

//----  Webpack production build
if (commands.includes('prod')) {
    Tailor.runProduction();
}

//----  Webpack watch for development changes
if (commands.includes('watch-dev')) {
    Tailor.watchDevelopment();
}

//----  Webpack watch for production changes
if (commands.includes('watch-prod')) {
    Tailor.watchProduction();
}
