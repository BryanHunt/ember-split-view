import Ember from 'ember';

export default Ember.Component.extend({
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),
  sashWidthPercentage: Ember.computed.alias('parentView.sash.widthPercentage'),
  isVertical: Ember.computed.alias('parentView.isVertical'),
  attributeBindings: ['style'],

  childSplitView: null,
  fixedSide: null,
  movableSide: null,

  didInsertElement: function() {
    this.get('parentView').addSplit(this);
    Ember.run.scheduleOnce('afterRender', this, this.updateChildSplitView);
  },

  willDestroyElement: function() {
    this.get('parentView').removeSplit(this);    
  },

  style: function() {
    var s = "position: absolute;";

    if(this.get('isVertical')) {
      s += "height:100%;";
    } else {
      s += "width:100%;";
    }

    if(this.get('fixedSide')) {
      s += this.get('fixedSide') + ":0px;"
    }

    if(this.get('movableSide')) {
      s += this.get('movableSide') + ":" + this.get('movablePercent') + "%";
    }

    return s;
  }.property('isVertical', 'fixedSide', 'movableSide', 'movablePercent'),

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
    var childSplit = this.get('childSplitView');

    if(childSplit) {
      window.console.log("split-child.updateChildSplitView()  width: " + this.$().width() + "  height: " + this.$().height());
      childSplit.set('width', this.$().width());
      childSplit.set('height', this.$().height());
    }
  }.observes('childSplitView', 'movablePercent')
});