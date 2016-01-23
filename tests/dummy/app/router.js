import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('vertical');
  this.route('horizontal');
  this.route('verticalComposite');
  this.route('horizontalComposite');
  this.route('composite');
  this.route('collapsible');
});

export default Router;
