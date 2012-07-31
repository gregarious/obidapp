$(function() {
	var compileTpl = Scenable.helpers.compileTpl;
	var typeSettings = {
		places: {
			Model: Scenable.models.Place,
			template: compileTpl('#tpl-single-place')
		},
		events: {
			Model: Scenable.models.Event,
			template: compileTpl('#tpl-single-event')
		},
		specials: {
			Model: Scenable.models.Special,
			template: compileTpl('#tpl-single-special')
		}
	};

	var rootElement = $('#panel-detail');
	rootElement.hide();

	Scenable.controllers.detailController = {
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

			var view = new Scenable.views.DetailView({
				model: model,
				template: setup.template
			});

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
	_.extend(Scenable.controllers.detailController, Backbone.Events);
});