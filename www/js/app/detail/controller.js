$(function() {
	var compileTpl = Scenable.helpers.compileTpl;
	var templates = {
		place: {
			single: compileTpl('#tpl-single-place')
		},
		event: {
			single: compileTpl('#tpl-single-event')
		},
		special: {
			single: compileTpl('#tpl-single-special')
		}
	};

	Scenable.controllers.detailController = {
		activate: function() {
			console.log('DetailController activated.');
		},
		deactivate: function() {
			console.log('DetailController deactivated.');
		},
		setContent: function(resourceType, id) {
			var tpl = templates[resourceType].single;
			var model = Scenable.typeCollectionMap[resourceType].get(id);
			
			var contentEl = $('#single .content');
			contentEl.html(tpl(model.attributes));
			contentEl.trigger("create");

			// also add the title change
			$('#single h1').text(model.headerText());
		}
	};

	// add observer pattern pub capabilities
	_.extend(Scenable.controllers.detailController, Backbone.Events);
});