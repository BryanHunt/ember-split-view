import Ember from 'ember';
import SplitChild from './split-child';

var computed = Ember.computed;
var observer = Ember.observer;
var htmlSafe = Ember.String.htmlSafe;

/**
 * This class represents a view that is split either vertically or horizontally.
 * The split view is composed of three child views: a left or top view, a sash
 * view, and a right or bottom view.  The sash may be dragged to change the
 * relative width or height of the child views.
 *
 * Vertical SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=true}}
 *   {{#split-child}}
 *     Content of the left view here.
 *   {{/split-child}}
 *   {{split-sash"}}
 *   {{#split-child}}
 *     Content of the right view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * Horizontal SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=false}}
 *   {{#split-child}}
 *     Content of the top view here.
 *   {{/split-child}}
 *   {{split-sash"}}
 *   {{#split-child}}
 *     Content of the bottom view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * @cLass SplitViewComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
   * @property {boolean} isVertical - the orientation of the split: true = vertical, false = horizontal
   * @default true
   */
  isVertical: true,

  /**
   * @property {Number} splitPosition - the position of the split in pixels
   * @default 50
   */
  splitPosition: 250,

  splits: null,
  isDragging: false,
  isRoot: false,
  attributeBindings: ['style'],
  classNames: ['split-view'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal'],

  init: function() {
    this._super();
    this.set('splits', Ember.A());

    this.get('resizeService').on('didResize', event => {
      this.didResize();
    });
  },

  didInsertElement: function() {
    this._super.apply(this, arguments);
    var parentView = this.get('parentView');

    var isRoot = !(parentView instanceof SplitChild);
    // run next to avoid changing the component during a render iteration
    Ember.run.next(this, function() {
      this.set('isRoot', isRoot);
      if(!isRoot) {
        parentView.set('childSplitView', this);
      }
    });
    Ember.run.scheduleOnce('afterRender', this, function() {
      // must do this in afterRender so that the parent has calculated its width and height
      if(isRoot) {
        this.set('width', this.$().width());
        this.set('height', this.$().height());
      }
    });
  },

  didResize: function() {
    this.set('width', this.$().width());
    this.set('height', this.$().height());
  },

  addSplit: function(split) {
    this.get('splits').addObject(split);

    if(this.get('splits').length === 2) {
      this.updateOrientation();
    }
  },

  removeSplit: function(split) {
    this.get('splits').removeObject(split);
  },

  style: computed('width', 'height', function() {
    var s = "";
    if (!this.get('isRoot'))
    {
      if(this.get('width')){
        s += "width:" + this.get('width') + "px; ";
      }

      if(this.get('height')){
        s += "height:" + this.get('height') + "px; ";
      }
    }

    return htmlSafe(s);
  }),

  updateOrientation: observer('isVertical', function() {
    var leftOrTop = this.get('splits').objectAt(0);
    var rightOrBottom = this.get('splits').objectAt(1);

    if(this.get('isVertical')) {
      leftOrTop.set('fixedSide', 'left');
      leftOrTop.set('movableSide', 'right');
      rightOrBottom.set('fixedSide', 'right');
      rightOrBottom.set('movableSide', 'left');
    } else {
      leftOrTop.set('fixedSide', 'top');
      leftOrTop.set('movableSide', 'bottom');
      rightOrBottom.set('fixedSide', 'bottom');
      rightOrBottom.set('movableSide', 'top');
    }
  }),

  constrainSplit: observer('sash.width', 'width', 'height', 'isVertical', function() {
    var leftOrTop = this.get('splits').objectAt(0);
    var rightOrBottom = this.get('splits').objectAt(1);

    if(leftOrTop) {
      var minLeftOrTopPosition = leftOrTop.get('minSize');

      if(this.get('splitPosition') < minLeftOrTopPosition) {
        this.set('splitPosition', minLeftOrTopPosition);
      }
    }

    var size = this.get('isVertical') ? this.get('width') : this.get('height');
    if (rightOrBottom) {
      var minRightOrBottomPosition = size - rightOrBottom.get('minSize');

      if(this.get('splitPosition') > minRightOrBottomPosition) {
        this.set('splitPosition', minRightOrBottomPosition);
      }
    }
  }),

  minSize: computed('splits.@each.minSize', 'sash.width', function() {
    var result = 0;
    var children = this.get('splits');
    for(var i=0; i < children.length; i++)
    {
      result += children[i].get('minSize');
    }
    result += (children.length-1) * this.get('sash.width');
    return result;
  }),

  mouseUp: function() {
    this.set('isDragging', false);
  },

  mouseLeave: function() {
    this.set('isDragging', false);
  },

  mouseMove: function(event) {
    if(!this.get('isDragging')) {
      return;
    }

    var position;

    if(this.get('isVertical')) {
      position = event.pageX - this.$().offset().left;
    } else {
      position = event.pageY - this.$().offset().top;
    }

    this.set('splitPosition', position);
    this.constrainSplit();
  }

});
