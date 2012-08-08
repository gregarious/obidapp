define(function(){
	var toTastyPieRootUrl = function(resourceType) {
		return Scenable.constants.SITEURL + '/api/v1/' + resourceType;
	};

	var exports = {};

	// given a location hash, tuck latitude and longitude elements inside a 'geocoding' hash
	// operates in place on location hash
	var setGeocoding = function(location) {
		if (_.isObject(location)) {
			if (_.isNumber(location.latitude) && _.isNumber(location.longitude)) {
				location.geocoding = {
					latitude: location.latitude,
					longitude: location.longitude
				};
			}
			else {
				location.geocoding = null;
			}
			delete location.latitude;
			delete location.longitude;
		}
	};

	/*** BACKBONE MODELS ***/
	exports.Place = Backbone.Model.extend({
		urlRoot: toTastyPieRootUrl('place'),
		parse: function(response) {
			var attrs = Backbone.Model.prototype.parse.call(this, response);
			setGeocoding(attrs.location);
			return attrs;
		},
		headerText: function() {
			return this.get('name');
		}
	});

	exports.Event = Backbone.Model.extend({
		urlRoot: toTastyPieRootUrl('event'),
		parse: function(response) {
			var attrs = Backbone.Model.prototype.parse.call(this, response);
			setGeocoding(attrs.place && attrs.place.location);
			return attrs;
		},
		headerText: function() {
			return this.get('name');
		}
	});

	exports.Special = Backbone.Model.extend({
		urlRoot: toTastyPieRootUrl('special'),
		parse: function(response) {
			var attrs = Backbone.Model.prototype.parse.call(this, response);
			setGeocoding(attrs.place && attrs.place.location);
			return attrs;
		},
		headerText: function() {
			return this.get('title');
		}
	});

	var BaseCollection = Backbone.Collection.extend({
		meta: null,
		query: null,
		categoryId: null,

		// options:
		//	- url: direct override of the default url
		//  - query: search query to add to request
		//  - categoryId: category id to filter results by
		initialize: function(options) {
			if (options) {
				this.query = options.query || null;
				// TODO: allow categoryId = 0
				this.categoryId = options.categoryId || null;
				this.limit = options.limit || null;
				this.offset = options.offset || null;
			}
		},

		fetch: function(options) {
			options.data = options.data || {};
			if (this.categoryId !== null) {
				options.data['catpk'] = this.categoryId;
			}
			if (this.query !== null) {
				options.data['q'] = this.query;
			}
			if (this.offset !== null) {
				options.data['offset'] = this.offset;
			}
			if (this.limit !== null) {
				options.data['limit'] = this.limit;
			}
			console.log('fetching with options.data to follow');
			console.log(options.data);

			return Backbone.Collection.prototype.fetch.call(this, options);
		},

		parse: function(response) {
			this.meta = response.meta;
			return response.objects;
		},

		getNextPageOptions: function() {
			if (this.meta && this.meta.next === null) {
				return null;
			}
			return {
				offset: this.meta.offset + this.meta.limit,
				limit: this.meta.limit,
				query: this.query,
				categoryId: this.categoryId
			};
		},

		getPrevPageOptions: function() {
			if (this.meta && this.meta.previous === null) {
				return null;
			}
			return {
				offset: this.meta.offset - this.meta.limit,
				limit: this.meta.limit,
				query: this.query,
				categoryId: this.categoryId
			};
		}
	});

	exports.Places = BaseCollection.extend({
		model: exports.Place,
		url: toTastyPieRootUrl('place'),

		fetch: function(options) {
			// restrict results to only listed places
			options.data = options.data || {};
			options.data.listed = true;
			return BaseCollection.prototype.fetch.call(this, options);
		},

		categories: {
			'Food & Drink': 301,
			'Retail': 302,
			'Services': 303
		}
	});

	exports.Events = BaseCollection.extend({
		model: exports.Event,
		url: toTastyPieRootUrl('event'),
		
		fetch: function(options) {
			// restrict results to only listed events after this moment
			options.data = options.data || {};
			options.data.listed = true;
			options.data.dtend__gt = moment().format();
			return BaseCollection.prototype.fetch.call(this, options);
		}
	});

	exports.Specials = BaseCollection.extend({
		model: exports.Special,
		url: toTastyPieRootUrl('special'),
		
		fetch: function(options) {
			// restrict results to only specials that expire today or later
			options.data = options.data || {};
			options.data.listed = true;
			options.data.dexpires__gte = moment().format('YYYY-MM-DD');
			return BaseCollection.prototype.fetch.call(this, options);
		}
	});

	exports.NewsArticles = BaseCollection.extend({
		// model unnecessary: no single page for news
		url: toTastyPieRootUrl('news')
	});

	exports.PlaceCategories = Backbone.Collection.extend({
		url: toTastyPieRootUrl('place_category'),
		parse: function(response) {
			return response.objects;
		}
	});

	exports.EventCategories = Backbone.Collection.extend({
		url: toTastyPieRootUrl('event_category'),
		parse: function(response) {
			return response.objects;
		}
	});

	return exports;
});