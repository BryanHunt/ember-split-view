import SplitChild from 'ember-split-view/components/split-child';

export default SplitChild.extend({
  didInsertElement: function() {
    this._super();
    this.set('parentView.right', this);
    this.initSides();
  },

  initSides: function() {
    if(this.get('isVertical')) {
      this.set('fixedSide', 'right');
      this.set('movableSide', 'left');
    } else {
      this.set('fixedSide', 'bottom');
      this.set('movableSide', 'top');
    }
  }
});