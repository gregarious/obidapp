$(function(){
	// Static view that shows explore state and handles DOM events
	// Events thrown:
	//	'click:navItem' (with resource type label as argument)
	//  'click:displayMode'
	//  'click:searchOn'
	Scenable.views.MenuView = Backbone.View.extend({
		activeSection: null,
		activeDisplayMode: null,
		
		// cached DOM elements
		navElements: {},
		listIcon: null,
		mapIcon: null,

		// events are all DOM-based
		events: {
			'click nav li': 'navClicked',
			'click #icon-search': 'searchClicked',
			'click .icon-display': 'displayModeClicked'
		},

		initialize: function(options) {
			_.bindAll(this, 'render', 'navClicked', 'searchClicked', 'displayModeClicked');
			this.navElements = {
				'now': this.$("#nav-now"),
				'place': this.$("#nav-places"),
				'event': this.$("#nav-events"),
				'special': this.$("#nav-specials"),
				'news': this.$("#nav-news")
			};
			this.listIcon = this.$(".icon-display-list");
			this.mapIcon = this.$(".icon-display-map");
		},

		setActiveNav: function(navLabel, renderChange) {
			renderChange = _.isUndefined(renderChange) ? true : renderChange;
			
			this.activeSection = navLabel;
			if (renderChange === true) {
				this.render();
			}
		},

		setActiveDisplayMode: function(mode, renderChange) {
			console.log('MenuView.setActiveDisplayMode: ' + mode);
			renderChange = _.isUndefined(renderChange) ? true : renderChange;

			this.activeDisplayMode = mode;
			if (renderChange === true) {
				this.render();
			}
		},

		render: function() {
			// ensure correct nav section is active
			_.each(this.navElements, function(el, label) {
				el.toggleClass('active', (this.activeSection === label));
			}, this);

			// ensure opposite display mode is selected
			if (this.activeDisplayMode === 'list') {
				this.listIcon.hide();
				this.mapIcon.show();
			}
			else if (this.activeDisplayMode === 'map') {
				this.mapIcon.hide();
				this.listIcon.show();
			}
			else {
				console.log('Warning: display mode error.');
			}

			return this;
		},

		navClicked: function(e) {
			// get the label of the nav element by stripping off the "nav-" part of the id
			var substrs = e.target.id.split('-');
			var label = substrs[substrs.length-1];
			this.trigger('click:navItem', label);
		},

		displayModeClicked: function() {
			this.trigger('click:displayMode');
		},

		searchClicked: function() {
			this.trigger('click:searchOn');
		}
	});

	Scenable.views.BaseFeedView = Backbone.View.extend({
		events: {
			'click .category-button': 'filterRequested'
		},

		initialize: function(options) {
			_.bindAll(this, 'render', 'filterRequested');
			this.template = options.template;
		},

		filterRequested: function() {
			this.trigger('filterRequested');
		}
	});

	Scenable.views.ListFeedView = Scenable.views.BaseFeedView.extend({
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

	Scenable.views.MapFeedView = Scenable.views.BaseFeedView.extend({
		map: null,
		mapOptions: {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
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
});