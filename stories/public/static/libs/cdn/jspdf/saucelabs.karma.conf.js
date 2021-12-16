'use strict'
const yaml = require('js-yaml')
const fs = require('fs')

const browsers = {
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  },
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '53'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '49'
  },
  // sl_ios_safari: {
  //   base: 'SauceLabs',
  //   browserName: 'iphone',
  //   platform: 'OS X 10.11',
  //   version: '9.3'
  // },
}

module.exports = (config) => {
  // Use ENV vars or .sauce.yml to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('.sauce.yml')) {
      console.log(
        'Create a .sauce.yml with your credentials'
      )
      process.exit(1)
    } else {
      let sauceConfig = yaml.safeLoad(fs.readFileSync('.sauce.yml', 'utf8'))
      process.env.SAUCE_USERNAME = sauceConfig.addons.sauce_connect.username
      process.env.SAUCE_ACCESS_KEY = sauceConfig.addons.sauce_connect.access_key
    }
  }
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    // @TODO: Make this the same across both configs
    files: [
      'libs/polyfill.js',
      'jspdf.js',
      {
        pattern: 'plugins/*.js',
        included: true
      },      
      'libs/Deflater.js',
      'libs/JPEGEncoder.js',
      'libs/png_support/png.js',
      'libs/png_support/zlib.js',
      'node_modules/omggif/omggif.js',
      'libs/BMPDecoder.js',
      'libs/ttffont.js',
      'libs/rgbcolor.js',
      'libs/canvg_context2d/libs/StackBlur.js',
      'libs/canvg_context2d/canvg.js',
      'tests/utils/compare.js',
      {
        pattern: 'tests/**/*.spec.js',
        included: true
      }, {
        pattern: 'tests/**/reference/*.*',
        included: false,
        served: true
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'jspdf.js': 'coverage',
      'plugins/*.js': 'coverage',      
      'libs/polyfill.js': 'coverage',
      'libs/ttffont.js': 'coverage',
      'libs/Deflater.js': 'coverage',
      'libs/png_support/png.js': 'coverage',
      'libs/png_support/zlib.js': 'coverage',
      'tests/!(acroform|unicode)*/*.js': 'babel'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    browserNoActivityTimeout: 60000,
    captureTimeout: 120000,

    reporters: ['saucelabs', 'progress', 'coverage', 'mocha', 'verbose'], // 2
    browsers: Object.keys(browsers), // 3
    customLaunchers: browsers, // 4

    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage/'
        },
        {
          type: 'text'
        }
      ]
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    }
  })
}
