import Ember from 'ember';
import layout from 'ember-split-view/templates/components/split-child';

var computed = Ember.computed;
var alias = computed.alias;
var observer = Ember.observer;

export default Ember.Component.extend({
  layout: layout,
  classNames: ['child'],
  classNameBindings: ['parent.isDragging:dragging', 'parent.isVertical:vertical:horizontal', 'childSplitView:nested'],

  childSplitView: null,
  anchorSide: null,

  init: function() {
    this._super();

    Ember.run.schedule('afterRender', this, function() {
      this.set('register-as', this); // register-as is a new property
    });
  },

  didInsertElement: function() {
    var parent = this.get('parent');

    // run next to avoid changing the component during a render iteration
    Ember.run.next(this, function() {
      if(parent && parent.addSplit) {
        parent.addSplit(this);
      }
      this._setStyle();
    });
  },

  willDestroyElement: function() {
    var parent = this.get('parent');

    if(parent && parent.removeSplit) {
      parent.removeSplit(this);
    }
  },

  _setStyle: function() {
    var anchorSide = this.get('anchorSide');
    var l,r,t,b = null;
    if(anchorSide === 'left') {
      l = this.get('anchorOffset') + "px";
    }
    else if(anchorSide === 'right') {
      r = this.get('anchorOffset') + "px";
    }
    else if(anchorSide === 'top') {
      t = this.get('anchorOffset') + "px";
    }
    else if(anchorSide === 'bottom') {
      b = this.get('anchorOffset') + "px";
    }
    var style = this.get('element').style;
    style.left = l;
    style.right = r;
    style.top = t;
    style.bottom = b;
  },

  styleChanged: observer('anchorSide', 'anchorOffset', function() {
    this._setStyle();
  }),

  parentSize: computed('anchorSide', 'parent.width', 'parent.height', function() {
    var anchorSide = this.get('anchorSide');
    if(!anchorSide) {
      return 0;
    }
    return (anchorSide === "left" || anchorSide === "right") ? this.get('parent.width') : this.get('parent.height');
  }),

  anchorOffset: computed('parent.sash.width', 'parent.splitPosition', 'anchorSide', 'parentSize', function() {
    var anchorSide = this.get('anchorSide');
    if(!anchorSide) {
      return;
    }

    var sashWidth = this.get('parent.sash.width');
    var splitPosition = this.get('parent.splitPosition');
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

  updateChildSplitView: observer('childSplitView', 'anchorOffset', 'parent.width', 'parent.height', function() {

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
      this.set('parent.splitPosition', this.get('parentSize'));
    } else {
      this.set('parent.splitPosition', 0);
    }
    this.get('parent').constrainSplit();
  },

  minSize: computed('parent.isVertical', 'childSplitView.minSize', function() {
    var childSplitView = this.get('childSplitView');
    if (childSplitView)
    {
      return childSplitView.get('minSize');
    }

    var element = this.$();
    var cssInt = function(name) {
      return parseInt(this.css(name));
    }.bind(element);

    if(this.get('parent.isVertical')) {
      return cssInt("min-width") + cssInt("padding-left") + cssInt("padding-right") +
                                  cssInt("border-left")  + cssInt("border-right") +
                                  cssInt("margin-left")  + cssInt("margin-right") +
                                  this.get('parent.sash.width') / 2;
    } else {
      return cssInt("min-height") + cssInt("padding-top") + cssInt("padding-bottom") +
                                    cssInt("border-top")  + cssInt("border-bottom") +
                                    cssInt("margin-top")  + cssInt("margin-bottom") +
                                    this.get('parent.sash.width') / 2;
    }
  })

});
