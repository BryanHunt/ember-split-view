'use strict';

var path = require('path');
var fs   = require('fs');

function EmberSplitView(project) {
  this.project = project;
  this.name    = 'Ember Split View';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberSplitView.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-split-view', name + '-addon');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberSplitView.prototype.included = function included(app) {
  this.app = app;
};

module.exports = EmberSplitView;