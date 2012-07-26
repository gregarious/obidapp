$(function(){
	Scenable.controllers.ExploreController = (function() {
		// DOM elements in initial page skeleton
		var contentEl = $('#explore div:jqmData(role="content")');
		var categoryFormEl = $('#category-form');

		var currentViews = {
			contentView: null,
			categoryForm: null,
			type: null
		};

		var displayMode = 'list';

		/* Notes on awaitingData:
		*   Since the collection fetch callbacks below are responsible for updating
		*   the content DOM, and a user could request a new instance of this function
		*   before that callback returns, we need an object to be sent into the
		*   callbacks that knows whether we still want the display to occur. Acts
		*   as a super-simple Deferred object with only a pending status.
		*/
		var awaitingData = null;
		
		/* Private functions for Controller */

		var createCategoryForm = function(collection) {
			// create a new category form and hook up an event handler to it
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

		var createContentView = function(collection, itemTemplate) {
			if (displayMode === 'list') {
				return new Scenable.views.FeedView({
					collection: collection,
					tagName: 'ul',
					className: 'feed',
					attributes: {'data-role':'listview'},
					itemTemplate: itemTemplate
				});
			}
			else {
				return null;
			}
		};

		var setContent = function(resourceType) {
			var settings = Scenable.typeSettings[resourceType],
				collection = null,
				itemTemplate = null;

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
			itemTemplate = settings.templates.feeditem;

			// temp debug
			collection.categories = [
				{label: 'Cat 1', value: 'cat1'},
				{label: 'Cat 2', value: 'cat2'},
				{label: 'Cat 3', value: 'cat3'},
				{label: 'Cat 4', value: 'cat4'}
			];

			// now time to set up the two subviews according to the collection
			currentViews.contentView = createContentView(collection, itemTemplate);
			currentViews.categoryForm = createCategoryForm(collection);

			// create a new object in which we say we are interested
			awaitingData = {
				type: resourceType,
				pending: true
			};
			
			// Now fetch the collection asynchronously
			// we wrap this up in a closure so the current instance of awaitingData is
			// used inside the callbacks
			(function(awaitingData) {
				collection.fetch({
					success: function(collection, response) {
						if(awaitingData.pending) {
							contentEl.html(currentViews.contentView.render().el);
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
						}
					},
					timeout: 2000
				});
			})(awaitingData);
		};

		var controller = {};

		controller.act = function(args) {
			var resourceType = args.type;
			if (resourceType) {
				setContent(resourceType);
			}
			else {
				console.log('Warning: Unknown type arg "' + resourceType + '"for ExploreController to act on.');
			}
		};

		controller.activate = function() {
			console.log('ExploreController activated.');
			// no-op: jQM handles this during the page change
		};

		controller.deactivate = function() {
			console.log('ExploreController deactivated.');
			// no-op: jQM handles this during the page change
		};

		return controller;
	})();
});