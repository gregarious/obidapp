define(['explore/models',
		'detail/views',
		'text!templates/explore-loading.html',
		'text!templates/explore-error.html'],
	function(models, views, loadingTpl, errorTpl) {
		var typeSettings = {
			places: {
				Model: models.Place,
				View: views.PlaceDetail
			},
			events: {
				Model: models.Event,
				View: views.EventDetail
			},
			specials: {
				Model: models.Special,
				View: views.SpecialDetail
			}
		};

		var rootElement,
			errorTemplate = Handlebars.compile(errorTpl);
			loadingTemplate = Handlebars.compile(loadingTpl);

		var detailController = {
			activate: function() {
				rootElement = $('#panel-detail');
				rootElement.show();
			},
			deactivate: function() {
				rootElement.hide();
			},
			setState: function(settings) {
				var setup = typeSettings[settings.resourceType];
				if (!setup) {
					contentEl.html('invalid resource type');
				}

				var model = new setup.Model({id: settings.objectId});
				var view = new setup.View({model: model});
				view.on('back', function() {
					window.history.back();
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
		_.extend(detailController, Backbone.Events);

		return detailController;
});