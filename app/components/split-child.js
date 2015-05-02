import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;
var observer = Ember.observer;
var htmlSafe = Ember.String.htmlSafe;

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNames: ['child'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal', 'childSplitView:nested'],

  splitPercentage: alias('parentView.splitPercentage'),
  sashWidthPercentage: alias('parentView.sash.widthPercentage'),
  isVertical: alias('parentView.isVertical'),
  isDragging: alias('parentView.isDragging'),

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
    var parent = this.get('parentView');

    if(parent.removeSplit) {
      parent.removeSplit(this);
    }
  },

  style: computed('movableSide', 'movablePercent', function() {
    var s = "";

    if(this.get('movableSide')) {
      s += this.get('movableSide') + ":" + this.get('movablePercent') + "%";
    }

    return htmlSafe(s);
  }),

  movablePercent: computed('sashWidthPercentage', 'splitPercentage', 'movableSide', function() {
    if(!this.get('movableSide')) {
      return;
    }

    if(this.get('movableSide') === "left" || this.get('movableSide') === "top") {
      return this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    } else {
      return 100 - this.get('splitPercentage') + this.get('sashWidthPercentage') / 2;
    }
  }),

  updateChildSplitView: observer('childSplitView', 'movablePercent', function() {

    // must run afterRender so that the size has updated
    Ember.run.scheduleOnce('afterRender', this, function() {
      var childSplit = this.get('childSplitView');

      if(childSplit) {
        childSplit.set('width', this.$().width());
        childSplit.set('height', this.$().height());
      }
    });
  })
});
