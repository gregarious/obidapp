(function(){
	var toTastyPieRootUrl = function(resourceType) {
		return 'http://127.0.0.1:8000/api/v1/' + resourceType + '/?format=jsonp';
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

	Scenable.models.Places = Backbone.Collection.extend({
		model: Scenable.models.Place,
		urlRoot: toTastyPieRootUrl('place')
	});

	Scenable.models.Events = Backbone.Collection.extend({
		model: Scenable.models.Event,
		urlRoot: toTastyPieRootUrl('event')
	});

	Scenable.models.Specials = Backbone.Collection.extend({
		model: Scenable.models.Special,
		urlRoot: toTastyPieRootUrl('special')
	});
})();