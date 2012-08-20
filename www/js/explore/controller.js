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
				},
				flags = {};
			
			return {
				setFlag: function(key, value) {
					flags[key] = value;
				},

				store: function(label, view) {
					stored[label] = view;
				},

				retrieve: function(label) {
					return stored[label];
				},
				
				setActive: function(viewOrLabel) {
					active = viewOrLabel;
				},
				
				getActive: function() {
					return _.isString(active) ? stored[active] : active;
				},

				displayActive: function(el) {
					if (el) {
						var view = this.getActive();
						if (view) {
							el.html(view.render().el);
						}
					}
				}
			};
		})();

		var showLoader = function() {
			viewManager.setActive(new views.LoadingView());
			viewManager.displayActive(contentEl);
		};

		var controller = {
			activate: function(el, mode) {
				contentEl = el;
				this.setActiveDisplayMode(mode);
			},

			deactivate: function() {
				// ensures it won't draw to display after deactivation
				contentEl = null;
			},

			setActiveDisplayMode: function(mode) {
				displayMode = mode;
				viewManager.setActive(displayMode);
				viewManager.displayActive(contentEl);
			},

			showDefaultFeed: function() {
				collection = new CollectionClass();
				this.updateViews();
			},

			showCategoryFiltered: function(categoryId) {
				collection = new CollectionClass({categoryId: categoryId});
				this.updateViews();
			},

			showSearchFiltered: function(query) {
				collection = new CollectionClass({query: query});
				this.updateViews();
			},

			showNextPage: function() {
				var opts = collection && collection.getNextPageOptions();
				if (opts !== null) {
					collection = new CollectionClass(opts);
					this.updateViews();
				}
			},

			showPrevPage: function() {
				var opts = collection && collection.getPrevPageOptions();
				if (opts !== null) {
					collection = new CollectionClass(opts);
					this.updateViews();
				}
			},

			mapNextItem: function() {
				//console.log('- feedController.mapNextItem');
			},

			mapPrevItem: function() {
				//console.log('- feedController.mapPrevItem');
			},

			itemClicked: function(itemId) {
				//console.log('- feedController.itemClicked');
			},

			// creates new feed views, binds the current collection to them, and fetches data from server
			updateViews: function() {
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

				// clear any old geolocation error notifications, and set it up to pass new ones in
				viewManager.setFlag('geolocationError', false);
				collection.off('geolocationError');
				collection.on('geolocationError', function() {
					viewManager.setFlag('geolocationError', true);
				});

				if (navigator.network) {	// will be false if not on phone
					var networkState = navigator.network.connection.type;
					if (networkState === Connection.NONE || networkState === Connection.UNKNOWN) {
						navigator.notification.alert('No internet connection found.', null, 'Connection Problem');
					}
				}

				// fetch from the server
				collection.fetch({
					// on failure, we manually set the current view to be an error
					error: function(collection, response) {
						var msg = 'Problem contacting server. Try again.';
						activeContentType = null;
						viewManager.setActive(new views.ErrorView({message: msg}));
					},

					// active view is correctly configured to show server result now
					complete: function() {
						viewManager.displayActive(contentEl);
					}
				});

				// set the active view to a feed one, fetch's complete callback will use it (assuming success)
				viewManager.setActive(displayMode);
			}
		};
		_.extend(controller, Backbone.Events);
		return controller;
	};
	
	// special case for now controller -- super simple
	var createNowController = function(AlertCollection, NowView) {
		var collection = null,
			nowView = null,
			contentEl = null;

		var controller = {
			activate: function(el) {
				contentEl = el;

				collection = new AlertCollection();
				nowView = new NowView({collection: collection});
			},

			deactivate: function() {
				// ensures it won't draw to display after deactivation
				contentEl = null;
				collection.off();
			},

			showDefaultFeed: function() {
				// TODO: not doing anything with alert collection yet. just rendering
				if (contentEl) {
					contentEl.html(nowView.render().el);
				}
				// collection.reset();	// triggers render so that at least outer skeleton gets rendered
				// collection.fetch();
				// collection.on('reset', // render to contentEl);
			}
		};
		return controller;
	};

	var typeControllerMap = {
		places: createFeedController(models.Places, views.PlacesList, null),
		events: createFeedController(models.Events, views.EventsList, null),
		specials: createFeedController(models.Specials, views.SpecialsList, null),
		news: createFeedController(models.NewsArticles, views.NewsArticleList, null),
		now: createNowController(Backbone.Collection, views.NowView)
	};

	var typeFilterViewMap = {
		places: new views.CategoryFilterView({
			defaultLabel: 'All Places',
			collection: new models.PlaceCategories()
		}),
		events: new views.CategoryFilterView({
			defaultLabel: 'All Events',
			collection: new models.EventCategories()
		}),
		specials: new views.CategoryFilterView({
			defaultLabel: 'All Specials',
			collection: new models.PlaceCategories()
		}),
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
			'</div>');
		return view;
	};

	var menuView = new views.MenuView();
	var contentController = null;
	var filterView = null;

	var activeContentType = null,
		activeDisplayMode = 'list';

	// sets the current feed collection and creates views to display it
	var setContentType = function(resourceType) {
		// do nothing if same resource type
		if (resourceType !== activeContentType) {
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
			contentController.activate();

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
			// TODO: this filterEl's entire DOM gets trashed due to some unnecessary menu overwriting. that shouldn't happen.
			var filterEl = containerView.findRegion('filter');
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
		activeDisplayMode = mode;
		menuView.setActiveDisplayMode(mode);
		if (contentController) {
			contentController.setActiveDisplayMode(mode);
		}
	};

	// TODO: could conceivably link these handlers directly to feed controllers
	var runSearch = function(query) {
		if (contentController) {
			contentController.showSearchFiltered(query);
		}
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
	};

	var showNextPage = function() {
		if (contentController) {
			contentController.showNextPage();
		}
	};

	var showPrevPage = function() {
		if (contentController) {
			contentController.showPrevPage();
		}
	};

	var itemClicked = function(itemId) {
		//console.log('- ExploreController.itemClicked');
	};

	var refreshFeed = function() {
		//console.log('- ExploreController.refreshFeed');
	};

	// Map-specific interface
	var mapMarkerClicked = function() {
		//console.log('- ExploreController.mapMarkerClicked');
	};

	var mapFocusChange = function(x, y, width, height) {
		//console.log('- ExploreController.mapFocusChange');
	};

	var mapNextItem = function() {
		//console.log('- ExploreController.mapNextItem');
	};

	var mapPrevItem = function() {
		//console.log('- ExploreController.mapPrevItem');
	};

	var toggleDisplayMode = function() {
		if (activeDisplayMode === 'map') {
			this.setState({displayMode: 'list'});
		}
		else if (activeDisplayMode === 'list') {
			this.setState({displayMode: 'map'});
		}
		else {
			console.warn('Invalid activeDisplayMode: ' + activeDisplayMode);
		}
	};

	var activateSearch = function() {
		//console.log('- ExploreController.activateSearch');
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
			rootElement = $('#panel-explore');

			if (!containerView) {
				containerView = initializeContainer(rootElement);
			}

			rootElement.show();

			// draw menu
			containerView.findRegion('menu').html(menuView.render().el);

			// attach event handlers
			menuView.on('click:displayMode', toggleDisplayMode, this);
			menuView.on('click:searchOn', activateSearch, this);
		},

		deactivate: function() {
			menuView.off('click:displayMode');
			menuView.off('click:displayMode');
			rootElement.hide();
		},

		// called upon an explore tab clicked
		// settings can include resourceType and displayMode
		setState: function(settings, render) {
			// render defaults to true
			render = _.isUndefined(render) ? true : render;

			var changed = false;
			if (!_.isUndefined(settings.resourceType)) {
				setContentType(settings.resourceType);
			}
			if (!_.isUndefined(settings.displayMode)) {
				setDisplayMode(settings.displayMode);
			}
			if (render) {
				menuView.render();
			}
		},

		refreshStaticRegions: function() {
			containerView.findRegion('menu').html(menuView.render().el);
		}
	};

	// add observer pattern pub capabilities
	_.extend(controller, Backbone.Events);

	return controller;
});