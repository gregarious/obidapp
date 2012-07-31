$(function(){
	// Define after ready since inline templates are being compiled
	Scenable.typeCollectionMap = {
		places: new Scenable.models.Places({
			filters: {
				listed: true
			}
		}),
		events: new Scenable.models.Events({
			filters: {
				listed: true
			}
		}),
		specials: new Scenable.models.Specials({
			filters: {
				listed: true
			}
		})
	};
});