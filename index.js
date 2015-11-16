'use strict';

var path = require('path');
var _ = require('lodash');

// Broccoli plugins
var Cdnizer = require('broccoli-cdnizer');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var UnwatchedTree = require('broccoli-unwatched-tree');

var Util = require('./util/util');

module.exports = {
  name: 'ember-cli-cdn',
  included: function (app) {
    // Invoke parent method
    this._super.included.apply(this, arguments);

    // Local variables
    var def = app.options.cdn || {},
      options;

    options = this.options = {
      // Project root
      root: app.project.root,
      // Define if addon enabled
      enabled: typeof def.enabled === 'boolean' ?
        def.enabled : app.env === 'production',
      // Cdn files options
      cdnize: def.files || [],
      // Path to assets
      assets: path.dirname(app.options.outputPaths.vendor.js)
        .replace(new RegExp('^' + path.sep), ''),
      // Files that will be included to template
      links: [],
      content: ''
    };

    if (options.enabled) {
      var patterns = _.pluck(options.cdnize, 'file'),
        extractedStyles = Util.extractItems(app.vendorStaticStyles, patterns),
        extractedScripts = Util.extractItems(app.legacyFilesToAppend, patterns);

      options.links = [].concat(extractedStyles, extractedScripts);
    }
  },
  preBuild: function () {
    var options = this.options;

    if (options.enabled) {
      options.content = _.reduce(options.links, function (acc, link) {
        return acc + Util.htmlTag(path.join(options.assets,
            path.basename(link)));
      }, '', this);
    }
  },
  contentFor: function (name) {
    if (name === 'cdn') {
      return this.options.content;
    }
  },
  postprocessTree: function (type, tree) {
    var options = this.options,
      cdnizeTree, assetsTree;

    if (options.enabled && type === 'all') {
      cdnizeTree = new Cdnizer(tree, {
        files: options.cdnize
      });

      assetsTree = new Funnel(UnwatchedTree(options.root), {
        include: options.links,
        getDestinationPath: function (relativePath) {
          return path.join(options.assets, path.basename(relativePath));
        }
      });

      tree = new MergeTrees([tree, cdnizeTree, assetsTree], {
        overwrite: true
      });
    }

    return tree;
  }
};
