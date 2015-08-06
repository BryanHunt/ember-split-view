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
  splitPosition: alias('parentView.splitPosition'),
  sashWidth: alias('parentView.sash.width'),
  parentWidth: alias('parentView.width'),
  parentHeight: alias('parentView.height'),
  isVertical: alias('parentView.isVertical'),
  isDragging: alias('parentView.isDragging'),

  childSplitView: null,
  fixedSide: null,
  movableSide: null,

  init: function() {
    this._super();

    Ember.run.schedule('afterRender', this, function() {
      this.set('register-as', this); // register-as is a new property
    });
  },

  didInsertElement: function() {
    var parent = this.get('parentView');

    // run next to avoid changing the component during a render iteration
    Ember.run.next(this, function() {
      if(parent.addSplit) {
        parent.addSplit(this);
      }
    });
  },

  willDestroyElement: function() {
    var parent = this.get('parentView');

    if(parent.removeSplit) {
      parent.removeSplit(this);
    }
  },

  style: computed('movableSide', 'movablePixels', function() {
    var s = "";

    if(this.get('movableSide')) {
      s += this.get('movableSide') + ":" + this.get('movablePixels') + "px";
    }

    return htmlSafe(s);
  }),

  parentSize: computed('movableSide', 'parentWidth', 'parentHeight', function() {
    var movableSide = this.get('movableSide');
    if(!movableSide) {
      return 0;
    }
    return (movableSide === "left" || movableSide == "right") ? this.get('parentWidth') : this.get('parentHeight');
  }),

  movablePixels: computed('sashWidth', 'splitPosition', 'movableSide', 'parentSize', function() {
    var movableSide = this.get('movableSide');
    if(!movableSide) {
      return;
    }

    if(movableSide === "left" || movableSide === "top") {
      return this.get('splitPosition') + this.get('sashWidth') / 2;
    } else {
      var parentSize = this.get('parentSize');
      if (!parentSize)
      {
        return 0;
      }
      return parentSize - this.get('splitPosition') + this.get('sashWidth') / 2;
    }
  }),

  updateChildSplitView: observer('childSplitView', 'movablePixels', function() {

    // must run afterRender so that the size has updated
    Ember.run.scheduleOnce('afterRender', this, function() {
      var childSplit = this.get('childSplitView');

      if(childSplit) {
        childSplit.set('width', this.$().width());
        childSplit.set('height', this.$().height());
      }
    });
  }),

  collapse: function() {
    if(this.get('movableSide') === "left" || this.get('movableSide') === "top") {
      this.set('splitPosition', this.get('parentSize'));
    } else {
      this.set('splitPosition', 0);
    }
    this.get('parentView').constrainSplit();
  },

  minSize: computed('isVertical', 'childSplitView.minSize', function() {
    var childSplitView = this.get('childSplitView');
    if (childSplitView)
    {
      return childSplitView.get('minSize');
    }
    var self = this;
    var cssInt = function(name) {
      return parseInt(self.$().css(name));
    }
    if(this.get('isVertical')) {
      return cssInt("min-width") + cssInt("padding-left") + cssInt("padding-right")
                                 + cssInt("border-left")  + cssInt("border-right")
                                 + cssInt("margin-left")  + cssInt("margin-right")
              + this.get('sashWidth') / 2;
    } else {
      return cssInt("min-height") + cssInt("padding-top") + cssInt("padding-bottom")
                                  + cssInt("border-top")  + cssInt("border-bottom")
                                  + cssInt("margin-top")  + cssInt("margin-bottom")
             + this.get('sashWidth') / 2;
    }
  })

});
