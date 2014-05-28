var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: ENV.location
});

Router.map(function() {
  this.resource('vertical');
  this.route('horizontal');
  this.route('verticalComposite');
  this.route('horizontalComposite');
  this.route('composite');
});

export default Router;
