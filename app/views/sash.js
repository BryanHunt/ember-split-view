/**
 * This view represents the divider between two views enclosed in a SplitView.
 * The sash can be dragged to change the size of one vew relative to the other 
 * on either side of the sash.  The sash can be either horizontal or vertical.
 * The parentView of the sash must be a SplitView
 *
 * @cLass SashView
 * @extends Ember.View
 */
export default JQ.Draggable.extend({
  tagName: "span",
  offset: null,

  /**
   * @property {number} width - the width or height of the sash in pixels
   * @default 6
   */
  width: 6,

  /**
   * @property {string} backgroundColor - the color of the sash when dragging
   * @default black
   */
  backgroundColor: "black",

  /**
   * @property {number} opacity - the background opacity of the sash when dragging
   * @default 0.1
   */
  opacity: 0.1,

  didInsertElement: function() {
    this._super();
    this.$().css("z-index", "9999");
    this.$().css("display", "inline-block");
    this.$().css("offset", "relative");
    this.$().css("opacity", this.get('opacity'));
    this.updateAxis();
    this.updateOrientation();
    this.get('parentView').updateContainmentField();
  },

  updateAxis: function() {
    // axis is a property on JQ.Draggable that constrains the draggable
    // to the specified axis

    this.set('axis', this.get('parentView.isVertical') ? "x" : "y");
  }.observes('parentView.isVertical'),

  updateContainment: function() {
    // The containment box is calculated by the SplitView since it contains 
    // all of the components needed to do the calculation.

    this.set('containment', this.get('parentView.containmentField'));
  }.observes('parentView.containmentField').on('init'),

  updateOrientation: function() {
    if(this.get('parentView.isVertical')) {
      this.$().width(this.get('width') + "px");
      this.$().height("100%");
      this.$().css("cursor", "ew-resize");
    } else {
      this.$().width("100%");
      this.$().height(this.get('width') + "px");
      this.$().css("cursor", "ns-resize");
    }
  }.observes('parentView.isVertical'),

  jQueryUIStart: function(event) {
    this.$().css("background-color", this.get('backgroundColor'));
  },

  jQueryUIStop: function(event) {
    this.$().css("background-color", "transparent");
    this.set('offset', this.$().offset());

    // You must reset the left or top (depending on orientation)
    // of the sash to 0, or the layout is screwed big time
  
    if(this.get('parentView.isVertical'))
      this.$().css("left", 0);
    else
      this.$().css("top", 0);
  }
});