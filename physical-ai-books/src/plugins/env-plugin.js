// @ts-check

/**
 * @param {import('@docusaurus/types').DocusaurusConfig} context
 * @returns {import('@docusaurus/types').Plugin}
 */
const environmentVariablesPlugin = (context, options) => {
  return {
    name: 'environment-variables-plugin', // This is required for Docusaurus plugins

    configureWebpack(config, isServer, utils) {
      // Expose environment variables that start with REACT_APP_ to the client
      const env = {
        'process.env.REACT_APP_AUTH_API_URL': JSON.stringify(process.env.REACT_APP_AUTH_API_URL || 'http://localhost:4000'),
      };

      config.plugins.push(new (require('webpack')).DefinePlugin(env));

      // Add fallbacks for Node.js modules that are not available in the browser
      if (!isServer) {
        // Polyfill Node.js modules for client-side
        Object.assign(config.resolve.fallback || {}, {
          fs: false, // Don't polyfill fs in the browser
          path: require.resolve('path-browserify'),
          util: require.resolve('util/'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
          process: require.resolve('process/browser'),
        });

        // Mark better-sqlite3 as external to prevent it from being bundled
        config.externals = {
          ...config.externals,
          'better-sqlite3': 'commonjs better-sqlite3',
        };
      }

      return {
        mergeStrategy: {
          plugins: 'replace', // Ensure our plugins replace any existing ones
        },
      };
    },
  };
};

module.exports = environmentVariablesPlugin;