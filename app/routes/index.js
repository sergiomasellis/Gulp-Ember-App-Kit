export default Ember.Route.extend({
	model: function(attribute){
		return ["RED", "GREEN", "BLUE"];
	}
});