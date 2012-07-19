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
			}
		}))();
	};

	Scenable.typeCollectionMap = {
		places: collectionBuilder('place'),
		events: collectionBuilder('event'),
		specials: collectionBuilder('special')
	};

	Scenable.typeModelIdMap = {
		places: function(id) { return '/api/v1/place/'+id+'/'; },
		events: function(id) { return '/api/v1/event/'+id+'/'; },
		specials: function(id) { return '/api/v1/special/'+id+'/'; }
	};

	$(document).bind( "pagebeforechange", function(e, data) {
		var url, match, resourceType, collection, contentEl, statusEl, listEl, id;
		if (typeof data.toPage === "string") {
			url = $.mobile.path.parseUrl(data.toPage);
			match = /^\#(.+)\?(.*)/.exec(url.hash);
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

				if (page === 'feed') {
					resourceType = args['type'];
					collection = Scenable.typeCollectionMap[args['type']];

					contentEl = $('#feed .content');
					statusEl = contentEl.find('.content-status');
					listEl = contentEl.find('.content-list');

					if (collection) {
						listEl.hide();
						statusEl.html('loading...').show();

						collection.fetch({
							success: function(collection, response) {
								listEl.html('<h3>'+resourceType+'</h3>');
								listEl.append('<ul data-role="listview">');
								collection.each(function(model){
									if(resourceType!=='specials') {
										listEl.append('<li><a href="#single?type=' + resourceType + '&id=' + model.get('id') + '">' + model.get('name') + '</a></li>');
									}
									else {
										listEl.append('<li><a href="#single?type=' + resourceType + '&id=' + model.get('id') + '">' + model.get('title') + '</a></li>');
									}
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
					resourceType = args['type'];
					collection = Scenable.typeCollectionMap[args['type']];

					id = args['id'];
					contentEl = $('#single .content');
					var model = collection.get(Scenable.typeModelIdMap[resourceType](id));
					contentEl.html(model.get('name'));
				}
			}
		}
	});
});