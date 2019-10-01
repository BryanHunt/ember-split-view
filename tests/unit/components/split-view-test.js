import { module, test } from 'qunit';

import { setupTest } from 'ember-qunit';

import { settled } from '@ember/test-helpers';

module('SplitViewComponent', function(hooks) {
  setupTest(hooks);

  test('it renders', function(assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.owner.factoryFor('component:split-view').create();
    assert.equal(component._state, 'preRender');

    this.render();

    assert.equal(component._state, 'inDOM');
    return settled();
  });
});
