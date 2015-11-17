'use strict';

var _ = require('lodash');
var path = require('path');
var glob = require('minimatch');

// Constants
var script_ext = [
  '.js',
  '.jsx',
  '.ts'
];
var style_ext = [
  '.css'
];

// Namespace
var Util = module.exports;

/**
 * Generate html tag string based on extension
 * @param {string} link Link
 * @param {boolean} original Duplicate link to data attr
 * @returns {string} Html tag string
 */
Util.htmlTag = function (link, original) {
  if (!_.isString(link)) {
    throw new Error('Link must be a string');
  }

  var extension = path.extname(link),
    originalAttr = '',
    tagStr = '';

  if (original) {
    originalAttr = ' data-original="' + link + '"';
  }

  if (script_ext.indexOf(extension) > -1) {
    tagStr = '<script src="' + link + '"' +
      originalAttr + '></script>';
  } else if (style_ext.indexOf(extension) > -1) {
    tagStr = '<link rel="stylesheet" href="' + link + '"' +
      originalAttr + '/>';
  }

  return tagStr;
};

/**
 * Extract item from array that match one of glob patterns
 * @param {Array} arr Array
 * @param {Array} patterns Patterns to match
 * @returns {Array} Extracted items
 */
Util.extractItems = function (arr, patterns) {
  if (!_.isArray(arr) || !_.isArray(patterns)) {
    throw new Error('Params must be an arrays');
  }

  var extracted = [];

  _.forEach(arr, function (filePath) {
    _.forEach(patterns, function (pattern) {
      // Match glob
      if (glob(filePath, pattern || '')) {
        extracted.push(filePath);
      }
    });
  });

  // Mutate array of files
  arr.splice.apply(arr, _.flatten([0, arr.length,
    _.difference(arr, extracted)]));

  return extracted;
};

/**
 * Filter tags by type
 * @param {Array} links List of links
 * @param {string} type Type of links to be filtered
 * @returns {Array} List of filtered links
 */
Util.filterLinks = function (links, type) {
  var extFilter,
    filtered = links;

  if (type === 'scripts') {
    extFilter = script_ext;
  } else if (type === 'styles') {
    extFilter = style_ext;
  }

  if (extFilter) {
    filtered = _.filter(links, function (link) {
      var extension = path.extname(link);

      return extFilter.indexOf(extension) > -1;
    });
  }

  return filtered;
};
