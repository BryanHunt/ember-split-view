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
 * ```html
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
 * ```html
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
export default Ember.View.extend({
  containmentField: null,

  /**
   * @property {boolean} isVertical - the orientation of the split: true = vertical, false = horizontal
   * @default true
   */
  isVertical: true,

  /**
   * @property {number} sashOffset - the offset of the sash - must be between 0 and 1
   * @default 0.5
   */
  sashOffset: 0.5,

  didInsertElement: function(){
    this.$().css("line-height", "0px");

    this.setupChild(this.get('leftOrTop'));
    this.setupChild(this.get('rightOrBottom'));

    this.updateChildSizes();
    this.updateMinWidthHeight();
  },

  setupChild: function(view) {
    view.$().css("display", "inline-block");
    view.$().css("position", "relative"); // Not really sure about this one
    view.$().css("line-height", "normal");
    view.$().css("vertical-align", "top");
  },

  updateChildSizes: function() {
    this.updateChildWidths();
    this.updateChildHeights();
  },

  updateSashOffset: function() {
    // When the user moves the sash, we need to re-calculate it's location
    // as a percentage relative to the left or top edge of the split view.
    // A value of 0 would mean the sash is at the far left or top edge, a
    // value of 1 would mean the sash is at the far right or bottom edge,
    // and a value of 0.5 would mean the sash is directly in the middle of
    // the split view.

    if(!this.get('sash.offset'))
      return;

    if(this.get('isVertical')) {
      this.set('sashOffset', (this.get('sash.offset').left + this.get('sash.width') / 2  - this.$().offset().left) / this.$().width());
      this.updateChildWidths();
    }
    else {
      this.set('sashOffset', (this.get('sash.offset').top + this.get('sash.width') / 2 - this.$().offset().top) / this.$().height());
      this.updateChildHeights();
    }
  }.observes('isVertical', 'sash.offset', 'sash.width'),

  updateContainmentField: function() {
    // The containmentField constrains how far you can move the sash
    // inside the split view.  It must take into account any settings of
    // min-width and min-height of the child views.

    var parentOffset = this.$().offset();
    var x1 = parentOffset.left + this.minLayoutWidth(this.get('leftOrTop'));
    var y1 = parentOffset.top + this.minLayoutHeight(this.get('leftOrTop'));

    var x2, y2;

    if(this.get('isVertical')) {
      x2 = parentOffset.left + this.$().width() - this.minLayoutWidth(this.get('rightOrBottom')) - this.get('sash.width');
      y2 = parentOffset.top + this.get('leftOrTop').$().height();
    } else {
      x2 = parentOffset.left + this.get('leftOrTop').$().width();
      y2 = parentOffset.top + this.$().height() - this.minLayoutHeight(this.get('rightOrBottom')) - this.get('sash.width');
    }

    this.set('containmentField', [x1, y1, x2, y2]);
  }.observes('isVertical'), // this should depend on sash.width, but that causes a render error

  updateMinWidthHeight: function() {
    // Updating the split view min width and height is necessary when the split view
    // is a child view of another split view when building a composite split view.
    // The min width and height of the split view must be the max between the user
    // specified css settings of min-width and min-height compared to the calculated
    // min width and height of the enclosed children.  This calculation factors into
    // the calculation for the containment field when constraining the sash movement
    // on a composite.

    var ourMinWidth = parseInt(this.$().css("min-width"));
    var ourMinHeight = parseInt(this.$().css("min-height"));

    var childMinWidth = this.minLayoutWidth(this.get('leftOrTop')) + this.minLayoutWidth(this.get('rightOrBottom')) + this.get('sash.width');
    var childMinHeight = this.minLayoutHeight(this.get('leftOrTop')) + this.minLayoutHeight(this.get('rightOrBottom')) + this.get('sash.width');

    this.$().css("min-width", Math.max(ourMinWidth, childMinWidth));
    this.$().css("min-height", Math.max(ourMinHeight, childMinHeight));

    if(this.get('parentView') instanceof this.constructor) {
      this.get('parentView').updateMinWidthHeight();
      this.get('parentView').updateContainmentField();
    }
  },

  updateChildWidths: function() {
    // updateChildWidths is called when the sash is moved and its new position has
    // been updated.  This function resizes both children and recurses on the child
    // when a child is an instance of SplitView.  The layout is calculated by setting 
    // the width of the left or top child followed by the right or bottom child.

    // This is fine until you have a composite child view with a vertical split.
    // A special case must be handled which I'm calling overshoot.  If the sash offset of 
    // the child split is > 0.5, and the sash of the parent split is moved to be > 0.5, 
    // this child split view will layout the left view first and not have enough room
    // to layout the right view.  In this case, the left view must be adjusted based
    // on the right minimum width such that the combined width does not exceed the 
    // parent views width.  An overshoot is calculated and the left width is adjusted
    // accordingly.

    var parentWidth = this.$().width();
    
    var leftOrTop = this.get('leftOrTop');
    var rightOrBottom = this.get('rightOrBottom');

    var leftOrTopSelector = leftOrTop.$();
    var rightOrBottomSelector = rightOrBottom.$();

    if(this.get('isVertical')) {
      var sashWidth = this.get('sash.width');
      leftOrTopSelector.width(Math.floor(parentWidth * this.get('sashOffset') - sashWidth / 2) - this.trimWidth(leftOrTop));
      var overshoot = parentWidth - (this.layoutWidth(leftOrTop) + sashWidth + this.minLayoutWidth(rightOrBottom));
      
      if(overshoot < 0)
        leftOrTopSelector.width(leftOrTopSelector.width() + overshoot);

      rightOrBottomSelector.width(parentWidth - this.layoutWidth(leftOrTop) - sashWidth - this.trimWidth(rightOrBottom));
    } else {
      leftOrTopSelector.width(parentWidth - this.trimWidth(leftOrTop));
      rightOrBottomSelector.width(parentWidth - this.trimWidth(rightOrBottom));
    }
    
    // We must recurse on any children that are instances of SplitView

    if(leftOrTop instanceof this.constructor) {
      leftOrTop.updateChildWidths();
      leftOrTop.updateContainmentField();
    }
      
    if(rightOrBottom instanceof this.constructor) {
      rightOrBottom.updateChildWidths();
      rightOrBottom.updateContainmentField();
    }
  },

  updateChildHeights: function() {
    // updateChildWidths is called when the sash is moved and its new position has
    // been updated.  This function resizes both children and recurses on the child
    // when a child is an instance of SplitView.  The layout is calculated by setting 
    // the height of the left or top child followed by the right or bottom child.

    // This is fine until you have a composite child view with a horizontal split.
    // A special case must be handled which I'm calling overshoot.  If the sash offset of 
    // the child split is > 0.5, and the sash of the parent split is moved to be > 0.5, 
    // this child split view will layout the top view first and not have enough room
    // to layout the bottom view.  In this case, the top view must be adjusted based
    // on the bottom minimum height such that the combined height does not exceed the 
    // parent views height.  An overshoot is calculated and the top height is adjusted
    // accordingly.

    var parentHeight = this.$().height();

    var leftOrTop = this.get('leftOrTop');
    var rightOrBottom = this.get('rightOrBottom');

    var leftOrTopSelector = leftOrTop.$();
    var rightOrBottomSelector = rightOrBottom.$();
      
    if(this.get('isVertical')) {
      leftOrTopSelector.height(parentHeight - this.trimHeight(leftOrTop));
      rightOrBottomSelector.height(parentHeight - this.trimHeight(rightOrBottom));
    } else {
      var sashHeight = this.get('sash.width');
      leftOrTopSelector.height(Math.floor(parentHeight * this.get('sashOffset') - sashHeight / 2) - this.trimHeight(leftOrTop));
      var overshoot = parentHeight - (this.layoutHeight(leftOrTop) + sashHeight + this.minLayoutHeight(rightOrBottom));
      
      if(overshoot < 0)
        leftOrTopSelector.height(leftOrTopSelector.height() + overshoot);
      
      rightOrBottomSelector.height(parentHeight - this.layoutHeight(leftOrTop) - sashHeight - this.trimHeight(rightOrBottom));
    }
      
    // We must recurse on any children that are instances of SplitView

    if(leftOrTop instanceof this.constructor)
        leftOrTop.updateChildHeights();
      
    if(rightOrBottom instanceof this.constructor)
        rightOrBottom.updateChildHeights();
  },

  layoutWidth: function(view) {
    // layoutWidth is the total width a view occupies on the screen
    // this includes padding, border, and margin

    return view.$().width() + this.trimWidth(view);
  },
  
  layoutHeight: function(view) {
    // layoutHeight is the total height a view occupies on the screen
    // this includes padding, border, and margin
  
    return view.$().height() + this.trimHeight(view);
  },

  minLayoutWidth: function(view) {
    // CSS min-width includes the padding and border, but not the margin

    var selector = view.$();
    var leftMargin = parseInt(selector.css("margin-left"));
    var rightMargin = parseInt(selector.css("margin-right"));
    return parseInt(view.$().css('min-width')) + leftMargin + rightMargin;
  },
      
  minLayoutHeight: function(view) {
    // CSS min-height includes the padding and border, but not the margin

    var selector = view.$();
    var topMargin = parseInt(selector.css("margin-top"));
    var bottomMargin = parseInt(selector.css("margin-bottom"));
    return parseInt(view.$().css('min-height')) + topMargin + bottomMargin;
  },
  
  trimWidth: function(view) {
    return this.leftTrimWidth(view) + this.rightTrimWidth(view);
  },

  leftTrimWidth: function(view) {
    var selector = view.$();
    var leftMargin = parseInt(selector.css("margin-left"));
    var leftBorderWidth = parseInt(selector.css("border-left-width"));
    var leftPadding = parseInt(selector.css("padding-left"));
    return leftMargin + leftBorderWidth + leftPadding;
  },
      
  rightTrimWidth: function(view) {
    var selector = view.$();
    var rightPadding = parseInt(selector.css("padding-right"));
    var rightBorderWidth = parseInt(selector.css("border-right-width"));
    var rightMargin = parseInt(selector.css("margin-right"));
    return rightPadding + rightBorderWidth + rightMargin;
  },
      
  trimHeight: function(view) {
    return this.topTrimHeight(view) + this.bottomTrimHeight(view);
  },

  topTrimHeight: function(view) {
    var selector = view.$();
    var topMargin = parseInt(selector.css("margin-top"));
    var topBorderWidth = parseInt(selector.css("border-top-width"));
    var topPadding = parseInt(selector.css("padding-top"));
    return topMargin + topBorderWidth + topPadding;
  },

  bottomTrimHeight: function(view) {
    var selector = view.$();
    var bottomPadding = parseInt(selector.css("padding-bottom"));
    var bottomBorderWidth = parseInt(selector.css("border-bottom-width"));
    var bottomMargin = parseInt(selector.css("margin-bottom"));
    return bottomPadding + bottomBorderWidth + bottomMargin;
  },
});
