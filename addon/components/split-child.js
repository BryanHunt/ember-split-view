import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;
var observer = Ember.observer;
var htmlSafe = Ember.String.htmlSafe;

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNames: ['child'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal', 'childSplitView:nested'],

  splitPosition: alias('parentView.splitPosition'),
  sashWidth: alias('parentView.sash.width'),
  parentWidth: alias('parentView.width'),
  parentHeight: alias('parentView.height'),
  isVertical: alias('parentView.isVertical'),
  isDragging: alias('parentView.isDragging'),

  childSplitView: null,
  anchorSide: null,

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
      if(parent && parent.addSplit) {
        parent.addSplit(this);
      }
    });
  },

  willDestroyElement: function() {
    var parent = this.get('parentView');

    if(parent && parent.removeSplit) {
      parent.removeSplit(this);
    }
  },

  style: computed('anchorSide', 'anchorOffset', function() {
    var s = "";

    var anchorSide = this.get('anchorSide');
    if(anchorSide) {
      s += anchorSide + ":" + this.get('anchorOffset') + "px";
    }

    return htmlSafe(s);
  }),

  parentSize: computed('anchorSide', 'parentWidth', 'parentHeight', function() {
    var anchorSide = this.get('anchorSide');
    if(!anchorSide) {
      return 0;
    }
    return (anchorSide === "left" || anchorSide === "right") ? this.get('parentWidth') : this.get('parentHeight');
  }),

  anchorOffset: computed('sashWidth', 'splitPosition', 'anchorSide', 'parentSize', function() {
    var anchorSide = this.get('anchorSide');
    if(!anchorSide) {
      return;
    }

    var sashWidth = this.get('sashWidth');
    var splitPosition = this.get('splitPosition');
    if(anchorSide === "left" || anchorSide === "top") {
      return splitPosition + sashWidth / 2;
    } else {
      var parentSize = this.get('parentSize');
      if (!parentSize)
      {
        return 0;
      }
      return parentSize - splitPosition + sashWidth / 2;
    }
  }),

  updateChildSplitView: observer('childSplitView', 'anchorOffset', 'parentWidth', 'parentHeight', function() {

    // must run afterRender so that the size has updated
    Ember.run.scheduleOnce('afterRender', this, function() {
      var childSplitView = this.get('childSplitView');

      var element = this.$();
      if(childSplitView) {
        childSplitView.set('width', element.width());
        childSplitView.set('height', element.height());
      }
    });
  }),

  collapse: function() {
    if(this.get('anchorSide') === "left" || this.get('anchorSide') === "top") {
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
    var element = this.$();
    var cssInt = function(name) {
      return parseInt(this.css(name));
    }.bind(element);
    if(this.get('isVertical')) {
      return cssInt("min-width") + cssInt("padding-left") + cssInt("padding-right") + 
                                  cssInt("border-left")  + cssInt("border-right") + 
                                  cssInt("margin-left")  + cssInt("margin-right") +
                                  this.get('sashWidth') / 2;
    } else {
      return cssInt("min-height") + cssInt("padding-top") + cssInt("padding-bottom") +
                                    cssInt("border-top")  + cssInt("border-bottom") +
                                    cssInt("margin-top")  + cssInt("margin-bottom") +
                                    this.get('sashWidth') / 2;
    }
  })

});
