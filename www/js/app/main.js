// helper function to be used in template to encode resource uri's embedded in links
Handlebars.registerHelper('domainUri', function(string) {
	return Scenable.constants.SITEURL + string;
});

// Define controller after app load
// (note this isn't strictly necessary, but more complicated to maintain
//  otherwise. Keep this way unless we need performance gains.)
$(function(){
	Scenable.appController = new (Backbone.Router.extend({
		states: {
			explore: Scenable.controllers.exploreController,
			detail: Scenable.controllers.detailController
		},
		currentState: null,

		routes: {
			"": 'index',
			"app/:resource/:id": 'detailPage',
			"app/:resource": 'exploreFeed'
		},

		index: function() {
			this.navigate("app/now", {trigger: true});
		},

		pageTransition: function(toState) {
			if (this.currentState === toState) {
				return;
			}
			if (this.currentState) {
				this.currentState.deactivate();
			}
			this.currentState = toState;
			toState.activate();
			// no rules restricting transition

		},

		exploreFeed: function(resourceType) {
			console.log('+ appController.exploreFeed: ' + resourceType);
			this.pageTransition(this.states.explore);
			this.states.explore.setState({
				resourceType: resourceType
			});
		},

		detailPage: function(resourceType, objectId) {
			console.log('+ appController.detailPage: ' + resourceType + ',' + objectId);
			this.pageTransition(this.states.detail);
			this.states.detail.setState({
				resourceType: resourceType,
				objectId: objectId
			});
		}
	}))();

	Scenable.appController.states.explore.setState({
		displayMode: 'list'
	}, false);

	Backbone.history.start();
});