$(function(){
	Scenable.views.ListFeedView = Backbone.View.extend({
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

	Scenable.views.MapFeedView = Backbone.View.extend({
		map: null,
		mapOptions: {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},

		initialize: function(options) {
			_.bindAll(this, 'render');
			this.template = options.template;
			this.itemTemplate = options.itemTemplate;
		},

		render: function() {
			this.$el.html(this.template());
			//this.map = new google.maps.Map(this.$('#map_canvas'), this.mapOptions);
			return this;
		}
	});

	// Might consider replacing this with just a simply jQuery widget for controller to listen to
	Scenable.views.CategoryForm = Backbone.View.extend({
		tagName: 'form',
		template: Handlebars.compile($("#tpl-category-form").html()),

		events: {
			// when user "submits" form, trigger the submit event and close the parent dialog
			// not using a true submit button/event because preventDefault won't work
			'click .ok-button': 'submitted'
		},

		initialize: function(options) {
			this.categories = options.categories;
			_.bindAll(this, 'render', 'submitted');
		},

		render: function() {
			this.$el.html(this.template({'categories': this.categories}));
			return this;
		},

		// handles DOM submit event, triggers event that passes along object with {category: bool} entries
		submitted: function(e) {
			var inputs = this.$el.serializeArray();
			
			// fill the categories array with the chosen names
			var categories = [];
			inputs = _.each(inputs, function(obj) {
				if(obj.name !== 'submit') {
					categories.push(obj.name);
				}
			});
			this.trigger('submit', categories);
		}
	});

// Might consider replacing this with just a simply jQuery widget for controller to listen to
	Scenable.views.SearchForm = Backbone.View.extend({
		tagName: 'form',
		template: Handlebars.compile($("#tpl-search-form").html()),

		events: {
			// when user "submits" form, trigger the submit event and close the parent dialog
			// not using a true submit button/event because preventDefault won't work
			'click .ok-button': 'submitted'
		},

		initialize: function(options) {
			_.bindAll(this, 'render', 'submitted');
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		},

		// handles DOM submit event, triggers event that passes along object with {category: bool} entries
		submitted: function(e) {
			var query = this.$('[name]="query"').val();
			this.trigger('submit', query);
		}
	});
});