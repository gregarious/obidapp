/* Assumes jQuery, Underscore, and Backbone are defined. */
define(['explore/views'],
function(views) {
	// Set up app controller to manage application state (hands
	// off events, handles logic behind route switching, etc.)
	var appController = {};
	_.extend(appController, Backbone.Events);	// make it an event manager
	appController.on('all', function(eventName) {
		console.log('appController event: ' + eventName);
	});

	// Set up explore ViewModel with given el and event handler
	var exploreVM = new views.ExploreViewmodel(appController);

	// Module returns router object
	return Backbone.Router.extend({
		routes: {
			'': 'debugRoute'
		},

		debugRoute: function() {
			exploreVM.setFeedView({
				displayMode: 'list',
				contentType: 'places'
			});
			exploreVM.spawnView({el: $('#explore-panel')}).render().$el.show();
		}
	});
});