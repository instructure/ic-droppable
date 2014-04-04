module.exports = function(broccoli) {
  return require('broccoli-dist-es6-module')(broccoli.makeTree('lib'), {
    global: 'ic.Droppable',
    packageName: 'ic-droppable',
    main: 'main',
    shim: {
      'ember': 'Ember'
    }
  });
};

