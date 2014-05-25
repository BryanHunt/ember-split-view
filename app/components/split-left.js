import SplitChild from 'ember-split-view/components/split-child';

export default SplitChild.extend({
  didInsertElement: function() {
    this._super();
    this.initSides();
    this.set('parentView.left', this);
  },

  initSides: function() {
    if(this.get('isVertical')) {
      this.set('fixedSide', 'left');
      this.set('movableSide', 'right');
    } else {
      this.set('fixedSide', 'top');
      this.set('movableSide', 'bottom');
    }
  }
});