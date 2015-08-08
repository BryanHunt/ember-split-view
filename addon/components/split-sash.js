import Ember from 'ember';

var run = Ember.run;
var computed = Ember.computed;
var alias = computed.alias;
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
    var parent = this.get('parentView');
    run.next(this, function() {
      if (parent)
      {
        parent.set('sash', this);
      }
    });
  },

  style: computed('position', 'isVertical', 'width', function() {
    var s = "";

    var width = this.get('width');
    var position = this.get('position');
    var isVertical = this.get('isVertical');
    
    if(isVertical) {
      s += "left:" + (position - width / 2);
    } else {
      s += "top:" + (position - width/ 2);
    }

    s += "px; ";

    if(isVertical) {
      s += "width:" + width;
    } else {
      s += "height:" + width;
    }

    s += "px; ";

    return htmlSafe(s);
   }),

  mouseDown: function(event) {
    this.set('isDragging', true);
    event.preventDefault();
  }
});
