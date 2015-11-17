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

    // Defined options
    var def = app.options.cdn || {};

    this.options = {
      app: app,
      // Project root
      root: app.project.root,
      // Define if to include original assets link
      original: def.original,
      // Define if addon enabled
      enabled: app.options.cdn &&
      (typeof def.enabled === 'boolean' ?
        def.enabled : app.env === 'production'),
      // Cdn files options
      cdnize: def.files || [],
      // Path to assets
      assets: path.dirname(app.options.outputPaths.vendor.js)
        .replace(new RegExp('^' + path.sep), ''),
      // Files that will be included to template
      links: []
    };

  },
  treeFor: function(type) {
    var options = this.options,
      app = options.app;

    if (type === 'vendor' && options.enabled) {
      var patterns = _.pluck(options.cdnize, 'file'),
        extractedStyles = Util.extractItems(app.vendorStaticStyles, patterns),
        extractedScripts = Util.extractItems(app.legacyFilesToAppend, patterns);

      options.links = [].concat(extractedStyles, extractedScripts);
    }
  },
  contentFor: function (name) {
    var options = this.options,
      links;

    if(options.enabled){
      if(name === 'cdn-scripts'){
        links = Util.filterLinks(options.links, 'scripts');
      }

      if(name === 'cdn-styles'){
        links = Util.filterLinks(options.links, 'styles');
      }

      if(links) {
        return _.reduce(links, function (acc, link) {
          var assetPath = path.join(options.assets, path.basename(link));

          return acc + Util.htmlTag(assetPath, options.original) + '\n';
        }, '', this);
      }
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
