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
    if(this.get('parentView').addSplit) {
      this.get('parentView').addSplit(this);
    }

    Ember.run.scheduleOnce('afterRender', this, this.updateChildSplitView);
  },

  willDestroyElement: function() {
    this.get('parentView').removeSplit(this);    
  },

  style: function() {
    var s = "position: absolute;";

    if(this.get('isVertical')) {
      // can't use height:100% as this wouldn't take account of padding and margins
      s += "top:0px;bottom:0px;";
    } else {
      // can't use width:100% as this wouldn't take account of padding and margins
      s += "left:0px;right:0px;";
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
      childSplit.set('width', this.$().width());
      childSplit.set('height', this.$().height());
    }
  }.observes('childSplitView', 'movablePercent')
});
