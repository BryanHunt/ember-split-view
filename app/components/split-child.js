import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['child'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal', 'childSplitView:nested'],
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),
  sashWidthPercentage: Ember.computed.alias('parentView.sash.widthPercentage'),
  isVertical: Ember.computed.alias('parentView.isVertical'),
  isDragging: Ember.computed.alias('parentView.isDragging'),
  attributeBindings: ['style'],

  childSplitView: null,
  fixedSide: null,
  movableSide: null,

  didInsertElement: function() {
    var parent = this.get('parentView');
    if(parent.addSplit) {
      parent.addSplit(this);
    }
  },

  willDestroyElement: function() {
    this.get('parentView').removeSplit(this);    
  },

  style: function() {
    var s = "";

    if(this.get('movableSide')) {
      s += this.get('movableSide') + ":" + this.get('movablePercent') + "%";
    }

    return s;
  }.property('movableSide', 'movablePercent'),

  movablePercent: function() {
    if(!this.get('movableSide')) {
      return;
    }

    if(this.get('movableSide') === "left" || this.get('movableSide') === "top") {
      return this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    } else {
      return 100 - this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    }
  }.property('sashWidthPercentage', 'splitPercentage', 'movableSide'),

  updateChildSplitView: function() {

    // must run afterRender so that the size has updated
    Ember.run.scheduleOnce('afterRender', this, function() {
      var childSplit = this.get('childSplitView');

      if(childSplit) {
        childSplit.set('width', this.$().width());
        childSplit.set('height', this.$().height());
      }
    });
  }.observes('childSplitView', 'movablePercent')
});
