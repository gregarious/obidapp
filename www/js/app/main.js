$(function(){
	console.log("ready!");

	window.Scenable = {};

	/*** Backbone model/collection definitions **/
	var jsonpSync = function(method, model, options) {
		var opts = options || {};
		opts.dataType = "jsonp";
		return Backbone.sync(method, model, opts);
	};

	Backbone.Model.prototype.sync = jsonpSync;
	Backbone.Collection.prototype.sync = jsonpSync;

	var toTastyPieRootUrl = function(resourceType) {
		return 'http://127.0.0.1:8000/api/v1/' + resourceType + '/?format=jsonp';
	};

	/*** BACKBONE MODELS ***/
	var Place = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('place')
	});

	var Event = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('event')
	});

	var Special = Backbone.Model.extend({
		headerText: function() {
			return this.get('title');
		},
		urlRoot: toTastyPieRootUrl('special')
	});

	var Places = Backbone.Collection.extend({
		model: Place,
		urlRoot: toTastyPieRootUrl('place')
	});

	var Events = Backbone.Collection.extend({
		model: Event,
		urlRoot: toTastyPieRootUrl('event')
	});

	var Specials = Backbone.Collection.extend({
		model: Special,
		urlRoot: toTastyPieRootUrl('special')
	});


	/*** BACKBONE VIEWS ***/
	// expects el to have two subdivs, .content-status and .content-list
	var FeedView = Backbone.View.extend({
		initialize: function(options) {
			_.bindAll(this, 'render');
			this.itemTemplate = options.itemTemplate;
		},

		render: function() {
			this.$el.empty();
			if(this.collection) {
				this.collection.each(function(m) {
					this.$el.append(
						'<li>' +
							this.itemTemplate(m.attributes) +
						'</li>');
				}, this);
				this.$el.append('<hr/><a href="#category-form">Categories</a>');
			}
			return this;
		}
	});

	var CategoryForm = Backbone.View.extend({
		tagName: 'form',

		events: {
			'submit': 'submitted'
		},

		initialize: function(options) {
			this.template = options.template;
			this.categories = options.categories;

			// pass the DOM-based submit event along as a CategoryForm event
			this.$el.on('submit', $.proxy(function(e) {
				e.preventDefault();
				this.trigger('submit', e);
			}, this));

			_.bindAll(this, 'render', 'submitted');
		},

		render: function() {
			this.$el.html(this.template({'categories': this.categories}));
			return this;
		},

		// handles DOM submit event, triggers event that passes along object with {category: bool} entries
		submitted: function(e) {
			console.log('hahah');
			var inputs = $(e.target).serializeArray();
			
			// fill the categories array with the chosen names
			var categories = [];
			inputs = _.each(inputs, function(obj) {
				if(obj.name !== 'submit') {
					categories.push(obj.name);
				}
			});
			this.trigger('submit', categories);
			e.preventDefault();
		}
	});

	// Various configuration settings for the resource types
	var typeSettings = {
		place: {
			collection: new Places({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-place').html()),
				single: Handlebars.compile($('#tpl-single-place').html())
			}
		},
		event: {
			collection: new Events({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-event').html()),
				single: Handlebars.compile($('#tpl-single-event').html())
			}
		},
		special: {
			collection: new Specials({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-special').html()),
				single: Handlebars.compile($('#tpl-single-special').html())
			}
		}
		};


	var exploreController = (function() {
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
		
		var controller = {};
		controller.setContent = function(resourceType) {
			var settings = typeSettings[resourceType],
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

			
			$.mobile.showPageLoadingMsg();

			// clear out the current view entries, including detatching event handlers
			if(currentViews.categoryForm) {
				currentViews.categoryForm.off();
			}
			currentViews.categoryForm = null;
			currentViews.contentView = null;
			currentViews.type = resourceType;

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

			// First set up the content view: a FeedView based on the given collection
			currentViews.contentView = new FeedView({
				collection: collection,
				tagName: 'ul',
				className: 'feed',
				attributes: {'data-role':'listview'},
				itemTemplate: itemTemplate
			});

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

			// create a new category form and hook up an event handler to it
			var catForm = currentViews.categoryForm = new CategoryForm({
				categories: collection.categories,
				template: Handlebars.compile($("#tpl-category-form").html())
			});
			categoryFormEl.html(catForm.render().el);
			catForm.on('submit', function(categories) {
				console.log('received categories: ' + categories);
				// TODO: pass in the categories to a collection filter
			});
		};
		return controller;
	})();


	// helper function to be used in template to encode resource uri's embedded in links
	Handlebars.registerHelper('uriEncode', function(string) {
		return encodeURIComponent(string);
	});

	// returns an object with the properies "page" and "args", or null
	// this is a simple routine to stand in for router parsing
	var parseHash = function(url) {
		var match = /^\#(.+)\?(.*)/.exec(url.hash);
		if (match) {
			var page = match[1];
			var args = {};
			if (match[2]) {
				_.each(match[2].split("&"), function(clause){
					var submatch = /(.*)=(.*)/.exec(clause);
					if (submatch[1]) {
						args[submatch[1]] = submatch[2];
					}
				});
			}
			return {
				page: page,
				args: args
			};
		}
		else {
			return null;
		}
	};

	$(document).bind( "pagebeforechange", function(e, data) {
		if (typeof data.toPage === "string") {
			var route = parseHash($.mobile.path.parseUrl(data.toPage));
			if (route) {
				var resourceType = route.args['type'];
				if (route.page === 'explore') {
					exploreController.setContent(resourceType);
				}
				else if (route.page === 'single') {
					var tpl = typeSettings[resourceType].templates.single;

					id = decodeURIComponent(route.args['id']);
					var model = typeSettings[resourceType].collection.get(id);
					
					contentEl = $('#single .content');
					contentEl.html(tpl(model.attributes));
					contentEl.trigger("create");

					// also add the title change
					$('#single h1').text(model.headerText());
				}
			}
		}
	});
});