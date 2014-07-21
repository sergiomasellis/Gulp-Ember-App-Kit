import Ember from 'ember';

var Router = Ember.Router.extend({
  location: AppkitENV.locationType
});

Router.map(function() {
  this.route('test');
});

export default Router;
