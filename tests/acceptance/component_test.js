var App;

module('Acceptances - Component', {
  setup: function(){
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Home-Page check', function(){
  expect(2);

  visit('/Home-Page').then(function(){

  });
});

