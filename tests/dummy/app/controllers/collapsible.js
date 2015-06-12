export default Ember.Controller.extend({
  actions: {
    collapseLeft: function() {
      this.get('leftChild').collapse();
    },
    collapseRight: function() {
      this.get('rightChild').collapse();
    }
  }
});
