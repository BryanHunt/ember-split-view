export default Ember.Component.extend({
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),
  sashWidthPercentage: Ember.computed.alias('parentView.sash.widthPercentage'),
  isVertical: Ember.computed.alias('parentView.isVertical'),
  childSplitView: null,
  fixedSide: null,
  movableSide: null,

  didInsertElement: function() {
    this.$().css("position", "absolute");
    this.updateSize();
    this.updateFixedSide();
    this.updateMovableSide();
  },

  initChildSplitView: function() {
    this.updateChildSplitView();
  }.observes('childSplitView'),

  updateSize: function() {
    if(this.get('isVertical'))
      this.$().css("height", "100%");
    else
      this.$().css("width", "100%");
  }.observes('isVertical'),

  updateFixedSide: function() {
    this.$().css(this.get('fixedSide'), "0");
  }.observes('isVertical'),

  updateMovableSide: function() {
    var percent;

    if(this.get('movableSide') === "left" || this.get('movableSide') === "top")
      percent = this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    else
      percent = 100 - this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;

    this.$().css(this.get('movableSide'), percent + "%");
    this.updateChildSplitView();
  }.observes('sashWidthPercentage', 'splitPercentage', 'isVertical'),

  updateChildSplitView: function() {
    var childSplit = this.get('childSplitView');

    if(childSplit) {
      childSplit.set('width', this.$().width());
      childSplit.set('height', this.$().height());
    }
  }
});