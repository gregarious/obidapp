define(['explore/models', 'detail/views'], function(models, views) {
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

	var rootElement = $('#panel-detail');
	rootElement.hide();

	var detailController = {
		activate: function() {
			rootElement.show();
			console.log('+ DetailController.activate');
		},
		deactivate: function() {
			rootElement.hide();
			console.log('+ DetailController.deactivate');
		},
		setState: function(settings) {
			console.log('+ DetailController.setState');
			
			var setup = typeSettings[settings.resourceType];
			if (!setup) {
				contentEl.html('invalid resource type');
			}

			var model = new setup.Model({id: settings.objectId});
			var view = new setup.View({model: model});

			rootElement.html('spinning...');

			model.fetch({
				success: function(asyncModel,response) {
					// if the "model" variable has changed since the fetch went out, don't do anything with the response
					if (asyncModel === model) {
						rootElement.html(view.render().el);
					}
				},
				error: function(asyncModel,response) {
					if (asyncModel === model) {
						rootElement.html('error from server');
					}
				}
			});
		}
	};

	// add observer pattern pub capabilities
	_.extend(detailController, Backbone.Events);

	return detailController;
});