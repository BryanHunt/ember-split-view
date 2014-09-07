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
    this.get('parentView').addChildView(this);
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
  }.property('isVertical', 'fixedSide', 'movablePercent'),

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
      childSplit.set('width', "100%");
      childSplit.set('height', "100%");
      window.console.log("updateChildSplitView  width: " + childSplit.get('width') + "  height: " + childSplit.get('height'));
    }
  }.observes('childSplitView', 'style')
});