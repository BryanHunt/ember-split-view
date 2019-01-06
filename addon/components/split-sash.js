import Component from '@ember/component';
import { observer } from '@ember/object';
import { next } from '@ember/runloop'


/**
 * This view represents the divider between two views enclosed in a SplitView.
 * The sash can be dragged to change the size of one vew relative to the other
 * on either side of the sash.  The sash can be either horizontal or vertical.
 * The parentView of the sash must be a SplitView
 *
 * @cLass SplitSashComponent
 * @extends Ember.View
 */
export default Component.extend({
  width: 6,
  widthPercentage: null,

  classNames: ['split-view-sash'],
  classNameBindings: ['parent.isDragging:dragging', 'parent.isVertical:vertical:horizontal'],

  didInsertElement() {
    this._super();
    // run next to avoid changing the component during a render iteration
    const parent = this.get('parent');
    next(this, () => {
      if (parent) {
        this.set('parent.sash', this);
      }
      this._setStyle();
    });
  },

  _setStyle() {
    const width = this.get('width');
    const position = this.get('parent.splitPosition');
    const isVertical = this.get('parent.isVertical');

    const style = this.get('element').style;


    if (isVertical) {
      style.left = `${(position - width / 2)}px`;
      style.top = null;
    } else {
      style.left = null;
      style.top = `${(position - width / 2)}px`;
    }

    if (isVertical) {
      style.width = `${width}px`;
      style.height = null;
    } else {
      style.width = null;
      style.height = `${width}px`;
    }
  },

  style: observer('parent.splitPosition', 'parent.isVertical', 'width',
    function () {
      this._setStyle();
    }
  ),

  mouseDown(event) {
    this.set('parent.isDragging', true);
    event.preventDefault();
  },

});
