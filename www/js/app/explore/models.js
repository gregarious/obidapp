define(function(){
	var toTastyPieRootUrl = function(resourceType) {
		return Scenable.constants.SITEURL + '/api/v1/' + resourceType;
	};

	var exports = {};

	/*** BACKBONE MODELS ***/
	exports.Place = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('place')
	});

	exports.Event = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('event')
	});

	exports.Special = Backbone.Model.extend({
		headerText: function() {
			return this.get('title');
		},
		urlRoot: toTastyPieRootUrl('special')
	});

	var BaseCollection = Backbone.Collection.extend({
		offset: null,
		limit: null,
		filters: null,
		query: null,

		// availble options: offset, limit, filters, query
		setQueryOptions: function(options) {
			this.offset = options.offset || null;
			this.limit = options.limit || null;
			this.filters = options.filters || null;
			this.query = options.query || null;
		},

		toQueryString: function() {
			var keys = ['offset', 'limit', 'filters', 'query'],
				key;
			var clauses = [];
			for (key in keys) {
				if (this[key] === null) {
					clauses.push(key + "=" + this[key]);
				}
			}
			return clauses.join("&");
		},

		parse: function(response) {
			return response.objects;
		}
	});

	exports.Places = BaseCollection.extend({
		model: exports.Place,
		url: toTastyPieRootUrl('place')
	});

	exports.Events = BaseCollection.extend({
		model: exports.Event,
		url: toTastyPieRootUrl('event')
	});

	exports.Specials = BaseCollection.extend({
		model: exports.Special,
		url: toTastyPieRootUrl('special')
	});

	return exports;
});