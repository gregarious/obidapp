define(['explore/models',
		'explore/views',
		'text!templates/explore-loading.html',
		'text!templates/explore-error.html'],
	function(models, views, loadingTpl, errorTpl) {
		var typeSettings = {
			places: {
				Model: models.Place,
				View: views.PlacesMap
			},
			events: {
				Model: models.Event,
				View: views.EventsMap
			},
			specials: {
				Model: models.Special,
				View: views.SpecialsMap
			}
		};

		var rootElement,
			errorTemplate = Handlebars.compile(errorTpl);
			loadingTemplate = Handlebars.compile(loadingTpl);

		var mapController = {
			activate: function() {
				rootElement = $('#panel-map');
				rootElement.show();
				console.log('+ MapController.activate');
			},
			deactivate: function() {
				rootElement.hide();
				console.log('+ MapController.deactivate');
			},
			setState: function(settings) {
				console.log('+ MapController.setState');
				var setup = typeSettings[settings.resourceType];
				if (!setup) {
					contentEl.html('invalid resource type');
				}

				var model = new setup.Model({id: settings.objectId});
				var view = new setup.View({
					model: model,
					attributes: {style: 'width:100%; height:100%; display:block;'}
				});

				rootElement.html(loadingTemplate());

				model.fetch({
					success: function(asyncModel,response) {
						// if the "model" variable has changed since the fetch went out, don't do anything with the response
						if (asyncModel === model) {
							rootElement.html(view.render().el);
						}
					},
					error: function(asyncModel,response) {
						if (asyncModel === model) {
							rootElement.html(errorTemplate({'message': 'Server error!'}));
						}
					}
				});
			}
		};

		// add observer pattern pub capabilities
		_.extend(mapController, Backbone.Events);

		return mapController;
});