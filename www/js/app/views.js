// expects el to have two subdivs, .content-status and .content-list
var FeedView = Backbone.View.extend({
	initialize: function(options) {
		_.bindAll(this, 'render');
		this.itemTemplate = options.itemTemplate;
	},

	render: function() {
		this.$el.empty();
		if(this.collection) {
			this.collection.each(function(m) {
				this.$el.append(
					'<li>' +
						this.itemTemplate(m.attributes) +
					'</li>');
			}, this);
			this.$el.append('<hr/><a href="#category-form">Categories</a>');
		}
		return this;
	}
});

var CategoryForm = Backbone.View.extend({
	tagName: 'form',

	events: {
		'submit': 'submitted'
	},

	initialize: function(options) {
		this.template = options.template;
		this.categories = options.categories;

		// when user "submits" form, trigger the submit event and close the parent dialog
		// not using a true submit button/event because preventDefault won't work
		this.$el.on('click', '.ok-button', $.proxy(function(e) {
			this.trigger('submit', e);
		}, this));

		_.bindAll(this, 'render', 'submitted');
	},

	render: function() {
		this.$el.html(this.template({'categories': this.categories}));
		return this;
	},

	// handles DOM submit event, triggers event that passes along object with {category: bool} entries
	submitted: function(e) {
		console.log('hahah');
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