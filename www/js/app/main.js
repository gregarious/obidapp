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

	// helper function to be used in template to encode resource uri's embedded in links
	Handlebars.registerHelper('uriEncode', function(string) {
		return encodeURIComponent(string);
	});

	// expects el to have two subdivs, .content-status and .content-list
	var ExploreView = Backbone.View.extend({
		initialize: function() {
			this.elements = {};
			// create loading status div
			this.elements.status = $('<div/>', {
				'class': 'explore-status'
			}).appendTo(this.el);

			// create main elements for displaying data (may want to handle this as a subview)
			this.elements.main = $('<ul/>', {
				'class': 'explore-content'
			}).appendTo(this.el);

			_.bindAll(this, 'render', 'hideStatus', 'showStatus');
		},

		setStatus: function(message, show) {
			show = _.isUndefined(show) ? true : show;	// default show to true
			this.elements.status.text(message);
			if(show) {
				this.showStatus();
			}
		},

		showStatus: function() {
			this.elements.main.hide();
			this.elements.status.show();
		},

		hideStatus: function() {
			this.elements.status.hide();
			this.elements.main.show();
		},

		setContent: function(collection, itemTemplate) {
			this.collection = collection;
			this.itemTemplate = itemTemplate;

			if(this.collection) {
				this.collection.on("reset", this.render);
				this.collection.on("reset", this.hideStatus);
			}
		},

		render: function() {
			this.elements.main.html('');
			if(this.collection) {
				this.collection.each(function(m) {
					var rendered;
					if(this.itemTemplate) {
						rendered = this.itemTemplate(m.attributes);
					}
					else {
						rendered = '';
					}
					this.elements.main.append('<li>' + rendered + '</li>');
				}, this);
			}
		}
	});

	var exploreView = new ExploreView({
		el: $("#explore .explore-main")
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
				var collection = typeCollectionMap[args['type']];
				var tpl;
				if (page === 'explore') {
					if (collection) {
						tpl = typeTemplateMap[resourceType].feeditem;
						exploreView.setContent(collection, tpl);
						exploreView.setStatus('loading...');
						collection.fetch({
							error: function(collection, response) {
								exploreView.setStatus("Error retreiving data.");
							},
							timeout: 2000
						});
					}
					else {
						exploreView.setContent(null, null);
						exploreView.setStatus("invalid url");
					}
				}
				else if (page === 'single') {
					tpl = typeTemplateMap[resourceType].single;

					id = decodeURIComponent(args['id']);
					var model = collection.get(id);
					
					contentEl = $('#single .content');
					contentEl.html(tpl(model.attributes));

					// also add the title change
					$('#single h1').text(model.headerText());

				}
			}
		}
	});
});