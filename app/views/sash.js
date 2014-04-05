/******************************************************************************
 * This view represents the divider between two views enclosed in a SplitView.
 * The sash can be dragged to change the size of one vew relative to the other 
 * on either side of the sash.  The sash can be either horizontal or vertical.
 *
 * Properties:
 *
 * backgroundColor: the color of the sash when dragging.  Defaults to black.
 *
 * opacity: the background opacity of the sash when dragging.  Defaults to 0.1
 ******************************************************************************/
export default JQ.Draggable.extend({
  tagName: "span",
  width: 6,
  offset: null,
  backgroundColor: "black",
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
    this.set('axis', this.get('parentView.isVertical') ? "x" : "y");
  }.observes('parentView.isVertical'),

  updateContainment: function() {
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

    // You must reset the left or top (depending on orientation) of the sash to 0, or the layout is screwed big time
    // The delta is calculated to be positive when moving right or down depending on oreintation

    if(this.get('parentView.isVertical'))
      this.$().css("left", 0);
    else
      this.$().css("top", 0);
  }
});