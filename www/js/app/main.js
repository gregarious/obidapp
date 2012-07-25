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

	/*** CONSTANTS/CACHED OBJECTS ***/
	var typeCollectionMap = {
		place: new Places({
			filters: {
				listed: true
			}
		}),
		event: new Events({
			filters: {
				listed: true
			}
		}),
		special: new Specials({
			filters: {
				listed: true
			}
		})
	};

	var typeTemplateMap = {
		place: {
			feeditem: Handlebars.compile($('#tpl-feeditem-place').html()),
			single: Handlebars.compile($('#tpl-single-place').html())
		},
		event: {
			feeditem: Handlebars.compile($('#tpl-feeditem-event').html()),
			single: Handlebars.compile($('#tpl-single-event').html())
		},
		special: {
			feeditem: Handlebars.compile($('#tpl-feeditem-special').html()),
			single: Handlebars.compile($('#tpl-single-special').html())
		}
	};

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
			}
			return this;
		}
	});

	/*** VARIOUS CONTROLLER FUNCTIONS: WILL BE COMBINED INTO PROPER CONTROLLER LATER ***/
	var resourceTypePending = null;		// guard against multiple quick tab clicks, ensures only last async collection fetch request gets displayed
	var changeFeed = function(resourceType) {
		var collection = typeCollectionMap[resourceType];
		var contentEl = $('#explore div:jqmData(role="content")');
		var tpl, contentView;

		// remember this resource type as the last one requested
		resourceTypePending = resourceType;

		$.mobile.showPageLoadingMsg();
		if (collection) {
			tpl = typeTemplateMap[resourceType].feeditem;

			contentView = new FeedView({
				collection: collection,
				tagName: 'ul',
				className: 'feed',
				attributes: {'data-role':'listview'},
				itemTemplate: typeTemplateMap[resourceType].feeditem
			});

			// all fetch callbacks are guarded by a resourceTypePending check to ensure
			// this fetch was the last one actually requested by the user
			collection.fetch({
				success: function(collection, response) {
					if(resourceTypePending === resourceType) {
						contentEl.html(contentView.render().el);
					}
				},
				error: function(collection, response) {
					if(resourceTypePending === resourceType) {
						contentEl.html("Error retreiving data.");
					}
				},
				complete: function() {
					if(resourceTypePending === resourceType) {
						$.mobile.hidePageLoadingMsg();
						contentEl.trigger("create");
					}
				},
				timeout: 2000
			});
		}
		else {
			if(resourceTypePending === resourceType) {
				contentEl.html("invalid url");
				$.mobile.hidePageLoadingMsg();
			}
		}
	};

	// helper function to be used in template to encode resource uri's embedded in links
	Handlebars.registerHelper('uriEncode', function(string) {
		return encodeURIComponent(string);
	});

	$(document).bind( "pagebeforechange", function(e, data) {
		if (typeof data.toPage === "string") {
			var url = $.mobile.path.parseUrl(data.toPage);
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

				var resourceType = args['type'];
				if (page === 'explore') {
					changeFeed(resourceType);
				}
				else if (page === 'single') {
					tpl = typeTemplateMap[resourceType].single;

					id = decodeURIComponent(args['id']);
					var model = typeCollectionMap[resourceType].get(id);
					
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