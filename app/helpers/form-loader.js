export default Ember.Handlebars.makeBoundHelper(function(component, options) {
	return Ember.Handlebars.helpers.render.apply(this, arguments);
});