$(function() {
	Scenable.controllers.detailController = {
		activate: function() {
			console.log('DetailController activated.');
		},
		deactivate: function() {
			console.log('DetailController deactivated.');
		},
		setContent: function(resourceType, id) {
			var tpl = Scenable.typeSettings[resourceType].templates.single;
			var model = Scenable.typeSettings[resourceType].collection.get(id);
			
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