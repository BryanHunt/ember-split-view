import wait from 'ember-test-helpers/wait';

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('split-view', 'SplitViewComponent', {
  // specify the other units that are required for this test
  needs: []
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
  return wait();
});
