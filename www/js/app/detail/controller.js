$(function() {
	Scenable.controllers.DetailController = {
		activate: function() {
			console.log('DetailController activated.');
		},
		deactivate: function() {
			console.log('DetailController deactivated.');
		},
		act: function(args) {
			var resourceType = args.type;
			var id = decodeURIComponent(args.id);
			var tpl = Scenable.typeSettings[resourceType].templates.single;
			var model = Scenable.typeSettings[resourceType].collection.get(id);
			
			var contentEl = $('#single .content');
			contentEl.html(tpl(model.attributes));
			contentEl.trigger("create");

			// also add the title change
			$('#single h1').text(model.headerText());
		}
	};
});