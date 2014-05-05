export default Ember.Route.extend({
	model: function(attribute){
		return ['red', 'yellow', 'blue'];
	}
});
