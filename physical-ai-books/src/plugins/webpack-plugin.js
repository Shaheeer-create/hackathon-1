// @ts-check

/**
 * @param {import('@docusaurus/types').PluginOptions} options
 * @param {import('@docusaurus/types').DocusaurusContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
module.exports = function createWebpackConfigPlugin(options, context) {
  return {
    name: 'custom-webpack-config-plugin',
    
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            process: require.resolve('process/browser'),
            https: require.resolve('https-browserify'),
            http: require.resolve('http-browserify'),
            url: require.resolve('url/'),
            zlib: require.resolve('browserify-zlib'),
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            querystring: require.resolve('querystring-es3'),
            assert: require.resolve('assert'),
            fs: false, // Don't polyfill fs
            net: false, // Don't polyfill net
            tls: false, // Don't polyfill tls
            child_process: false, // Don't polyfill child_process
            dns: false, // Don't polyfill dns
            readline: false, // Don't polyfill readline
            repl: false, // Don't polyfill repl
          },
        },
        plugins: [
          ...config.plugins,
          // Add plugin to define global variables
          new (require('webpack').DefinePlugin)({
            global: 'globalThis',
          }),
          // Add plugin to handle process variable
          new (require('webpack').ProvidePlugin)({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
      };
    },
  };
};