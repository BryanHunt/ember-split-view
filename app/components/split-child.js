export default Ember.Component.extend({
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),
  sashWidthPercentage: Ember.computed.alias('parentView.sash.widthPercentage'),
  isVertical: Ember.computed.alias('parentView.isVertical'),
  childSplitView: null,

  didInsertElement: function() {
    this.$().css("position", "absolute");
    this.updateSize();
    this.updateOrientation();
    this.updateMovableSide();
  },

  updateSize: function() {
    if(this.get('isVertical'))
      this.$().css("height", "100%");
    else
      this.$().css("width", "100%");
  }.observes('isVertical'),

  initChildSplitView: function() {
    this.updateChildSplitView();
  }.observes('childSplitView'),

  updateChildSplitView: function() {
    var childSplit = this.get('childSplitView');

    if(childSplit) {
      childSplit.set('width', this.$().width());
      childSplit.set('height', this.$().height());
    }
  }
});