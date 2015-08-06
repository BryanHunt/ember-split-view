import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;
var observer = Ember.observer;
var htmlSafe = Ember.String.htmlSafe;

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

  attributeBindings: ['style'],
  classNames: ['sash'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal'],

  isVertical: alias('parentView.isVertical'),
  isDragging: alias('parentView.isDragging'),
  position: alias('parentView.splitPosition'),

  didInsertElement: function() {
    // run next to avoid changing the component during a render iteration
    Ember.run.next(this, function() {
      this.set('parentView.sash', this);
    });
  },

  style: Ember.computed('position', 'isVertical', 'width', function() {
    var s = "";

    if(this.get('isVertical')) {
      s += "left:" + (this.get('position') - this.get('width') / 2);
    } else {
      s += "top:" + (this.get('position') - this.get('width') / 2);
    }

    s += "px; ";

    if(this.get('isVertical')) {
      s += "width:" + this.get('width');
    } else {
      s += "height:" + this.get('width');
    }

    s += "px; ";

    return htmlSafe(s);
   }),

  mouseDown: function(event) {
    this.set('isDragging', true);
    event.preventDefault();
  }
});
