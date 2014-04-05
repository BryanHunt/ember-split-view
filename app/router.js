var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {
  this.resource('vertical');
  this.route('horizontal');
  this.route('verticalComposite');
  this.route('composite');
});

export default Router;
