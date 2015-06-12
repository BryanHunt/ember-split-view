import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('vertical');
  this.route('horizontal');
  this.route('verticalComposite');
  this.route('horizontalComposite');
  this.route('composite');
  this.route('collapsible');
});
