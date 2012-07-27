$(function(){
	// Define after ready since inline templates are being compiled
	Scenable.typeSettings = {
		place: {
			collection: new Scenable.models.Places({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-place').html()),
				single: Handlebars.compile($('#tpl-single-place').html())
			}
		},
		event: {
			collection: new Scenable.models.Events({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-event').html()),
				single: Handlebars.compile($('#tpl-single-event').html())
			}
		},
		special: {
			collection: new Scenable.models.Specials({
				filters: {
					listed: true
				}
			}),
			templates: {
				feeditem: Handlebars.compile($('#tpl-feeditem-special').html()),
				single: Handlebars.compile($('#tpl-single-special').html())
			}
		}
	};
});