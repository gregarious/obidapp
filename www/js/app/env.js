Scenable = {
	models: {},
	collections: {},
	views: {},
	controllers: {},
	helpers: {
		compileTpl: function(selector) {
			return Handlebars.compile($(selector).html());
		}
	}
};

/*** Override Backbone's Model/Collection sync functions **/
(function(){
	var jsonpSync = function(method, model, options) {
		var opts = options || {};
		opts.dataType = "jsonp";
		return Backbone.sync(method, model, opts);
	};

	Backbone.Model.prototype.sync = jsonpSync;
	Backbone.Collection.prototype.sync = jsonpSync;
})();

