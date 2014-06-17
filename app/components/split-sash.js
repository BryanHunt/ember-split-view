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
    this.$().css("z-index", "9999");
    this.$().css("position", "absolute");
    this.$().css("opacity", this.get('opacity'));

    this.updateWidth();
    this.updatePosition();
    this.updateOrientation();
  },

  updatePosition: function() {
    if(this.get('isVertical'))
      this.$().css("left", (this.get('splitPercentage') - this.get('widthPercentage') / 2) + "%");
    else
      this.$().css("top", (this.get('splitPercentage') - this.get('widthPercentage') / 2) + "%");
  }.observes('splitPercentage', 'widthPercentage', 'isVertical'),

  updateWidth: function() {
    if(this.get('isVertical'))
      this.set('widthPercentage', this.get('width') / this.get('parentView.width') * 100);
    else
      this.set('widthPercentage', this.get('width') / this.get('parentView.height') * 100);     
  }.observes('isVertical', 'width', 'parentView.width', 'parentView.height'),

  updateOrientation: function() {
    if(this.get('isVertical')) {
      this.$().width(this.get('width') + "px");
      this.$().height("100%");
      this.$().css("cursor", "ew-resize");
    } else {
      this.$().width("100%");
      this.$().height(this.get('width') + "px");
      this.$().css("cursor", "ns-resize");
    }
  }.observes('isVertical', 'width'),

  updateBackground: function() {
    if(this.get('parentView.isDragging'))
      this.$().css("background-color", this.get('sashBackgroundColor'));
    else
      this.$().css("background-color", "transparent");
  }.observes('isDragging'),

  mouseDown: function(event) {
    this.set('isDragging', true);
    event.preventDefault();
  }
});