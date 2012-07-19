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

	$(document).bind( "pagebeforechange", function(e, data) {
		if (typeof data.toPage === "string") {
			var url = $.mobile.path.parseUrl(data.toPage);
			var match = /^\#feed\?type\=(.+)/.exec(url.hash);
			var section = (match[1]);
			var collection = Scenable.typeCollectionMap[section];

			var contentEl = $('#feed .content');
			var statusEl = contentEl.find('.content-status');
			var listEl = contentEl.find('.content-list');

			if (collection) {
				listEl.hide();
				statusEl.html('loading...').show();

				collection.fetch({
					success: function(collection, response) {
						listEl.html('<h3>'+section+'</h3>');
						listEl.append('<ul>');
						collection.each(function(model){
							if(section!=='specials') {
								listEl.append('<li>' + model.get('name') + '</li>');
							}
							else {
								listEl.append('<li>' + model.get('title') + '</li>');
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
	});
});