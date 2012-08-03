// create a paths alias for the templates dir
requirejs.config({
	paths: {
		'templates': '../../templates'
	}
});

requirejs(['explore/controller', 'detail/controller'], function(exploreCtrl, detailCtrl) {
	
	// global overrides for Backbone sync functions
	var jsonpSync = function(method, model, options) {
		var opts = options || {};
		opts.dataType = "jsonp";
		return Backbone.sync(method, model, opts);
	};

	Backbone.Model.prototype.sync = jsonpSync;
	Backbone.Collection.prototype.sync = jsonpSync;

	window.app = new (Backbone.Router.extend({
		states: {
			explore: exploreCtrl,
			detail: detailCtrl
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

	// after DOM load, initialze and run the app
	$(function(){
		// hide all DOM to begin with
		$('#panel-explore').hide();
		$('#panel-detail').hide();

		window.app.states.explore.setState({
			displayMode: 'list'
		}, false);

		// helper function to be used in template to encode resource uri's embedded in links
		// TODO: find better place for this?
		Handlebars.registerHelper('domainUri', function(string) {
			return Scenable.constants.SITEURL + string;
		});

		Backbone.history.start();
	});
});