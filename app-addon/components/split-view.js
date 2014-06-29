import Ember from 'ember';

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
 *     Content of the left view here.
 *   {{/split-child}}
 *   {{split-sash"}}
 *   {{#split-child}}
 *     Content of the right view here.
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

  childViews: null,
  isDragging: false,
  width: 0,
  height: 0,

  didInsertElement: function(){
    this.set('parentView.childSplitView', this);
    this.set('width', this.$().width());
    this.set('height', this.$().height());
    this.set('childViews', Ember.A());
  },

  addChildView: function(child) {
    this.get('childViews').addObject(child);

    if(this.get('childViews').length === 2) {
      this.updateOrientation();
    }
  },

  updateOrientation: function() {
    var leftOrTop = this.get('childViews').objectAt(0);
    var rightOrBottom = this.get('childViews').objectAt(1);

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

  updateWidth: function() {
    this.$().width(this.get('width'));
  }.observes('width'),

  updateHeight: function() {
    this.$().height(this.get('height'));
  }.observes('height'),

  constrainSplit: function() {
    var leftOrTop = this.get('childViews').objectAt(0);
    var rightOrBottom = this.get('childViews').objectAt(1);

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
  }.observes('sash.widthPercentage'),

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
    if(this.get('isVertical')) {
      return parseInt(view.$().css("min-width")) / this.$().width() * 100 + this.get('sash.widthPercentage') / 2;
    } else {
      return parseInt(view.$().css("min-height")) / this.$().height() * 100 + this.get('sash.widthPercentage') / 2;
    }
  }
});
