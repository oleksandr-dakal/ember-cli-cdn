'use strict';

var _ = require('lodash');
var path = require('path');
var glob = require('minimatch');

// Namespace
var Util = module.exports;

/**
 * Generate html tag string based on extension
 * @param {string} link Link
 * @returns {string} Html tag string
 */
Util.htmlTag = function (link) {
  if (!_.isString(link)) {
    throw new Error('Link must be a string');
  }

  var extension = path.extname(link),
    tagStr = '';

  switch (extension) {
    case '.js':
    case '.jsx':
    case '.ts':
      tagStr = '<script src="' + link +
        '" data-original="' + link + '"></script>';
      break;
    case '.css':
      tagStr = '<link rel="stylesheet" href="' + link +
        '" data-original="' + link + '"/>';
      break;
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
