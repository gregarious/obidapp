$(function(){
	Scenable.views.DetailView = Backbone.View.extend({
		template: null,

		initialize: function(options) {
			this.template = options.template;
			this.model = options.model;
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
});