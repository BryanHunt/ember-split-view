import SplitChild from 'ember-split-view/components/split-child';

export default SplitChild.extend({
  didInsertElement: function() {
    this._super();
    this.set('parentView.left', this);
  },

  updateOrientation: function() {
    if(this.get('isVertical'))
      this.$().css("left", "0");
    else
      this.$().css("top", "0");
  }.observes('isVertical'),

  updateMovableSide: function() {
    var percent = 100 - this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;

    if(this.get('isVertical'))
      this.$().css("right", percent + "%");
    else
      this.$().css("bottom", percent + "%");      

    this.updateChildSplitView();
  }.observes('sashWidthPercentage', 'splitPercentage', 'isVertical')
});