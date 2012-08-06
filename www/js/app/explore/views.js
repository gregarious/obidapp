define(["text!templates/explore-menu.html",
		"text!templates/explore-filter.html",
		"text!templates/explore-loading.html",
		"text!templates/listitem-places.html",
		"text!templates/listitem-events.html",
		"text!templates/listitem-specials.html",
		"text!templates/mapfeed.html"],
	function(menuTpl, filterTpl, loadingTpl, placeListItemTpl,
				eventListItemTpl, specialListItemTpl, mapTpl) {

	var exports = {};

	exports.LoadingView = Backbone.View.extend({
		template: Handlebars.compile(loadingTpl),
		render: function() {
			this.$el.html(this.template());
		}
	});

	// Static view that shows explore state and handles DOM events
	// Events thrown:
	//	'click:navItem' (with resource type label as argument)
	//  'click:displayMode'
	//  'click:searchOn'
	exports.MenuView = Backbone.View.extend({
		template: Handlebars.compile(menuTpl),
		activeSection: null,
		activeDisplayMode: null,
		
		initialize: function(options) {
			_.bindAll(this, 'render', 'navClicked', 'searchClicked', 'displayModeClicked');
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
			this.$el.html(this.template());

			var listIcon = this.$(".icon-display-list"),
				mapIcon = this.$(".icon-display-map");

			// ensure opposite display mode is selected
			if (this.activeDisplayMode === 'list') {
				listIcon.hide();
				mapIcon.show();
			}
			else if (this.activeDisplayMode === 'map') {
				mapIcon.hide();
				listIcon.show();
			}
			else {
				console.log('Warning: display mode error.');
			}

			// cycle throug nav li's and ensure correct one has 'active' class
			var activeType = this.activeSection;
			this.$('nav li').each(function(idx, listEl) {
				listEl = $(listEl);
				// we use the custom attribute "data-type" as a hook for this
				listEl.toggleClass('active', (listEl.data('type') === activeType));
			});

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
		itemTemplate: null,
		className: 'feed',
		tagName: 'ul',
		render: function() {
			this.$el.empty();
			this.collection.each(function(model){
				this.$el.append(this.itemTemplate(model.attributes));
			}, this);
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
		itemTemplate: Handlebars.compile(placeListItemTpl)
	});
	exports.EventsList = ListFeedView.extend({
		itemTemplate: Handlebars.compile(eventListItemTpl)
	});
	exports.SpecialsList = ListFeedView.extend({
		itemTemplate: Handlebars.compile(specialListItemTpl)
	});

	exports.CategoryFilterView = Backbone.View.extend({
		template: Handlebars.compile(filterTpl),
		
		initialize: function(options) {
			_.bindAll(this, 'render');
		},
		
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	return exports;
});