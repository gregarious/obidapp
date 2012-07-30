$(function(){
	// Define after ready since inline templates are being compiled
	Scenable.typeCollectionMap = {
		place: new Scenable.models.Places({
			filters: {
				listed: true
			}
		}),
		event: new Scenable.models.Events({
			filters: {
				listed: true
			}
		}),
		special: new Scenable.models.Specials({
			filters: {
				listed: true
			}
		})
	};
});