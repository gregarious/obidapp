$(function(){
	// quick alias
	var compileTpl = Scenable.helpers.compileTpl;
	var typeSettings = {
		places: {
			templates: {
				listfeed: compileTpl('#tpl-listfeed-place'),
				infobox: null
			},
			collection: new Scenable.models.Places()
		},
		events: {
			templates: {
				listfeed: compileTpl('#tpl-listfeed-event'),
				infobox: null
			},
			collection: new Scenable.models.Events()
		},
		specials: {
			templates: {
				listfeed: compileTpl('#tpl-listfeed-special'),
				infobox: null
			},
			collection: new Scenable.models.Specials()
		}
	};

	// temporary var -- will move this when developing map feed
	var mapTemplate = compileTpl('#tpl-mapfeed');

	var controller = Scenable.controllers.exploreController = (function() {
		// DOM elements in initial page skeleton
		var rootElement = $('#panel-explore');
		rootElement.hide();
		
		var headerEl = rootElement.find('#header-view');
		var contentEl = rootElement.find('#content-view');

		var views = {
			menu: new Scenable.views.MenuView({el: headerEl}),
			feeds: {
				list: null,
				map: null,
				activeLabel: null,
				toggleActive: function() {
					if (this.activeLabel === 'list') this.activeLabel = 'map';
					else if (this.activeLabel === 'map') this.activeLabel = 'list';
					return this.activeLabel;
				},
				setActive: function(mode) {
					this.activeLabel = mode;
				},
				getActiveLabel: function() {
					return this.activeLabel;
				},
				getActiveView: function() {
					return this[this.activeLabel];
				}
			}
		};

		var contentState = {
			resourceType: null,
			collection: null,
			awaitingData: null,
			valid: false,
			// returns True the resource type is changed
			update: function(resourceType) {
				var changed = (this.resourceType !== resourceType);
				var settings = typeSettings[resourceType];
				this.resourceType = resourceType;
				if (settings) {
					this.collection = settings.collection;
				}
				else {
					this.collection = null;
				}
				this.valid = !!this.collection;	// a bit hacky, but does exactly what we want
				return changed;
			}
		};

		// sets the current feed collection and creates views to display it
		// returns false if content is unchanged, true otherwise
		var setContent = function(resourceType) {
			console.log('- controller.setContent: ' + resourceType);
			// no work to be done here, just return
			var changed = contentState.update(resourceType);
			if(!changed) {
				console.log('(unchanged content)');
				return false;
			}

			if (!contentState.valid) {
				console.log('Warning: Unknown type arg "' + resourceType +
					'" for ExploreController to act on.');
				contentState.awaitingData = null;
				return true;
			}

			// create both feed views (and remove any handlers from old ones if they exist)
			if (views.feeds.list) {
				views.feeds.list.off();
			}
			views.feeds.list = new Scenable.views.ListFeedView({
				collection: contentState.collection,
				template: typeSettings[resourceType].templates.listfeed
			});

			if (views.feeds.map) {
				views.feeds.map.off();
			}
			views.feeds.map = new Scenable.views.MapFeedView({
				collection: contentState.collection,
				template: mapTemplate
				//infoTemplate: typeSettings[resourceType].templates.infobox
			});

			// temp debug
			contentState.collection.categories = [
				{label: 'Cat 1', value: 'cat1'},
				{label: 'Cat 2', value: 'cat2'},
				{label: 'Cat 3', value: 'cat3'},
				{label: 'Cat 4', value: 'cat4'}
			];

			// we're going to fetch the collection now
			contentState.awaitingData = $.Deferred();

			// we wrap this up in a closure so the current instance of awaitingData is
			// used inside the callbacks
			(function(awaitingData) {
				contentState.collection.fetch({
					success: function(collection, response) {
						awaitingData.resolve();
					},
					error: function(collection, response) {
						awaitingData.reject();
					},
					timeout: 2000
				});
			})(contentState.awaitingData);

			views.menu.setActiveNav(resourceType);
			return true;
		};

		// returns true if display mode is changed
		var setDisplayMode = function(mode) {
			console.log('- controller.setDisplayMode: ' + mode);
			if (mode === views.feeds.activeLabel) {
				return false;
			}
			else {
				views.feeds.setActive(mode);
				views.menu.setActiveDisplayMode(mode);
				return true;
			}
		};

		var runSearch = function(query) {
			console.log('- ExploreController.runSearch | query: ' + query);
		};

		var runFilter = function(categories) {
			console.log('- ExploreController.runFilter | categories: ' + categories);
		};

		var showNextPage = function() {
			console.log('- ExploreController.showNextPage');
		};

		var showPrevPage = function() {
			console.log('- ExploreController.showPrevPage');
		};

		var itemClicked = function(itemId) {
			console.log('- ExploreController.itemClicked');
		};

		var refreshFeed = function() {
			console.log('- ExploreController.refreshFeed');
		};

		// Map-specific interface
		var mapMarkerClicked = function() {
			console.log('- ExploreController.mapMarkerClicked');
		};

		var mapFocusChange = function(x, y, width, height) {
			console.log('- ExploreController.mapFocusChange');
		};

		var mapNextItem = function() {
			console.log('- ExploreController.mapNextItem');
		};

		var mapPrevItem = function() {
			console.log('- ExploreController.mapPrevItem');
		};

		var toggleDisplayMode = function() {
			console.log('- ExploreController.toggleDisplayMode');
			var newActive = views.feeds.toggleActive();
			if (!newActive) {
				console.log('Warning: display mode error.');
				return;
			}
			views.menu.setActiveDisplayMode(newActive);
			this.refreshDisplay();
		};

		var activateSearch = function() {
			console.log('- ExploreController.activateSearch');
			// var dialogEl = $('#search-form');
			
			// // shortcut using a fill Backbone view. unncessary for static dialog
			// dialogEl.on('click', '.ok-button', $.proxy(function(e){
			//	var input = dialogEl.find('[name="query"]');
			//	var query = input.val();
			//	input.val('');

			//	dialogEl.off('click', '.ok-button');
			//	dialogEl.dialog('close');
				
			//	runSearch(query);
			// }));

			// $.mobile.changePage(dialogEl);
		};

		var controller = {};

		controller.activate = function() {
			console.log('+ ExploreController.activate.');

			rootElement.show();

			// draw menu
			views.menu.render();

			// attach event handlers
			views.menu.on('click:displayMode', toggleDisplayMode, this);
			views.menu.on('click:searchOn', activateSearch, this);
		};

		controller.deactivate = function() {
			console.log('ExploreController.deactivate.');
			views.menu.off();
			rootElement.hide();
		};

		controller.setState = function(settings, render) {
			// render defaults to true
			render = _.isUndefined(render) ? true : render;

			console.log('+ ExploreController.setState: ' + settings.resourceType +
							',' + settings.displayMode);
			var changed = false;
			if (!_.isUndefined(settings.resourceType)) {
				changed |= setContent(settings.resourceType);
			}
			if (!_.isUndefined(settings.displayMode)) {
				changed |= setDisplayMode(settings.displayMode);
			}
			if (changed && render) {
				this.refreshDisplay();
			}
		};

		controller.refreshDisplay = function() {
			console.log('ExploreController.refreshDisplay');

			views.menu.render();

			// if awaitngData is null, we don't have data, and never got it
			if (contentState.awaitingData === null) {
				contentEl.html("No data to display.");
				console.log(contentState.awaitingData);
				return;
			}

			if (!views.feeds.getActiveView()) {
				console.log('Warning: invalid display mode');
				return;
			}

			// once data is retreived, we can display the active view
			contentState.awaitingData.then(
				function() {
					contentEl.html(views.feeds.getActiveView().render().el);
				},
				function() {
					contentEl.html("Error retreiving data.");
				}
			);
		};

		return controller;
	})();

	// add observer pattern pub capabilities
	_.extend(controller, Backbone.Events);
});