# Tailor

[Webpack 5](https://webpack.js.org/) asset building for WordPress themes.

## Usage

To use Tailor in your project you just need to install it as a dependency:

```shell
# NPM
npm install @fhoke/tailor

# Yarn
yarn add @fhoke/tailor
```

**Important**: You will need to be logged in to NPM via the command line as Tailor is a private NPM package.

## Scripts

To use the Tailor CLI tool, you can run it like so:

```shell
# Run development build
./node_modules/.bin/tailor dev

# Run production build
/node_modules/.bin/tailor prod

# Watch for development changes
./node_modules/.bin/tailor watch-dev

# Watch for production changes
./node_modules/.bin/tailor watch-prod
```

Or you can add your own NPM / Yarn scripts to your `package.json` file like so:

```json
"scripts": {
    "dev": "./node_modules/.bin/tailor dev",
    "prod": "./node_modules/.bin/tailor prod",
    "watch:dev": "./node_modules/.bin/tailor watch-dev",
    "watch:prod": "./node_modules/.bin/tailor watch-prod"
}
```
