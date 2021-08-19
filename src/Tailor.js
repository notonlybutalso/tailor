const path = require('path');
const chalk = require('chalk');

class Tailor {
    constructor() {
        this.name = 'Tailor';
        this.root = path.resolve(__dirname, '../');

        this.providerSettings = {
            root: path.resolve(__dirname, '../../../../'),
        };

        this.providerSettings = {
            ...{
                assetsDir: this.providerSettings.root + '/assets',
                buildDir: this.providerSettings.root + '/dist',
                config: require(this.providerSettings.root + '/tailor.js'),
            },
            ...this.providerSettings,
        };

        this.cmdSettings = {
            spacerStart: chalk.gray(`============================== ${this.name} ==============================`),
            spacerEnd: chalk.gray(`====================================================================`),
        };
    }
}

module.exports = Tailor;
