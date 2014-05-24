/**
 * This class represents a view that is split either vertically or horizontally.
 * The split view is composed of three child views: a left or top view, a sash
 * view, and a right or bottom view.  The sash may be dragged to change the
 * relative width or height of the child views.
 *
 * The SplitView expects the three child views to be named: leftOrTop, sash, and
 * rightOrBottom.  When you construct your template, you may not have any whitespace
 * between the child view declarations.  Adding whitespace causes the browser to
 * layout the elements with additional pixels between them and that throws off
 * all of the calculations needed to resize the children when the sash moves.
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
 * @cLass SplitView
 * @extends Ember.View
 */
export default Ember.Component.extend({
  /**
   * @property {boolean} isVertical - the orientation of the split: true = vertical, false = horizontal
   * @default true
   */
  isVertical: true,
  isDragging: false,

    
  sashWidth: 6,
  splitPercentage: 50,
  newSplitPercentage: 50,

  width: null,
  height: null,

  didInsertElement: function(){
    this.updateSashWidth();
    this.set('parentView.childSplitView', this);
  },

  setWidth: function(width) {
    this.$().width(width);

    if(this.get('isVertical')) {
      this.updateSashWidth();
      this.constrainSplit();
    }
  },

  setHeight: function(height) {
    this.$().height(height);

    if(!this.get('isVertical')) {
      this.updateSashWidth();
      this.constrainSplit();
    }
  },

  constrainSplit: function() {
    if(this.get('left') && this.get('splitPercentage') < this.minChildPercentage(this.get('left')))
      this.set('splitPercentage',this.minChildPercentage(this.get('left')));
    else if (this.get('right') && this.get('splitPercentage') > 100 - this.minChildPercentage(this.get('right')))
      this.set('splitPercentage', 100 - this.minChildPercentage(this.get('right')));
  },

  updateSashWidth: function() {
    if(this.get('isVertical'))
      this.set('sashWidthPercentage', this.get('sashWidth') / this.$().width() * 100);
    else
      this.set('sashWidthPercentage', this.get('sashWidth') / this.$().height() * 100);     
  }.observes('isVertical'),

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
      return parseInt(view.$().css("min-width")) / this.$().width() * 100 + this.get('sashWidthPercentage') / 2;
    else
      return parseInt(view.$().css("min-height")) / this.$().height() * 100 + this.get('sashWidthPercentage') / 2;
  },
});
