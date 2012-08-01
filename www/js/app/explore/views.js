define(["text!/templates/listfeed-places.html",
		"text!/templates/listfeed-events.html",
		"text!/templates/listfeed-specials.html",
		"text!/templates/mapfeed.html"],
	function(placesListTpl, eventsListTpl, specialsListTpl, mapTpl){

	var exports = {};

	// Static view that shows explore state and handles DOM events
	// Events thrown:
	//	'click:navItem' (with resource type label as argument)
	//  'click:displayMode'
	//  'click:searchOn'
	exports.MenuView = Backbone.View.extend({
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

	var BaseFeedView = Backbone.View.extend({
		events: {
			'click .category-button': 'filterRequested'
		},

		initialize: function(options) {
			_.bindAll(this, 'render', 'filterRequested');
		},

		filterRequested: function() {
			this.trigger('filterRequested');
		}
	});

	var ListFeedView = BaseFeedView.extend({
		template: null,
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

	exports.MapFeedView = BaseFeedView.extend({
		template: Handlebars.compile(mapTpl),
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

	exports.PlacesList = ListFeedView.extend({
		template: Handlebars.compile(placesListTpl)
	});
	exports.EventsList = ListFeedView.extend({
		template: Handlebars.compile(eventsListTpl)
	});
	exports.SpecialsList = ListFeedView.extend({
		template: Handlebars.compile(specialsListTpl)
	});

	return exports;
});