import SplitChild from 'ember-split-view/components/split-child';

export default SplitChild.extend({
  didInsertElement: function() {
    this._super();
    this.set('parentView.right', this);
  },

  updateFixedSide: function() {
    if(this.get('isVertical'))
      this.$().css("right", "0");
    else
      this.$().css("bottom", "0");
  }.observes('isVertical'),

  updateMovableSide: function() {
    var percent = this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    
    if(this.get('isVertical'))
      this.$().css("left", percent + "%");
    else
      this.$().css("top", percent + "%");

    this.updateChildSplitView();
  }.observes('sashWidthPercentage', 'splitPercentage', 'isVertical')
});