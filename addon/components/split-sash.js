import Ember from 'ember';

var run = Ember.run;
var computed = Ember.computed;
var observer = Ember.observer;
var alias = computed.alias;

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

  classNames: ['sash'],
  classNameBindings: ['parent.isDragging:dragging', 'parent.isVertical:vertical:horizontal'],

  didInsertElement: function() {
    // run next to avoid changing the component during a render iteration
    var parent = this.get('parent');
    run.next(this, function() {
      if (parent)
      {
        this.set('parent.sash', this);
      }
      this._setStyle();
    });
  },

  _setStyle: function() {
    var width = this.get('width');
    var position = this.get('parent.splitPosition');
    var isVertical = this.get('parent.isVertical');

    var style = this.get('element').style;


    if(isVertical) {
      style.left = (position - width / 2) + 'px';
      style.top = null;
    } else {
      style.left = null;
      style.top = (position - width / 2) + 'px';
    }

    if(isVertical) {
      style.width = width + 'px';
      style.height = null;
    } else {
      style.width = null;
      style.height = width + 'px';
    }
  },

  style: observer('parent.splitPosition', 'parent.isVertical', 'width', function() {
    this._setStyle();
  }),

  mouseDown: function(event) {
    this.set('parent.isDragging', true);
    event.preventDefault();
  }
});
