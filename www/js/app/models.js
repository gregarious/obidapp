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

/*** BACKBONE MODELS ***/
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
