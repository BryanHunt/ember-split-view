import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import Ember from 'ember';

module('SplitChildComponent', function(hooks) {
  setupTest(hooks);

  test('it renders', function(assert) {
    assert.expect(2);

    // creates the component instance
    var component;
    var self = this;

    Ember.run(function(){
      component = self.subject();
    });

    assert.equal(component._state, 'preRender');

    // appends the component to the page
    this.render();
    
    assert.equal(component._state, 'inDOM');
  });
});
