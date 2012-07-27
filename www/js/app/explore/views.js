(function(){
	var BaseFeedView = Backbone.View.extend({
		initialize: function(options) {
			_.bindAll(this, 'render');
			this.template = options.template;
		},

		render: function() {
			var context = {
				'models': this.collection.map(function(m) {
					return m.attributes;
				})
			};
			this.$el.html(this.template(context));
			return this;
		}
	});
	Scenable.views.ListFeedView = BaseFeedView;

	Scenable.views.CategoryForm = Backbone.View.extend({
		tagName: 'form',

		events: {
			// when user "submits" form, trigger the submit event and close the parent dialog
			// not using a true submit button/event because preventDefault won't work
			'click .ok-button': 'submitted'
		},

		initialize: function(options) {
			this.template = options.template;
			this.categories = options.categories;

			_.bindAll(this, 'render', 'submitted');
		},

		render: function() {
			this.$el.html(this.template({'categories': this.categories}));
			return this;
		},

		// handles DOM submit event, triggers event that passes along object with {category: bool} entries
		submitted: function(e) {
			var inputs = $(e.target).serializeArray();
			
			// fill the categories array with the chosen names
			var categories = [];
			inputs = _.each(inputs, function(obj) {
				if(obj.name !== 'submit') {
					categories.push(obj.name);
				}
			});
			this.trigger('submit', categories);
			e.preventDefault();
		}
	});
})();