import { readFileSync } from 'fs';

export function runDevelopment() {
    console.info('run development');

    return null;
}

export function runProduction() {
    console.info('run production');

    return null;
}

export function watchDevelopment() {
    console.info('watch development');

    return null;
}

export function watchProduction() {
    console.info('watch production');

    return null;
}

export function webpackSettings() {
    const settings = JSON.parse(readFileSync('./tailor.json', 'utf8'));

    return settings;
}
