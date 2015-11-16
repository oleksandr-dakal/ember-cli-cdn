/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    cdn: {
      files: [{
        file: '**/jquery.*js',
        cdn: 'google:jquery'
      }, {
        file: '**/ember.*js',
        cdn: 'cdnjs:ember.js'
      }]
    }
  });

  return app.toTree();
};
