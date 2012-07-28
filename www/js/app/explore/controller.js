$(function(){
	// quick alias
	var compileTpl = Scenable.helpers.compileTpl;
	var templates = {
		place: {
			listfeed: compileTpl('#tpl-listfeed-place'),
			infobox: null
		},
		event: {
			listfeed: compileTpl('#tpl-listfeed-event'),
			infobox: null
		},
		special: {
			listfeed: compileTpl('#tpl-listfeed-special'),
			infobox: null
		},
		map: compileTpl('#tpl-mapfeed')
	};

	var controller = Scenable.controllers.exploreController = (function() {
		// DOM elements in initial page skeleton
		var contentEl = $('#explore div:jqmData(role="content")'),
			listIcon = $("#explore .icon-display-list"),
			mapIcon = $("#explore .icon-display-map");

		var viewState = {
			active: null,	// will be set to one of the below items
			map: {
				view: null,
				focusItem: null
			},
			list: {
				view: null
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

		/* Private functions for Controller */
		// create a new content view with the stored collection
		var createContentView = function() {
			var view;
			if (displayMode === 'list') {
				view = new Scenable.views.ListFeedView({
					collection: collection,
					template: listTemplate
				});
			}
			else {
				view = new Scenable.views.MapFeedView({
					collection: collection,
					template: Handlebars.compile($("#tpl-mapfeed").html())
				});
			}
			return view;
		};

		var controller = {};

		controller.activate = function() {
			console.log('ExploreController activated.');
			// look to the display to see what the current mode is
			if (listIcon.is(":visible")) {
				viewState.active = viewState.list;
			}
			else if (mapIcon.is(":visible")) {
				viewState.active = viewState.map;
			}
			else {
				viewState.active = null;
			}

			// jQM handles everything else
		};

		controller.deactivate = function() {
			console.log('ExploreController deactivated.');
			// no-op: jQM handles this during the page change
		};

		// big mother function that display content and hooks up event handlers
		controller.setContent = function(resourceType) {
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
			if (viewState.list.view) {
				viewState.list.view.off();
			}
			viewState.list.view = new Scenable.views.ListFeedView({
				collection: contentState.collection,
				template: templates[resourceType].listfeed
			});
			viewState.list.view.on('filterRequested', this.activateFilterForm, this);

			if (viewState.map.view) {
				viewState.map.view.off();
			}
			viewState.map.view = new Scenable.views.MapFeedView({
				collection: contentState.collection,
				template: templates.map
				//infoTemplate: templates[resourceType].infobox
			});
			viewState.map.view.on('filterRequested', this.activateFilterForm, this);

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
		};

		controller.displayData = function() {
			console.log('controller.displayData');
			// if awaitngData is null, we never got any data
			if (contentState.awaitingData === null) {
				contentEl.html("No data to display.");
				return;
			}

			if (!viewState.active) {
				console.log('Warning: invalid display mode');
			}

			// once data is retreived, we can display the active view
			contentState.awaitingData.then(
				function() {
					contentEl.html(viewState.active.view.render().el);
				},
				function() {
					contentEl.html("Error retreiving data.");
				}
			);
			
			contentState.awaitingData.always(function() {
				contentEl.trigger("create");
			});
		};

		controller.toggleDisplayMode = function() {
			if (viewState.active === viewState.list) {
				listIcon.hide();
				mapIcon.show();
				viewState.active = viewState.map;
			}
			else if (viewState.active === viewState.map) {
				mapIcon.hide();
				listIcon.show();
				viewState.active = viewState.list;
			}
			else {
				console.log('Warning: display mode error.');
			}
			this.displayData();
		},

		controller.activateSearch = function() {
			console.log('controller.activateSearch');
			var dialogEl = $('#search-form');
			
			// shortcut using a fill Backbone view. unncessary for static dialog
			dialogEl.on('click', '.ok-button', $.proxy(function(e){
				var input = dialogEl.find('[name="query"]');
				var query = input.val();
				input.val('');

				dialogEl.off('click', '.ok-button');
				dialogEl.dialog('close');
				
				this.runSearch(query);
			}, this));

			$.mobile.changePage(dialogEl);
		};

		controller.runSearch = function(query) {
			console.log('controller.runSearch | query: ' + query);
		};

		controller.activateFilterForm = function() {
			console.log('controller.activateFilterForm');
			var dialogEl = $('#category-form');
			var catForm = new Scenable.views.CategoryForm({
				categories: contentState.collection.categories
			});
			dialogEl.html(catForm.render().el);
			dialogEl.trigger("create");
			catForm.on('submit', function(categories) {
				catForm.off();
				dialogEl.dialog('close');
				this.runFilter(categories);
			}, this);
			// dialogEl should have data-role="dialog"
			$.mobile.changePage(dialogEl);
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

	// random DOM-binding as a consequence of header section being tied up in jQM
	$('#explore .icon-search').on('click',
		$.proxy(controller.activateSearch, controller));

	$('#explore .icon-display').on('click',
		$.proxy(controller.toggleDisplayMode, controller));

});