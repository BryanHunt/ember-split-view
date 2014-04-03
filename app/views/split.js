export default Ember.View.extend({
  isVertical: null,
  containmentField: null,
  sahsPosition: 0.5,

  didInsertElement: function(){
    this.$().css("line-height", "0px");

    this.setupChild(this.get('leftOrTop'));
    this.setupChild(this.get('rightOrBottom'));

    this.updateChildSizes();
    this.updateMinWidthHeight();
  },

  setupChild: function(child) {
    child.$().css("display", "inline-block");
    child.$().css("position", "relative");
    child.$().css("line-height", "normal");
  },

  updateSahsPosition: function() {
    if(!this.get('sash.position'))
      return;

    if(this.get('isVertical')) {
      this.set('sahsPosition', (this.get('sash.position').left + this.get('sash.width') / 2  - this.$().position().left) / this.$().width());
      this.updateChildWidths();
    }
    else {
      this.set('sahsPosition', (this.get('sash.position').top + this.get('sash.width') / 2 - this.$().position().top) / this.$().height());
      this.updateChildHeights();
    }
  }.observes('isVertical', 'sash.position', 'sash.width'),

  updateContainmentField: function() {
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

  updateChildSizes: function() {
    this.updateChildWidths();
    this.updateChildHeights();
  },

  updateChildWidths: function() {
    var parentWidth = this.$().width();
    
    var leftOrTop = this.get('leftOrTop');
    var rightOrBottom = this.get('rightOrBottom');

    var leftOrTopSelector = leftOrTop.$();
    var rightOrBottomSelector = rightOrBottom.$();

    if(this.get('isVertical')) {
      var sashWidth = this.get('sash.width');
      leftOrTopSelector.width(Math.floor(parentWidth * this.get('sahsPosition') - sashWidth / 2) - this.trimWidth(leftOrTop));
      var overshoot = parentWidth - (this.layoutWidth(leftOrTop) + sashWidth + this.minLayoutWidth(rightOrBottom));
      
      if(overshoot < 0)
        leftOrTopSelector.width(leftOrTopSelector.width() + overshoot);

      rightOrBottomSelector.width(parentWidth - this.layoutWidth(leftOrTop) - sashWidth - this.trimWidth(rightOrBottom));
    } else {
      leftOrTopSelector.width(parentWidth - this.trimWidth(leftOrTop));
      rightOrBottomSelector.width(parentWidth - this.trimWidth(rightOrBottom));
    }
    
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
      leftOrTopSelector.height(Math.floor(parentHeight * this.get('sahsPosition') - sashHeight / 2) - this.trimHeight(leftOrTop));
      var overshoot = parentHeight - (this.layoutHeight(leftOrTop) + sashHeight + this.minLayoutHeight(rightOrBottom));
      
      if(overshoot < 0)
        leftOrTopSelector.height(leftOrTopSelector.height() + overshoot);
      
      rightOrBottomSelector.height(parentHeight - this.layoutHeight(leftOrTop) - sashHeight - this.trimHeight(rightOrBottom));
    }
      
    if(leftOrTop instanceof this.constructor)
        leftOrTop.updateChildHeights();
      
    if(rightOrBottom instanceof this.constructor)
        rightOrBottom.updateChildHeights();
  },

  layoutWidth: function(view) {
    return view.$().width() + this.trimWidth(view);
  },
  
  layoutHeight: function(view) {
    return view.$().height() + this.trimHeight(view);
  },

  minLayoutWidth: function(view) {
    var selector = view.$();
    var leftMargin = parseInt(selector.css("margin-left"));
    var rightMargin = parseInt(selector.css("margin-right"));
    return parseInt(view.$().css('min-width')) + leftMargin + rightMargin;
  },
      
  minLayoutHeight: function(view) {
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
      
  trimHeight: function(child) {
    return this.topTrimHeight(child) + this.bottomTrimHeight(child);
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
