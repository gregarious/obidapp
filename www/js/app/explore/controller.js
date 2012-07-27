$(function(){
	Scenable.controllers.exploreController = (function() {
		// DOM elements in initial page skeleton
		var contentEl = $('#explore div:jqmData(role="content")');
		var categoryFormEl = $('#category-form');

		var currentViews = {
			contentView: null,
			categoryForm: null,
			type: null
		};

		var displayMode = 'map';

		/* Notes on awaitingData:
		*   Since the collection fetch callbacks below are responsible for updating
		*   the content DOM, and a user could request a new instance of this function
		*   before that callback returns, we need an object to be sent into the
		*   callbacks that knows whether we still want the display to occur. Acts
		*   as a super-simple Deferred object with only a pending status.
		*/
		var awaitingData = null;
		
		/* Private functions for Controller */

		// create a new category form and hook up an event handler to it
		var createCategoryForm = function(collection) {
			var catForm = new Scenable.views.CategoryForm({
				categories: collection.categories,
				template: Handlebars.compile($("#tpl-category-form").html())
			});
			categoryFormEl.html(catForm.render().el);
			categoryFormEl.trigger("create");
			catForm.on('submit', function(categories) {
				console.log('received categories:');
				console.log(categories);
				// TODO: pass in the categories to a collection filter
			});
			return catForm;
		};

		// create a new content view with the stored collection
		var createContentView = function(collection, listTemplate) {
			if (displayMode === 'list') {
				return new Scenable.views.ListFeedView({
					collection: collection,
					template: listTemplate
				});
			}
			else {
				return new Scenable.views.MapFeedView({
					collection: collection,
					template: Handlebars.compile($("#tpl-mapfeed").html())
				});
			}
		};

		var focusItem = null;	// currently just used to track which map icon is focused

		var controller = {};

		controller.activate = function() {
			console.log('ExploreController activated.');
			// no-op: jQM handles this during the page change
		};

		controller.deactivate = function() {
			console.log('ExploreController deactivated.');
			// no-op: jQM handles this during the page change
		};

		// big mother function that display content and hooks up event handlers
		controller.setContent = function(resourceType) {
			var settings = Scenable.typeSettings[resourceType],
				collection = null,
				itemTemplate = null;

			if (!settings) {
				console.log('Warning: Unknown type arg "' + resourceType +
					'"for ExploreController to act on.');
				return;
			}

			// tell the old awaitingData object that we're not interested anymore
			if(awaitingData) {
				awaitingData.pending = false;
			}

			// no work to be done here, just return
			if(resourceType === currentViews.type) {
				return;
			}
			currentViews.type = resourceType;

			// clear out the current view entries, including detatching event handlers
			if(currentViews.categoryForm) {
				currentViews.categoryForm.off();
			}
			currentViews.categoryForm = null;
			currentViews.contentView = null;

			// before doing the heavy lifting, show a loading message
			$.mobile.showPageLoadingMsg();

			// if no settings were found, the resource type isn't supported
			if(!settings) {
				contentEl.html("invalid resource type");
				$.mobile.hidePageLoadingMsg();
				return;
			}

			collection = settings.collection;
			listTemplate = settings.templates.listfeed;

			// temp debug
			collection.categories = [
				{label: 'Cat 1', value: 'cat1'},
				{label: 'Cat 2', value: 'cat2'},
				{label: 'Cat 3', value: 'cat3'},
				{label: 'Cat 4', value: 'cat4'}
			];

			// now time to set up the two subviews according to the collection
			currentViews.contentView = createContentView(collection, listTemplate);
			currentViews.categoryForm = createCategoryForm(collection);

			// create a new object in which we say we are interested
			awaitingData = {
				type: resourceType,
				pending: true
			};
			
			// Now fetch the collection asynchronously
			// we wrap this up in a closure so the current instance of awaitingData is
			// used inside the callbacks
			(function(awaitingData, self) {
				collection.fetch({
					success: function(collection, response) {
						if(awaitingData.pending) {
							contentEl.html(currentViews.contentView.render().el);
							if(currentViews.contentView.initMap) {
								currentViews.contentView.initMap();
							}
						}
					},
					error: function(collection, response) {
						if(awaitingData.pending) {
							contentEl.html("Error retreiving data.");
						}
					},
					complete: function() {
						if(awaitingData.pending) {
							$.mobile.hidePageLoadingMsg();
							contentEl.trigger("create");
							awaitingData.pending = false;	// this is kind of meaningless, but it wraps up the object's lifespan well
							self.trigger('ready');	// officially done processing request now
						}
					},
					timeout: 2000
				});
			})(awaitingData, this);
		};

		controller.setDisplayMode = function(mode) {
			console.log('controller.setDisplayMode');
		};

		controller.activateSearch = function() {
			console.log('controller.activateSearch');
		};

		controller.runSearch = function(query) {
			console.log('controller.runSearch');
		};

		controller.activateFilterForm = function() {
			console.log('controller.activateFilterForm');
		};

		controller.runFilter = function(filters) {
			console.log('controller.runFilter');
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
	_.extend(Scenable.controllers.exploreController, Backbone.Events);
});