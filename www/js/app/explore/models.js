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

	var isLocationGeocoded = function(loc) {
		return _.isObject(loc) && _.isNumber(loc.latitude) && _.isNumber(loc.longitude);
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
		prev: null,
		next: null,
		category_id: null,
		query: null,

		// TO ADD SUPPORT FOR GET ARGS: JUST ADD A "data" object to the fetch calls -- passthru to jQuey.ajax afterall
		// availble options: offset, limit, filters, query
		setQuery: function(query) {
			this.query = query;
		},

		setCategory: function(id) {
			this.category_id = id;
		},

		fetch: function(options) {
			options.data = options.data || {};
			if (this.category_id !== null) {
				options.data['catpk'] = this.category_id;
			}
			if (this.query !== null) {
				options.data['q'] = this.query;
			}

			return Backbone.Collection.prototype.fetch.call(this, options);
		},

		// returns a new Collection of this type, with url set
		getNextCollection: function() {
			// either need to fid a way to make a new obejct of this type,
			// or need to parse the prev/next url from backbone.
		},

		// returns a new Collection of this type, with url set
		getPrevious: function() {

		},

		parse: function(response) {
			this.prev = response.meta && response.meta.previous;
			this.next = response.meta && response.meta.next;
			return response.objects;
		}
	});

	exports.Places = BaseCollection.extend({
		model: exports.Place,
		url: toTastyPieRootUrl('place'),
		fetch: function(options) {
			options.data = options.data || {};
			options.data.listed = true;
			return BaseCollection.prototype.fetch.call(this, options);
		}
	});

	exports.Events = BaseCollection.extend({
		model: exports.Event,
		url: toTastyPieRootUrl('event'),
		fetch: function(options) {
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
			options.data = options.data || {};
			options.data.listed = true;
			options.data.dexpires__gt = moment().format('YYYY-MM-DD');
			return BaseCollection.prototype.fetch.call(this, options);
		}
	});

	return exports;
});