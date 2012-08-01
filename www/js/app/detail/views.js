define(["text!/templates/single-place.html", "text!/templates/single-event.html", "text!/templates/single-special.html"],
	function(placeTpl, eventTpl, specialTpl){
		var BaseDetailView = Backbone.View.extend({
			template: null,

			initialize: function(options) {
				_.bindAll(this, 'render');
			},

			render: function() {
				if (this.template) {
					this.$el.html(this.template(this.model.attributes));
				}
				else {
					this.$el.html('no template provided');
				}
				return this;
			}
		});

		var exports = {
			PlaceDetail: BaseDetailView.extend({
				template: Handlebars.compile(placeTpl)
			}),
			EventDetail: BaseDetailView.extend({
				template: Handlebars.compile(eventTpl)
			}),
			SpecialDetail: BaseDetailView.extend({
				template: Handlebars.compile(specialTpl)
			})
		};
		return exports;
	}
);