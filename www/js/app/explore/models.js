(function(){
	var toTastyPieRootUrl = function(resourceType) {
		return Scenable.constants.SITEURL + '/api/v1/' + resourceType;
	};

	/*** BACKBONE MODELS ***/
	Scenable.models.Place = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('place')
	});

	Scenable.models.Event = Backbone.Model.extend({
		headerText: function() {
			return this.get('name');
		},
		urlRoot: toTastyPieRootUrl('event')
	});

	Scenable.models.Special = Backbone.Model.extend({
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

	Scenable.models.Places = BaseCollection.extend({
		model: Scenable.models.Place,
		url: toTastyPieRootUrl('place')
	});

	Scenable.models.Events = BaseCollection.extend({
		model: Scenable.models.Event,
		url: toTastyPieRootUrl('event')
	});

	Scenable.models.Specials = BaseCollection.extend({
		model: Scenable.models.Special,
		url: toTastyPieRootUrl('special')
	});
})();