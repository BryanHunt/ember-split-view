export default Ember.View.extend({
  isVertical: null,
  containmentField: null,
  sashOffset: 0.5,

  didInsertElement: function(){
    this.$().css("line-height", "0px");

    this.setupChild(this.get('leftOrTop'));
    this.setupChild(this.get('rightOrBottom'));

    this.updateChildSizes();
  },

  setupChild: function(child) {
    child.$().css("display", "inline-block");
    child.$().css("position", "relative");
  },

  updateSashOffset: function() {
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
    var parentOffset = this.$().offset();
    var x1 = parentOffset.left + this.childMinLayoutWidth(this.get('leftOrTop'));
    var y1 = parentOffset.top + this.childMinLayoutHeight(this.get('leftOrTop'));

    var x2, y2;

    if(this.get('isVertical')) {
      x2 = parentOffset.left + this.$().width() - this.childMinLayoutWidth(this.get('rightOrBottom')) - this.get('sash.width');
      y2 = parentOffset.top + this.get('leftOrTop').$().height();
    } else {
      x2 = parentOffset.left + this.get('leftOrTop').$().width();
      y2 = parentOffset.top + this.$().height() - this.childMinLayoutHeight(this.get('rightOrBottom')) - this.get('sash.width');
    }

    this.set('containmentField', [x1, y1, x2, y2]);
  }.observes('isVertical'), // this should depend on sash.width, but that causes a render error

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
      leftOrTopSelector.width(Math.floor(parentWidth * this.get('sashOffset') - sashWidth / 2) - this.childTrimWidth(leftOrTop));
      rightOrBottomSelector.width(parentWidth - this.childLayoutWidth(leftOrTop) - sashWidth - this.childTrimWidth(rightOrBottom));
    } else {
      leftOrTopSelector.width(parentWidth - this.childTrimWidth(leftOrTop));
      rightOrBottomSelector.width(parentWidth - this.childTrimWidth(rightOrBottom));
    }
    
    if(leftOrTop instanceof this.constructor)
        leftOrTop.updateChildWidths();
      
    if(rightOrBottom instanceof this.constructor)
        rightOrBottom.updateChildWidths();
  },

  updateChildHeights: function() {
    var parentHeight = this.$().height();

    var leftOrTop = this.get('leftOrTop');
    var rightOrBottom = this.get('rightOrBottom');

    var leftOrTopSelector = leftOrTop.$();
    var rightOrBottomSelector = rightOrBottom.$();
      
    if(this.get('isVertical')) {
      leftOrTopSelector.height(parentHeight - this.childTrimHeight(leftOrTop));
      rightOrBottomSelector.height(parentHeight - this.childTrimHeight(rightOrBottom));
    } else {
      var sashHeight = this.get('sash.width');
      leftOrTopSelector.height(Math.floor(parentHeight * this.get('sashOffset') - sashHeight / 2) - this.childTrimHeight(leftOrTop));
      rightOrBottomSelector.height(parentHeight - this.childLayoutHeight(leftOrTop) - sashHeight - this.childTrimHeight(rightOrBottom));
    }
      
    if(leftOrTop instanceof this.constructor)
        leftOrTop.updateChildHeights();
      
    if(rightOrBottom instanceof this.constructor)
        rightOrBottom.updateChildHeights();
  },
  childLayoutWidth: function(child) {
    return child.$().width() + this.childTrimWidth(child);
  },
  
  childLayoutHeight: function(child) {
    return child.$().height() + this.childTrimHeight(child);
  },

  childMinLayoutWidth: function(child) {
    var childSelector = child.$();
    var leftMargin = parseInt(childSelector.css("margin-left"));
    var rightMargin = parseInt(childSelector.css("margin-right"));
    return parseInt(child.$().css('min-width')) + leftMargin + rightMargin;
  },
      
  childMinLayoutHeight: function(child) {
    var childSelector = child.$();
    var topMargin = parseInt(childSelector.css("margin-top"));
    var bottomMargin = parseInt(childSelector.css("margin-bottom"));
    return parseInt(child.$().css('min-height')) + topMargin + bottomMargin;
  },
  
  childTrimWidth: function(child) {
    return this.childLeftTrimWidth(child) + this.childRightTrimWidth(child);
  },

  childLeftTrimWidth: function(child) {
    var childSelector = child.$();
    var leftMargin = parseInt(childSelector.css("margin-left"));
    var leftBorderWidth = parseInt(childSelector.css("border-left-width"));
    var leftPadding = parseInt(childSelector.css("padding-left"));
    return leftMargin + leftBorderWidth + leftPadding;
  },
      
  childRightTrimWidth: function(child) {
    var childSelector = child.$();
    var rightPadding = parseInt(childSelector.css("padding-right"));
    var rightBorderWidth = parseInt(childSelector.css("border-right-width"));
    var rightMargin = parseInt(childSelector.css("margin-right"));
    return rightPadding + rightBorderWidth + rightMargin;
  },
      
  childTrimHeight: function(child) {
    return this.childTopTrimHeight(child) + this.childBottomTrimHeight(child);
  },

  childTopTrimHeight: function(child) {
    var childSelector = child.$();
    var topMargin = parseInt(childSelector.css("margin-top"));
    var topBorderWidth = parseInt(childSelector.css("border-top-width"));
    var topPadding = parseInt(childSelector.css("padding-top"));
    return topMargin + topBorderWidth + topPadding;
  },

  childBottomTrimHeight: function(child) {
    var childSelector = child.$();
    var bottomPadding = parseInt(childSelector.css("padding-bottom"));
    var bottomBorderWidth = parseInt(childSelector.css("border-bottom-width"));
    var bottomMargin = parseInt(childSelector.css("margin-bottom"));
    return bottomPadding + bottomBorderWidth + bottomMargin;
  },
});
