$(function(){
	var controller = Scenable.controllers.exploreController = (function() {
		// DOM elements in initial page skeleton
		var contentEl = $('#explore div:jqmData(role="content")');

		var currentViews = {
			contentView: null,
			type: null
		};

		// TODO: package this up with currentViews
		var collection = null;

		var displayMode = 'map';
		var focusItem = null;	// currently just used to track which map icon is focused

		/* Notes on awaitingData:
		*   Since the collection fetch callbacks below are responsible for updating
		*   the content DOM, and a user could request a new instance of this function
		*   before that callback returns, we need an object to be sent into the
		*   callbacks that knows whether we still want the display to occur. Acts
		*   as a super-simple Deferred object with only a pending status.
		*/
		var awaitingData = null;
		
		/* Private functions for Controller */

		// create a new content view with the stored collection
		var createContentView = function(collection, listTemplate) {
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
			// no-op: jQM handles this during the page change
		};

		controller.deactivate = function() {
			console.log('ExploreController deactivated.');
			// no-op: jQM handles this during the page change
		};

		// big mother function that display content and hooks up event handlers
		controller.setContent = function(resourceType) {
			var settings = Scenable.typeSettings[resourceType],
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
			if(currentViews.contentView) {
				currentViews.contentView.off();
				currentViews.contentView = null;
			}

			// before doing the heavy lifting, show a loading message
			$.mobile.showPageLoadingMsg();

			// if no settings were found, the resource type isn't supported
			if(!settings) {
				contentEl.html("invalid resource type");
				$.mobile.hidePageLoadingMsg();
				return;
			}

			this.collection = settings.collection;
			listTemplate = settings.templates.listfeed;

			// temp debug
			this.collection.categories = [
				{label: 'Cat 1', value: 'cat1'},
				{label: 'Cat 2', value: 'cat2'},
				{label: 'Cat 3', value: 'cat3'},
				{label: 'Cat 4', value: 'cat4'}
			];

			// now time to set up the two subviews according to the collection
			currentViews.contentView = createContentView(this.collection, listTemplate);
			currentViews.contentView.on('filterRequested', this.activateFilterForm, this);

			// create a new object in which we say we are interested
			awaitingData = {
				type: resourceType,
				pending: true
			};
			
			// Now fetch the collection asynchronously
			// we wrap this up in a closure so the current instance of awaitingData is
			// used inside the callbacks
			(function(awaitingData, self) {
				self.collection.fetch({
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
				categories: this.collection.categories
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
		$.proxy(controller.setDisplayMode, controller));

});