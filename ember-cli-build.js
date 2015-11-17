// Test build
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    cdn: {
      files: [{
        file: '**/jquery.*js',
        // Test if script loaded
        test: 'window.jQuery',
        // Public CDN string
        cdn: 'google:jquery'
      }, {
        file: '**/bootstrap.*css',
        // Specify bower package name
        package: 'bootstrap',
        // Public CDN string with specified path to file
        cdn: 'cdnjs:twitter-bootstrap:css/bootstrap.min.css'
      }, {
        file: '**/bootstrap.*js',
        package: 'bootstrap',
        // Custom CDN string
        cdn: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/${version}/js/${filenameMin}'
      }]
    },
    fingerprint: {
      prepend: 'https://subdomain.cloudfront.net/'
    }
  });

  app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');

  return app.toTree();
};
