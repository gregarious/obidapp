$(function(){
	console.log("ready!");

	window.Scenable = {};

	// resourceName should match a Tastypie resource name (e.g. 'place')
	var collectionBuilder = function(resourceName) {
		return new (Backbone.Collection.extend({
			url: 'http://127.0.0.1:8000/api/v1/' + resourceName + '/',
			sync: function(method, model, options) {
				var opts = options || {};
				opts.dataType = "jsonp";
				return Backbone.sync(method, model, opts);
			},
			resourceName: resourceName
		}))();
	};

	Scenable.typeCollectionMap = {
		place: collectionBuilder('place'),
		event: collectionBuilder('event'),
		special: collectionBuilder('special')
	};

	Scenable.typeTemplateMap = {
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
				var collection = Scenable.typeCollectionMap[args['type']];
				var contentEl = null,
					tpl = null;
				if (page === 'feed') {
					contentEl = $('#feed .content');
					var statusEl = contentEl.find('.content-status');
					var listEl = contentEl.find('.content-list');

					if (collection) {
						listEl.hide();
						statusEl.html('loading...').show();

						collection.fetch({
							success: function(collection, response) {
								listEl.html('<h3>'+resourceType+'</h3>');
								listEl.append('<ul data-role="listview" data-theme="g">');
								collection.each(function(model){
									tpl = Scenable.typeTemplateMap[resourceType].feeditem;
									listEl.append('<li>' + tpl(model.attributes) + '</li>');
								});
								listEl.append('</ul>').show();
								statusEl.hide();
							},
							error: function(collection, response) {
								console.log(response);
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
					contentEl = $('#single .content');
					tpl = Scenable.typeTemplateMap[resourceType].single;
					contentEl.html(tpl(collection.get(id).attributes));
				}
			}
		}
	});
});