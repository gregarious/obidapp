define(["explore/models", "explore/views"], function(models, views) {
	var typeSettings = {
		places: {
			ListView: views.PlacesList,
			collection: new models.Places()
		},
		events: {
			ListView: views.EventsList,
			collection: new models.Events()
		},
		specials: {
			ListView: views.SpecialsList,
			collection: new models.Specials()
		}
	};

	// TODO: turn this into some kind of CompositeView
	/* Notes on problems developing one of these off the cuff:
	* - regions are a great way to organize things
	* - feel strange injecting views directly in here, but not doing this puts a bit too much logic in the view
	* - how about interacting with some of the inner views, like getting events, changing settings? keeping a lot
	*		of this logic in the controller seems like it bloats the controller, but the alternative is to make
	*		the view very stateful
	*/

	var rootElement = $('#panel-explore');
	rootElement.hide();
	var containerView = new (Backbone.View.extend({
		findRegion: function(regionLabel) {
			var selector = '[data-region="' + regionLabel + '"]';
			return this.$el.find(selector);
		}
	}))({el: rootElement});

	containerView.$el.append('<div data-region="menu" id="header-view"></div>');
	containerView.$el.append('<div data-region="content"></div>');
	containerView.$el.append('<div data-region="filter"></div>');

	var subviews = {
		menu: new views.MenuView(),
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

		var settings = typeSettings[resourceType];
		if (!contentState.valid || !settings) {
			console.log('Warning: Unknown type arg "' + resourceType +
				'" for ExploreController to act on.');
			contentState.awaitingData = null;
			return true;
		}

		// create both feed views (and remove any handlers from old ones if they exist)
		if (subviews.feeds.list) {
			subviews.feeds.list.off();
		}
		subviews.feeds.list = new settings.ListView({
			collection: contentState.collection
		});

		if (subviews.feeds.map) {
			subviews.feeds.map.off();
		}
		subviews.feeds.map = new views.MapFeedView({
			collection: contentState.collection
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

		subviews.menu.setActiveNav(resourceType);
		return true;
	};

	// returns true if display mode is changed
	var setDisplayMode = function(mode) {
		console.log('- controller.setDisplayMode: ' + mode);
		if (mode === subviews.feeds.activeLabel) {
			return false;
		}
		else {
			subviews.feeds.setActive(mode);
			subviews.menu.setActiveDisplayMode(mode);
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
		var newActive = subviews.feeds.toggleActive();
		if (!newActive) {
			console.log('Warning: display mode error.');
			return;
		}
		subviews.menu.setActiveDisplayMode(newActive);
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

	var controller = {
		activate: function() {
			console.log('+ ExploreController.activate.');

			rootElement.show();

			// draw menu
			subviews.menu.render();

			// attach event handlers
			subviews.menu.on('click:displayMode', toggleDisplayMode, this);
			subviews.menu.on('click:searchOn', activateSearch, this);
		},

		deactivate: function() {
			console.log('ExploreController.deactivate.');
			subviews.menu.off();
			rootElement.hide();
		},

		setState: function(settings, render) {
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
		},

		refreshDisplay: function() {
			console.log('ExploreController.refreshDisplay');

			containerView.findRegion('menu').html(subviews.menu.render().el);

			var contentEl = containerView.findRegion('content');
			// if awaitngData is null, we don't have data, and never got it
			if (contentState.awaitingData === null) {
				contentEl.html("No data to display.");
				console.log(contentState.awaitingData);
				return;
			}

			if (!subviews.feeds.getActiveView()) {
				console.log('Warning: invalid display mode');
				return;
			}

			// once data is retreived, we can display the active view
			contentState.awaitingData.then(
				function() {
					contentEl.html(subviews.feeds.getActiveView().render().el);
				},
				function() {
					contentEl.html("Error retreiving data.");
				}
			);
		}
	};

	// add observer pattern pub capabilities
	_.extend(controller, Backbone.Events);

	return controller;
});