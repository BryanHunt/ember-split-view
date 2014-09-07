import Ember from 'ember';

/**
 * This view represents the divider between two views enclosed in a SplitView.
 * The sash can be dragged to change the size of one vew relative to the other 
 * on either side of the sash.  The sash can be either horizontal or vertical.
 * The parentView of the sash must be a SplitView
 *
 * @cLass SplitSashComponent
 * @extends Ember.View
 */
export default Ember.Component.extend({
  width: 6,
  widthPercentage: null,
  isVertical: Ember.computed.alias('parentView.isVertical'),
  isDragging: Ember.computed.alias('parentView.isDragging'),
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),  
  attributeBindings: ['style'],

  /**
   * @property {string} sashBackgroundColor - the color of the sash when dragging
   * @default black
   */
  sashBackgroundColor: "black",

    /**
   * @property {number} sashOpacity - the background opacity of the sash when dragging
   * @default 0.1
   */
  opacity: 0.1,

  didInsertElement: function() {
    this.set('parentView.sash', this);
    this.updateWidthPercentage();
  },

  style: function() {
    var s = "z-index:9999; position:absolute; opacity:" + this.get('opacity') + ";";

    if(this.get('isVertical')) {
      s += "left:" + (this.get('splitPercentage') - this.get('widthPercentage') / 2);
    } else {
      s += "top:" + (this.get('splitPercentage') - this.get('widthPercentage') / 2);
    }

    s += "%; ";

    if(this.get('isVertical')) {
      s += "width:" + this.get('width') + "px; height:100%; cursor:ew-resize;";
    } else {
      s += "width:100%;" + "height:" + this.get('width') + "px; cursor:ns-resize;";
    }

    if(this.get('isDragging')) {
      s += "background-color:" + this.get('sashBackgroundColor') + ";";
    } else {
      s += "background-color:transparent;";
    }

    return s;
   }.property('opacity', 'splitPercentage', 'widthPercentage', 'isVertical', 'width', 'isDragging'),

  updateWidthPercentage: function() {
    if(this.get('isVertical')) {
      this.set('widthPercentage', this.get('width') / this.get('parentView.width') * 100);
    } else {
      this.set('widthPercentage', this.get('width') / this.get('parentView.height') * 100);     
    }
  }.observes('isVertical', 'width', 'parentView.width', 'parentView.height'),

  mouseDown: function(event) {
    this.set('isDragging', true);
    event.preventDefault();
  }
});