import Ember from 'ember';

var Router = Ember.Router.extend({
  location: EmberSplitViewENV.locationType
});

Router.map(function() {
  this.resource('vertical');
  this.route('horizontal');
  this.route('verticalComposite');
  this.route('horizontalComposite');
  this.route('composite');
});

export default Router;
