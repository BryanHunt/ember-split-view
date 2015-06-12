import Ember from 'ember';

export default Ember.Controller.extend({
  tabs: Ember.A([
    Ember.Object.create({ title: "Vertical", content: 'vertical'}),
    Ember.Object.create({ title: "Horizontal", content: 'horizontal'}),
    Ember.Object.create({ title: "Vertical Composite", content: 'verticalComposite'}),
    Ember.Object.create({ title: "Horizontal Composite", content: 'horizontalComposite'}),
    Ember.Object.create({ title: "Composite", content: 'composite'}),
    Ember.Object.create({ title: "Collapsible Panes", content: 'collapsiblePanes'}),
  ])
});
