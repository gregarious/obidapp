define(["explore/models", "explore/views"], function(models, views) {
	// factory constructor for feed controller objects
	// see "var controller" line for object interface
	// TODO: speed this up by creating a prototype to inherit from
	var createFeedController = function(CollectionClass, ListViewClass, MapViewClass) {
		var contentEl,
			
			collection,
			
			categoryFilter = null,
			query = null,

			displayMode = null;

		var viewManager = (function(){
			var active = null,
				stored = {
					map: null,
					list: null
				};
			
			return {
				store: function(label, view) {
					console.log('viewManager:storeActive. arguments follow.');
					console.log(arguments);
					stored[label] = view;
				},

				retrieve: function(label) {
					return stored[label];
				},
				
				setActive: function(viewOrLabel) {
					console.log('viewManager:setActive. argument follows.');
					console.log(viewOrLabel);
					active = viewOrLabel;
				},
				
				getActive: function() {
					return _.isString(active) ? stored[active] : active;
				},

				displayActive: function(el) {
					console.log('viewManager:displayActive. active view follows.');
					if (el) {
						var view = this.getActive();
						if (view) {
							console.log(view);
							el.html(view.render().el);
						}
						else { console.log('<!view>'); }
					}
					else { console.log('<!el>'); }
				}
			};
		})();

		var showLoader = function() {
			console.log('feedController.showLoader');
			viewManager.setActive(new views.LoadingView());
			viewManager.displayActive(contentEl);
		};

		var controller = {
			activate: function(el, mode) {
				console.log('feedController.activate' + arguments);
				contentEl = el;
				this.setActiveDisplayMode(mode);
			},

			deactivate: function() {
				console.log('feedController.deactivate');
				// ensures it won't draw to display after deactivation
				contentEl = null;
			},

			setActiveDisplayMode: function(mode) {
				console.log('feedController.setActiveDisplayMode ' + mode);
				displayMode = mode;
				viewManager.setActive(displayMode);
				viewManager.displayActive(contentEl);
			},

			showDefaultFeed: function() {
				console.log('feedController.showDefaultFeed');
				collection = new CollectionClass();
				this.updateViews();
			},

			showCategoryFiltered: function(categoryId) {
				collection = new CollectionClass({categoryId: categoryId});
				this.updateViews();
				console.log('- feedController.showCategoryFiltered: ' + categoryId);
			},

			showSearchFiltered: function(query) {
				collection = new CollectionClass({query: query});
				this.updateViews();
				console.log('- feedController.showSearchFiltered: ' + query);
			},

			showNextPage: function() {
				var opts = collection && collection.getNextPageOptions();
				if (opts !== null) {
					collection = new CollectionClass(opts);
					this.updateViews();
				}
				console.log('- feedController.showNextPage. opts to follow');
				console.log(opts);
			},

			showPrevPage: function() {
				var opts = collection && collection.getPrevPageOptions();
				if (opts !== null) {
					collection = new CollectionClass(opts);
					this.updateViews();
				}
				console.log('- feedController.showPrevPage. opts to follow');
				console.log(opts);
			},

			mapNextItem: function() {
				console.log('- feedController.mapNextItem');
			},

			mapPrevItem: function() {
				console.log('- feedController.mapPrevItem');
			},

			itemClicked: function(itemId) {
				console.log('- feedController.itemClicked');
			},

			// creates new feed views, binds the current collection to them, and fetches data from server
			updateViews: function() {
				console.log('feedController.updateViews');
				// display loader view while we wait. note this takes over the active display!
				showLoader();

				// create new views with the current collection (and unbind old ones, if they exist)
				var oldList = viewManager.retrieve('list');
				if (oldList) {
					oldList.off();
				}
				var listView = ListViewClass ? new ListViewClass({collection: collection}) : null;
				listView.on('page:prev', this.showPrevPage, this);
				listView.on('page:next', this.showNextPage, this);
				viewManager.store('list', listView);


				var oldMap = viewManager.retrieve('map');
				if (oldMap) {
					oldMap.off();
				}
				var mapView = MapViewClass ? new MapViewClass({collection: collection}) : null;
				viewManager.store('map', mapView);

				console.log('fetching!');
				// fetch from the server
				collection.fetch({
					// on failure, we manually set the current view to be an error
					error: function() {
						console.log('error!');
						var msg = 'Problem contacting server. Try again.';
						viewManager.setActive(new views.ErrorView({message: msg}));
					},

					// active view is correctly configured to show server result now
					complete: function() {
						console.log('complete!');
						viewManager.displayActive(contentEl);
					}
				});
				console.log('fetching off!');

				// set the active view to a feed one, fetch's complete callback will use it (assuming success)
				viewManager.setActive(displayMode);
			}
		};
		_.extend(controller, Backbone.Events);
		return controller;
	};
	
	var typeControllerMap = {
		places: createFeedController(models.Places, views.PlacesList, null),
		events: createFeedController(models.Events, views.EventsList, null),
		specials: createFeedController(models.Specials, views.SpecialsList, null),
		news: createFeedController(models.NewsArticles, views.NewsArticleList, null),
		now: null
	};

	var typeFilterViewMap = {
		places: new views.CategoryFilterView({collection: new models.PlaceCategories()}),
		events: new views.CategoryFilterView({collection: new models.EventCategories()}),
		specials: new views.CategoryFilterView({collection: new models.PlaceCategories()}),
		news: null,
		now: null
	};

	// TODO: turn this into some kind of actual CompositeView
	/* Notes on problems developing one of these off the cuff:
	* - regions are a great way to organize things
	* - feel strange injecting views directly in here, but not doing this puts a bit too much logic in the view
	* - how about interacting with some of the inner views, like getting events, changing settings? keeping a lot
	*		of this logic in the controller seems like it bloats the controller, but the alternative is to make
	*		the view very stateful
	*/
	var initializeContainer = function(el){
		var view = new (Backbone.View.extend({
			findRegion: function(regionLabel) {
				var selector = '[data-region="' + regionLabel + '"]';
				return this.$el.find(selector);
			}
		}))({el: el});
		// just create the skeleton with code
		view.$el.html(
			'<div data-region="menu" id="header-view"></div>' +
			'<div id="content-view">' +
			'	<div data-region="feed"></div>' +
			'	<div class="push"></div>' +
			'</div>' +
			'<div data-region="filter" class="sorting"></div>');
		return view;
	};

	var menuView = new views.MenuView();
	var contentController = null;
	var filterView = null;

	var activeContentType = null,
		activeDisplayMode = 'list';

	// sets the current feed collection and creates views to display it
	var setContentType = function(resourceType) {
		console.log('- controller.setContentType: ' + resourceType);
		// no work to be done here, just return
		if (resourceType === activeContentType) {
			console.log('(unchanged content)');
		}
		else {
			activeContentType = resourceType;

			if (contentController) {
				contentController.deactivate();
			}

			// switch to new controller
			contentController = typeControllerMap[resourceType];
			if (!contentController) {
				console.error('Warning: Unknown type arg "' + resourceType +
					'" for ExploreController to act on.');
				return;
			}

			var feedEl = containerView.findRegion('feed');
			contentController.activate(feedEl, activeDisplayMode);
			contentController.showDefaultFeed();

			// set the current nav icon
			menuView.setActiveNav(activeContentType);
			
			// now set the filter areas
			configureFilterView(typeFilterViewMap[resourceType]);
		}
	};

	var	configureFilterView = function(newView) {
		// tear down old view
		if (filterView) {
			filterView.off();
			filterView.collection.off();
		}

		var filterEl = containerView.findRegion('filter');
		if (!newView) {
			filterEl.empty();
			return false;
		}
			
		// when collection changes, render it
		newView.collection.on('reset', function() {
			filterEl.html(newView.render().el);
			// TODO: no idea why event binding in view (or delegation in general) doesn't work. hacking it here now.
			filterEl.find('select').on('change', function(e){
				newView.categorySelected(e);
			});
		});

		newView.collection.reset();	// will trigger event to clear select box
		newView.collection.fetch();	// will later trigger repopulation of select box
		newView.on('selected', function(id) {
			runFilter(id);
		});
		
		filterView = newView;
	};

	var setDisplayMode = function(mode) {
		console.log('- ExploreController.setDisplayMode: ' + mode);
		activeDisplayMode = mode;
		if (contentController) {
			contentController.setActiveDisplayMode(mode);
			menuView.setActiveDisplayMode(mode);
		}
	};

	// TODO: could conceivably link these handlers directly to feed controllers
	var runSearch = function(query) {
		if (contentController) {
			contentController.showSearchFiltered(query);
		}
		console.log('- ExploreController.runSearch | query: ' + query);
	};

	var runFilter = function(categoryId) {
		if (contentController) {
			if (categoryId < 1) {
				contentController.showDefaultFeed();
			}
			else {
				contentController.showCategoryFiltered(categoryId);
			}
		}
		console.log('- ExploreController.runFilter | categoryId: ' + categoryId);
	};

	var showNextPage = function() {
		if (contentController) {
			contentController.showNextPage();
		}
		console.log('- ExploreController.showNextPage');
	};

	var showPrevPage = function() {
		if (contentController) {
			contentController.showPrevPage();
		}
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
		if (activeDisplayMode === 'map') {
			this.setDisplayMode('list');
		}
		else if (activeDisplayMode === 'list') {
			this.setDisplayMode('map');
		}
		else {
			console.warn('Invalid activeDisplayMode: ' + activeDisplayMode);
		}
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

	var containerView = null,
		rootElement;

	var controller = {
		activate: function() {
			console.log('+ ExploreController.activate.');
			rootElement = $('#panel-explore');

			if (!containerView) {
				containerView = initializeContainer(rootElement);
			}

			rootElement.show();

			// draw menu
			menuView.render();

			// attach event handlers
			menuView.on('click:displayMode', toggleDisplayMode, this);
			menuView.on('click:searchOn', activateSearch, this);
		},

		deactivate: function() {
			console.log('ExploreController.deactivate.');
			menuView.off();
			rootElement.hide();
		},

		// called upon an explore tab clicked
		// settings can include resourceType and displayMode
		setState: function(settings, render) {
			// render defaults to true
			render = _.isUndefined(render) ? true : render;

			console.log('+ ExploreController.setState: ' + settings.resourceType +
							',' + settings.displayMode);
			var changed = false;
			if (!_.isUndefined(settings.resourceType)) {
				setContentType(settings.resourceType);
			}
			if (!_.isUndefined(settings.displayMode)) {
				setDisplayMode(settings.displayMode);
			}
			if (render) {
				this.refreshStaticRegions();
			}
		},

		refreshStaticRegions: function() {
			console.log('ExploreController.refreshDisplay');
			containerView.findRegion('menu').html(menuView.render().el);
		}
	};

	// add observer pattern pub capabilities
	_.extend(controller, Backbone.Events);

	return controller;
});