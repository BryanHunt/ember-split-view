import Ember from 'ember';

export default Ember.Controller.extend({
  tabsMeta: [
    Ember.Object.create({ title: "Vertical", linkTo: 'vertical'}),
    Ember.Object.create({ title: "Horizontal", linkTo: 'horizontal'}),
    Ember.Object.create({ title: "Vertical Composite", linkTo: 'verticalComposite'}),
    Ember.Object.create({ title: "Horizontal Composite", linkTo: 'horizontalComposite'}),
    Ember.Object.create({ title: "Composite", linkTo: 'composite'}),
  ]
});