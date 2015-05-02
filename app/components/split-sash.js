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
  splitPercentage: alias('parentView.splitPercentage'),

  didInsertElement: function() {
    this.set('parentView.sash', this);
    this.updateWidthPercentage();
  },

  style: Ember.computed('splitPercentage', 'widthPercentage', 'isVertical', 'width', function() {
    var s = "";

    if(this.get('isVertical')) {
      s += "left:" + (this.get('splitPercentage') - this.get('widthPercentage') / 2);
    } else {
      s += "top:" + (this.get('splitPercentage') - this.get('widthPercentage') / 2);
    }

    s += "%; ";

    if(this.get('isVertical')) {
      s += "width:" + this.get('width') + "px;";
    } else {
      s += "height:" + this.get('width') + "px;";
    }

    return htmlSafe(s);
   }),

  updateWidthPercentage: observer('isVertical', 'width', 'parentView.width', 'parentView.height', function() {
    if(this.get('isVertical')) {
      this.set('widthPercentage', this.get('width') / this.get('parentView.width') * 100);
    } else {
      this.set('widthPercentage', this.get('width') / this.get('parentView.height') * 100);
    }
  }),

  mouseDown: function(event) {
    this.set('isDragging', true);
    event.preventDefault();
  }
});
