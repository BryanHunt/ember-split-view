/**
 * This class represents a view that is split either vertically or horizontally.
 * The split view is composed of three child views: a left or top view, a sash
 * view, and a right or bottom view.  The sash may be dragged to change the
 * relative width or height of the child views.
 *
 * Vertical SplitView example:
 *
 * ```handlebars
 * {{#view "split" isVertical=true}}
 *   {{#view "span" viewName="leftOrTop"}}
 *     Content of the left view here.
 *   {{/view}}{{view "sash" viewName="sash"}}{{#view "span" viewName="rightOrBottom"}}
 *     Content of the right view here.
 *   {{/view}}
 * {{/view}}
 * ```
 *
 * Horizontal SplitView example:
 *
 * ```handlebars
 * {{#view "split" isVertical=false}}
 *   {{#view "span" viewName="leftOrTop"}}
 *     Content of the top view here.
 *   {{/view}}{{view "sash" viewName="sash"}}{{#view "span" viewName="rightOrBottom"}}
 *     Content of the bottom view here.
 *   {{/view}}
 * {{/view}}
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

    if(this.get('childViews').length === 2)
      this.updateOrientation();
  },

  updateOrientation: function() {
    var left = this.get('childViews').objectAt(0);
    var right = this.get('childViews').objectAt(1);

    if(this.get('isVertical')) {
      left.set('fixedSide', 'left');
      left.set('movableSide', 'right');
      right.set('fixedSide', 'right');
      right.set('movableSide', 'left');
    } else {
      left.set('fixedSide', 'top');
      left.set('movableSide', 'bottom');
      right.set('fixedSide', 'bottom');
      right.set('movableSide', 'top');
    }
  }.observes('isVertical'),

  updateWidth: function() {
    this.$().width(this.get('width'));
  }.observes('width'),

  updateHeight: function() {
    this.$().height(this.get('height'));
  }.observes('height'),

  constrainSplit: function() {
    var left = this.get('childViews').objectAt(0);
    var right = this.get('childViews').objectAt(1);

    if(left) {
      var minLeftPercentage = this.minChildPercentage(left);

      if(this.get('splitPercentage') < minLeftPercentage)
        this.set('splitPercentage', minLeftPercentage);
    }
    
    if (right) {
      var minRightPercentage = 100 - this.minChildPercentage(right);

      if(this.get('splitPercentage') > minRightPercentage)
        this.set('splitPercentage', minRightPercentage);
    } 
  }.observes('sash.widthPercentage'),

  mouseUp: function() {
    this.set('isDragging', false);
  },

  mouseMove: function(event) {
    if(!this.get('isDragging'))
      return;

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
    if(this.get('isVertical'))
      return parseInt(view.$().css("min-width")) / this.$().width() * 100 + this.get('sash.widthPercentage') / 2;
    else
      return parseInt(view.$().css("min-height")) / this.$().height() * 100 + this.get('sash.widthPercentage') / 2;
  },
});
