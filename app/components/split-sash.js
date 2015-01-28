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
  classNames: ['sash'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal'],
  isVertical: Ember.computed.alias('parentView.isVertical'),
  isDragging: Ember.computed.alias('parentView.isDragging'),
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),  
  attributeBindings: ['style'],

  didInsertElement: function() {
    this.set('parentView.sash', this);
    this.updateWidthPercentage();
  },

  style: function() {
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

    return s;
   }.property('splitPercentage', 'widthPercentage', 'isVertical', 'width'),

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
