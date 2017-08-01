import Ember from 'ember';
import splitChildLayout from 'ember-split-view/templates/components/split-child';

const { computed, observer } = Ember;

export default Ember.Component.extend({
  layout: splitChildLayout,
  classNames: ['split-view-child'],
  classNameBindings: [
    'parent.isDragging:dragging',
    'parent.isVertical:vertical:horizontal',
    'childSplitView:nested'
  ],

  childSplitView: null,
  anchorSide: null,

  init() {
    this._super();

    Ember.run.schedule('afterRender', this, () => {
      this.set('register-as', this); // register-as is a new property
    });
  },

  didInsertElement() {
    const parent = this.get('parent');

    // run next to avoid changing the component during a render iteration
    Ember.run.next(this, () => {
      if (parent && parent.addSplit) {
        parent.addSplit(this);
      }
      this._setStyle();
    });
  },

  willDestroyElement() {
    const parent = this.get('parent');

    if (parent && parent.removeSplit) {
      parent.removeSplit(this);
    }
  },

  _setStyle() {
    const anchorSide = this.get('anchorSide');
    let l = null;
    let r = null;
    let t = null;
    let b = null;
    if (anchorSide === 'left') {
      l = `${this.get('anchorOffset')}px`;
    } else if (anchorSide === 'right') {
      r = `${this.get('anchorOffset')}px`;
    } else if (anchorSide === 'top') {
      t = `${this.get('anchorOffset')}px`;
    } else if (anchorSide === 'bottom') {
      b = `${this.get('anchorOffset')}px`;
    }
    const style = this.get('element').style;
    style.left = l;
    style.right = r;
    style.top = t;
    style.bottom = b;
  },

  styleChanged: observer('anchorSide', 'anchorOffset',
    function () {
      this._setStyle();
    }
  ),

  parentSize: computed('anchorSide', 'parent.width', 'parent.height',
    function () {
      const anchorSide = this.get('anchorSide');
      if (!anchorSide) {
        return 0;
      }

      if (anchorSide === 'left' || anchorSide === 'right') {
        return this.get('parent.width');
      }

      return this.get('parent.height');
    }
  ),

  anchorOffset: computed('parent.sash.width', 'parent.splitPosition', 'anchorSide', 'parentSize',
    function () {
      const anchorSide = this.get('anchorSide');

      if (!anchorSide) {
        return undefined;
      }

      const sashWidth = this.get('parent.sash.width');
      const splitPosition = this.get('parent.splitPosition');

      if (anchorSide === 'left' || anchorSide === 'top') {
        return splitPosition + sashWidth / 2;
      }

      const parentSize = this.get('parentSize');
      if (!parentSize) {
        return 0;
      }
      return parentSize - splitPosition + sashWidth / 2;
    }
  ),

  updateChildSplitView: observer('childSplitView', 'anchorOffset', 'parent.width', 'parent.height',
    function () {
      // must run afterRender so that the size has updated
      Ember.run.scheduleOnce('afterRender', this, () => {
        const childSplitView = this.get('childSplitView');

        const element = this.$();
        if (childSplitView) {
          childSplitView.set('width', element.width());
          childSplitView.set('height', element.height());
        }
      });
    }
  ),

  collapse() {
    if (this.get('anchorSide') === 'left' || this.get('anchorSide') === 'top') {
      this.set('parent.splitPosition', this.get('parentSize'));
    } else {
      this.set('parent.splitPosition', 0);
    }
    this.get('parent').constrainSplit();
  },

  cssInt(name) {
    return parseInt(this.$().css(name), 10) || 0;
  },

  minSizeVertical() {
    return this.cssInt('min-width') +
          this.cssInt('padding-left') +
          this.cssInt('padding-right') +
          this.cssInt('border-left') +
          this.cssInt('border-right') +
          this.cssInt('margin-left') +
          this.cssInt('margin-right') +
          this.get('parent.sash.width') / 2;
  },

  minSizeHorizontal() {
    return this.cssInt('min-height') +
          this.cssInt('padding-top') +
          this.cssInt('padding-bottom') +
          this.cssInt('border-top') +
          this.cssInt('border-bottom') +
          this.cssInt('margin-top') +
          this.cssInt('margin-bottom') +
          this.get('parent.sash.width') / 2;
  },


  minSize: computed('parent.isVertical', 'childSplitView.minSize',
    function () {
      const childSplitView = this.get('childSplitView');
      if (childSplitView) {
        return childSplitView.get('minSize');
      }


      if (this.get('parent.isVertical')) {
        return this.minSizeVertical();
      }

      return this.minSizeHorizontal();
    }
  )

});
