$(function(){
	// quick alias
	var compileTpl = Scenable.helpers.compileTpl;
	var templates = {
		places: {
			listfeed: compileTpl('#tpl-listfeed-place'),
			infobox: null
		},
		events: {
			listfeed: compileTpl('#tpl-listfeed-event'),
			infobox: null
		},
		specials: {
			listfeed: compileTpl('#tpl-listfeed-special'),
			infobox: null
		},
		map: compileTpl('#tpl-mapfeed')
	};

	var controller = Scenable.controllers.exploreController = (function() {
		// DOM elements in initial page skeleton
		var panelEl = $('#panel-explore');
		var headerEl = panelEl.find('#header-view');
		var contentEl = panelEl.find('#content-view');

		var views = {
			menu: new Scenable.views.MenuView({el: headerEl}),
			feeds: {
				list: null,
				map: null,
				activeView: null,
				toggleActive: function() {
					if (this.activeView === this.list) this.activeView = this.map;
					else if (this.activeView === this.map) this.activeView = this.list;
					return this.getActiveLabel();
				},
				setActive: function(mode) {
					this.activeView = this[mode] || null;
				},
				getActiveLabel: function() {
					if (this.activeView === this.list) {
						return 'list';
					}
					else if (this.activeView === this.map) {
						return 'map';
					}
					return null;
				},
				// sets view and maintains active one
				setViews: function(listView, mapView) {
					var active = this.getActiveLabel();
					this.list = listView;
					this.map = mapView;
					this.setActive(active);
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
				this.resourceType = resourceType;
				this.collection = Scenable.typeCollectionMap[resourceType];
				this.valid = !_.isUndefined(this.collection);
				return changed;
			}
		};

		var controller = {};

		controller.activate = function() {
			console.log('ExploreController activated.');

			// draw menu
			views.menu.render();

			// attach event handlers
			// TODO: make nav items href and router based?
			views.menu.on('click:navItem', function(label) {
				this.setContent(label);
				this.refreshDisplay();
			}, this);
			views.menu.on('click:displayMode', this.toggleDisplayMode, this);
			views.menu.on('click:searchOn', this.activateSearch, this);
		};

		controller.deactivate = function() {
			console.log('ExploreController deactivated.');
			views.menu.off();
		};

		// sets the current feed collection and creates views to display it
		controller.setContent = function(resourceType) {
			console.log('controller.setContent: ' + resourceType);
			// no work to be done here, just return
			var changed = contentState.update(resourceType);
			if(!changed) {
				return;
			}

			if (!contentState.valid) {
				console.log('Warning: Unknown type arg "' + resourceType +
					'" for ExploreController to act on.');
				contentState.awaitingData = null;
				return;
			}

			// create both feed views (and remove any handlers from old ones if they exist)
			if (views.feeds.list) {
				views.feeds.list.off();
			}
			var newList = new Scenable.views.ListFeedView({
				collection: contentState.collection,
				template: templates[resourceType].listfeed
			});
			newList.on('filterRequested', this.activateFilterForm, this);

			if (views.feeds.map) {
				views.feeds.map.off();
			}
			var newMap = new Scenable.views.MapFeedView({
				collection: contentState.collection,
				template: templates.map
				//infoTemplate: templates[resourceType].infobox
			});
			newMap.on('filterRequested', this.activateFilterForm, this);

			views.feeds.setViews(newList, newMap);

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
		};

		controller.setDisplayMode = function(mode) {
			console.log('controller.setDisplayMode');
			views.feeds.setActive(mode);
			views.menu.setActiveDisplayMode(mode);
		};

		controller.refreshDisplay = function() {
			console.log('controller.refreshDisplay');

			views.menu.render();

			// if awaitngData is null, we don't have data, and never got it
			if (contentState.awaitingData === null) {
				contentEl.html("No data to display.");
				return;
			}

			if (!views.feeds.activeView) {
				console.log('Warning: invalid display mode');
			}

			// once data is retreived, we can display the active view
			contentState.awaitingData.then(
				function() {
					contentEl.html(views.feeds.activeView.render().el);
				},
				function() {
					contentEl.html("Error retreiving data.");
				}
			);
		};

		controller.toggleDisplayMode = function() {
			var newActive = views.feeds.toggleActive();
			if (!newActive) {
				console.log('Warning: display mode error.');
				return;
			}
			views.menu.setActiveDisplayMode(newActive);
			this.refreshDisplay();
		};

		controller.activateSearch = function() {
			console.log('controller.activateSearch');
			// var dialogEl = $('#search-form');
			
			// // shortcut using a fill Backbone view. unncessary for static dialog
			// dialogEl.on('click', '.ok-button', $.proxy(function(e){
			//	var input = dialogEl.find('[name="query"]');
			//	var query = input.val();
			//	input.val('');

			//	dialogEl.off('click', '.ok-button');
			//	dialogEl.dialog('close');
				
			//	this.runSearch(query);
			// }, this));

			// $.mobile.changePage(dialogEl);
		};

		controller.runSearch = function(query) {
			console.log('controller.runSearch | query: ' + query);
		};

		controller.activateFilterForm = function() {
			console.log('controller.activateFilterForm');
			// var dialogEl = $('#category-form');
			// var catForm = new Scenable.views.CategoryForm({
			//	categories: contentState.collection.categories
			// });
			// dialogEl.html(catForm.render().el);
			// dialogEl.trigger("create");
			// catForm.on('submit', function(categories) {
			//	catForm.off();
			//	dialogEl.dialog('close');
			//	this.runFilter(categories);
			// }, this);
			// // dialogEl should have data-role="dialog"
			// $.mobile.changePage(dialogEl);
		};

		controller.runFilter = function(categories) {
			console.log('controller.runFilter | categories: ' + categories);
		};

		controller.showNextPage = function() {
			console.log('controller.showNextPage');
		};

		controller.showPrevPage = function() {
			console.log('controller.showPrevPage');
		};

		controller.itemClicked = function(itemId) {
			console.log('controller.itemClicked');
		};

		controller.refreshFeed = function() {
			console.log('controller.refreshFeed');
		};

		// Map-specific interface
		controller.mapMarkerClicked = function() {
			console.log('controller.mapMarkerClicked');
		};

		controller.mapFocusChange = function(x, y, width, height) {
			console.log('controller.mapFocusChange');
		};

		controller.mapNextItem = function() {
			console.log('controller.mapNextItem');
		};

		controller.mapPrevItem = function() {
			console.log('controller.mapPrevItem');
		};

		return controller;
	})();

	// add observer pattern pub capabilities
	_.extend(controller, Backbone.Events);
});