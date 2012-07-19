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

	Scenable.feeds = {
		places: collectionBuilder('place'),
		events: collectionBuilder('event'),
		specials: collectionBuilder('special')
	};

	$(document).bind( "pagebeforechange", function(e, data) {
		if (typeof data.toPage === "string") {
			var url = $.mobile.path.parseUrl(data.toPage);
			var match = /^#feed-(.+)/.exec(url.hash);
			var section = (match[1]);
			if (section === 'places') {
				var contentEl = $('#feed-places .content');
				var statusEl = contentEl.find('.content-status');
				var listEl = contentEl.find('.content-list');

				listEl.hide();
				statusEl.html('loading...').show();

				Scenable.feeds.places.fetch({
					success: function(collection, response) {
						listEl.html('<ul>');
						collection.each(function(model){
							listEl.append('<li>' + model.get('name') + '</li>');
						});
						listEl.append('</ul>').show();
						statusEl.hide();
					},
					error: function(collection, response) {
						console.log(response);
						statusEl.html('error');
					},
					timeout: 5000
				});
			}
		}

	});
});