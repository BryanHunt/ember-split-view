# ember-split-view 
[![Build Status](https://travis-ci.org/BryanHunt/ember-split-view.svg?branch=master)](https://travis-ci.org/BryanHunt/ember-split-view)
================

See it in action: http://bryanhunt.github.io/#/split

There is a demo app in [tests/dummy](https://github.com/BryanHunt/ember-split-view/tree/master/tests/dummy).

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

If you are using ember-cli, you can install as an addon.

```
npm install --save-dev ember-split-view
```

## Running

### Examples
Vertical SplitView example:

```
{{#split-view isVertical=true}}
  {{#split-child}}
    Content of the left view here.
  {{/split-child}}
  {{split-sash}}
  {{#split-child}}
    Content of the right view here.
  {{/split-child}}
{{/split-view}}
```

Horizontal SplitView example:

```
{{#split-view isVertical=false}}
  {{#split-child}}
    Content of the top view here.
  {{/split-child}}
  {{split-sash}}
  {{#split-child}}
    Content of the bottom view here.
  {{/split-child}}
{{/split-view}}
```

### Donating

All donations will support this project and keep the developer supplied with Reese's Minis.

[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.2.0/dist/gittip.png)](https://www.gittip.com/BryanHunt/)
* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
