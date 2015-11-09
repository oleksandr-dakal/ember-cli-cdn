/* jshint node: true */
'use strict';

// Modules injection
var path = require('path');
var _ = require('lodash');
var minimatch = require('minimatch');

// Broccoli plugins
var Cdnizer = require('broccoli-cdnizer');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var unwatchedTree = require('broccoli-unwatched-tree');

// Addon
module.exports = {
  name: 'ember-cli-cdn',
  included: function (app) {
    // Invoke parent method
    this._super.included.apply(this, arguments);

    // Local variables
    var usrDefinedOpts = app.options.cdn || {},
      cdn;

    cdn = {
      app: app,
      // Project root
      root: app.project.root,
      // Define if addon enabled
      enabled: typeof usrDefinedOpts.enabled === 'boolean' ?
        usrDefinedOpts.enabled : app.env === 'production',
      // Cdn files options
      cdnize: usrDefinedOpts.files || [],
      // Path to assets
      assets: path.dirname(app.options.outputPaths.vendor.js)
        .replace(new RegExp('^' + path.sep), ''),
      // Files that included in vendor's bundle files
      bunledFiles: [].concat(app.vendorStaticStyles,
        app.legacyFilesToAppend),
      // Files that will be included to template
      contentForLinks: [],
      contentForHTML: ''
    };

    if (cdn.enabled) {
      // Iterate vendor files in order build defines
      _.forEach(cdn.bunledFiles, function (filePath) {
        _.forEach(cdn.cdnize, function (opt) {
          // Match cdn glob
          if (minimatch(filePath, opt.file || '')) {
            cdn.contentForLinks.push(filePath);
          }
        });
      });

      // Exclude files from bundles
      app.vendorStaticStyles = _.difference(app.vendorStaticStyles,
        cdn.contentForLinks);
      app.legacyFilesToAppend = _.difference(app.legacyFilesToAppend,
        cdn.contentForLinks);
    }

    this.cdn = cdn;
  },
  preBuild: function () {
    var cdn = this.cdn;

    if (cdn.enabled) {
      this.contentForHTML = _.reduce(cdn.contentForLinks,
        function (acc, filePath) {
          var link = path.join(cdn.assets, path.basename(filePath));

          return acc + renderTag(link);
        }, '', this);
    }

    function renderTag(link) {
      var extension = path.extname(link),
        tag = '';

      if (extension === '.js') {
        tag = '<scr' + 'ipt src="' + link + '" data-original="' + link + '"></scr' + 'ipt>';
      } else if (extension === '.css') {
        tag = '<link rel="stylesheet" href="' + link + '" data-original="' + link + '"/>';
      }

      return tag;
    }
  },
  contentFor: function (name) {
    if (name === 'cdn') {
      return this.contentForHTML;
    }
  },
  postprocessTree: function (type, tree) {
    var cdn = this.cdn,
      cdnizeTree, assetsTree;

    if(cdn.enabled && type === 'all'){
      cdnizeTree = new Cdnizer(tree, {
        files: cdn.cdnize
      });

      assetsTree = new Funnel(unwatchedTree(cdn.root), {
        include: cdn.contentForLinks,
        getDestinationPath: function (relativePath) {
          return path.join(cdn.assets, path.basename(relativePath));
        }
      });

      tree = new MergeTrees([tree, cdnizeTree, assetsTree], {
        overwrite: true
      });
    }

    return tree;
  }
};
