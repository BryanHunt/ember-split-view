'use strict';

module.exports = {
  name: require('./package').name,
  included: function(app) {
    this._super.included(app);
    app.import('vendor/ember-split-view/styles/split-view.css', { destDir: '/' });
  }
};
