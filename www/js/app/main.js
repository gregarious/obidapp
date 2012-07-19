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
				var contentEl = null,
					tpl = null;
				if (page === 'feed') {
					contentEl = $('#feed .content');
					var statusEl = contentEl.find('.content-status');
					var listEl = contentEl.find('.content-list');

					if (collection) {
						listEl.html('').hide();
						statusEl.html('loading...').show();

						collection.fetch({
							success: function(collection, response) {
								listEl.append('<ul data-role="listview" data-theme="g">');
								collection.each(function(m){
									tpl = typeTemplateMap[resourceType].feeditem;
									listEl.append('<li>' + tpl(m.attributes) + '</li>');
								});
								listEl.append('</ul>').show();
								statusEl.hide();
							},
							error: function(collection, response) {
								statusEl.html('error');
							},
							timeout: 2000
						});
					}
					else {
						listEl.hide();
						statusEl.html('internal error: invalid url').show();
					}
				}
				else if (page === 'single') {
					id = decodeURIComponent(args['id']);
					var model = collection.get(id);
					
					contentEl = $('#single .content');
					tpl = typeTemplateMap[resourceType].single;
					contentEl.html(tpl(model.attributes));

					// also add the title change
					$('#single h1').text(model.headerText());

				}
			}
		}
	});
});