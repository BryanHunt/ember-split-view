/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-split-view',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/ember-split-view/styles/split-view.css', { destDir: '/' });
  }
};
