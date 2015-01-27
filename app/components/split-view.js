import Ember from 'ember';
import SplitChild from './split-child';

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
   * @property {Number} splitPercentage - the percentage of the split between 0 and 100
   * @default 50
   */
  splitPercentage: 50,

  splits: null,
  isDragging: false,
  attributeBindings: ['style'],

  init: function() {
    this._super();
    this.set('splits', Ember.A());
  },

  didInsertElement: function() {
    this.set('parentView.childSplitView', this);
    var parentView = this.get('parentView');

    if(!(parentView instanceof SplitChild)) {
      this.set('width', this.$().width());
      this.set('height', this.$().height());      
    }
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

  style: function() {
    var s = "";

    if(this.get('width')){
      s += "width:" + this.get('width') + "px; ";
    }

    if(this.get('height')){
      s += "height:" + this.get('height') + "px; ";
    }

    return s;
  }.property('width', 'height'),

  updateOrientation: function() {
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
  }.observes('isVertical'),

  constrainSplit: function() {
    var leftOrTop = this.get('splits').objectAt(0);
    var rightOrBottom = this.get('splits').objectAt(1);

    if(leftOrTop) {
      var minLeftOrTopPercentage = this.minChildPercentage(leftOrTop);

      if(this.get('splitPercentage') < minLeftOrTopPercentage) {
        this.set('splitPercentage', minLeftOrTopPercentage);
      }
    }
    
    if (rightOrBottom) {
      var minRightOrBottomPercentage = 100 - this.minChildPercentage(rightOrBottom);

      if(this.get('splitPercentage') > minRightOrBottomPercentage) {
        this.set('splitPercentage', minRightOrBottomPercentage);
      }
    } 
  }.observes('sash.widthPercentage', 'width', 'height'),

  mouseUp: function() {
    this.set('isDragging', false);
  },

  mouseMove: function(event) {
    if(!this.get('isDragging')) {
      return;
    }

    var posInParent;
    var percentage;

    if(this.get('isVertical')) {
      posInParent = event.pageX - this.$().offset().left;
      percentage = posInParent / this.$().width() * 100;
    } else {
      posInParent = event.pageY - this.$().offset().top;
      percentage = posInParent / this.$().height() * 100;
    }

    this.set('splitPercentage', percentage);
    this.constrainSplit();
  },

  minChildPercentage: function(view) {
    var cssInt = function(name) {
      return parseInt(view.$().css(name));
    }
    if(this.get('isVertical')) {
      return (cssInt("min-width") + cssInt("padding-left") + cssInt("padding-right")
                                  + cssInt("border-left") + cssInt("border-right") 
                                  + cssInt("margin-left") + cssInt("margin-right")) / this.get('width') * 100 
              + this.get('sash.widthPercentage') / 2;
    } else {
      return (cssInt("min-height") + cssInt("padding-top") + cssInt("padding-bottom")
                                   + cssInt("border-top") + cssInt("border-bottom") 
                                   + cssInt("margin-top") + cssInt("margin-bottom")) / this.get('height') * 100 
             + this.get('sash.widthPercentage') / 2;
    }
  }
});
