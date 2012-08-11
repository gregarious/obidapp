define(["text!templates/explore-menu.html",
		"text!templates/explore-filter.html",
		"text!templates/explore-loading.html",
		"text!templates/explore-error.html",
		"text!templates/list-paging.html",
		"text!templates/listitem-places.html",
		"text!templates/listitem-events.html",
		"text!templates/listitem-specials.html",
		"text!templates/listitem-news.html",
		"text!templates/listitem-noresults.html",
		"text!templates/mapfeed.html",
		"text!templates/home.html"],
	function(menuTpl, filterTpl, loadingTpl, errorTpl, pagingTpl,
				placeListItemTpl, eventListItemTpl, specialListItemTpl,
				newsListItemTpl, noResultsTpl, mapTpl, homeTpl) {

	var exports = {};

	exports.LoadingView = Backbone.View.extend({
		template: Handlebars.compile(loadingTpl),
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	exports.ErrorView = Backbone.View.extend({
		template: Handlebars.compile(errorTpl),
		initialize: function(options) {
			this.message = options.message;
			return this;
		},

		render: function() {
			this.$el.html(this.template({'message': this.message}));
			return this;
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
				console.warn('display mode error.');
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

	exports.NowView = Backbone.View.extend({
		template: Handlebars.compile(homeTpl),
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	var BaseFeedView = Backbone.View.extend({
		events: {
			'click .page-previous': 'pagePrevious',
			'click .page-next': 'pageNext'
		},

		initialize: function(options) {
			_.bindAll(this, 'render', 'pagePrevious', 'pageNext');
		},

		pagePrevious: function() {
			this.trigger('page:prev');
		},

		pageNext: function() {
			this.trigger('page:next');
		}
	});

	/*
	* Following set of functions are for emulating "tap" behavior
	* on feed items and disabled the overeager click events. See
	* http://floatlearning.com/2011/03/developing-better-phonegap-apps/
	* for the inspiration.
	*
	* TODO: reformulate into an actual jQuery event using
	* on-touchstart demand binding (see "$.event.special.tap" in jqm source)
	* and special event conventions
	* (http://benalman.com/news/2010/03/jquery-special-events/). Then
	* create a special delegateEvents function to be used on all views
	* anchor clicks and replaces them with taps (this should allow us to
	* avoid the ridiculous delay to avoid next page link clicks)
	*/
	var onFeedItemTouchStart = function(e) {
		// if(isTouching) return;
		e.currentTarget.beingTapped = true;
		console.log("Start Tap: " + $(e.currentTarget).find('h1').html());
		// isTouching = true;
	};

	var onFeedItemTouchMove = function(e) {
		// if(isTouching) return;
		e.currentTarget.beingTapped = false;
		console.log("Tap Cancelled: " + $(e.currentTarget).find('h1').html());
		// isTouching = true;
	};

	var onFeedItemTouchEnd = function(e) {
		// if(isTouching) return;
		if (e.currentTarget.beingTapped === true) {
			console.log("Tapped & triggering: " + $(e.currentTarget).find('h1').html());
			// trigger the tap AFTER a delay. without the delay, a click will register
			// well after any tap callbacks, who the hell knows why.
			var delay = 300;
			setTimeout(function(){
				$(e.currentTarget).trigger('tap');
			}, delay);
			console.log('using delay time of ' + delay + 's');
		}
		else {
			console.log("Not tapped: " + $(e.currentTarget).find('h1').html());
		}
		e.currentTarget.beingTapped = false;
		// isTouching = true;
	};

	$.fn.enableTap = function() {
		this.each(function(){
			var el = $(this);	// refers to individul element
			el.on('click', function(e) {
				e.preventDefault();
			});
			el.on('touchstart', onFeedItemTouchStart);
			el.on('touchmove', onFeedItemTouchMove);
			el.on('touchend', onFeedItemTouchEnd);
		});
		return this;
	};

	var ListFeedView = BaseFeedView.extend({
		itemTemplate: null,
		noResultsTemplate: Handlebars.compile(noResultsTpl),
		pagingTemplate: Handlebars.compile(pagingTpl),

		events: {
			// enableTap call in render replaces anchor clicks with taps
			// on tap, need to follow the href
			'tap a.single-link': function(e) {
				window.location = e.target.href;
			}
		},

		render: function() {
			this.$el.empty();

			// handle pagination buttons at button
			// TODO: move this below once styling is figured out
			var pagingOpts = {
				previous: this.collection.meta && this.collection.meta.previous,
				next: this.collection.meta && this.collection.meta.next
			};

			// TODO: need to do better than this with composite views
			var listHtml = '<ul class="feed">';
			if (this.collection.length < 1) {
				listHtml += this.noResultsTemplate();
			}
			else {
				this.collection.each(function(model){
					listHtml += this.itemTemplate(model.attributes);
				}, this);
			}
			listHtml += '</ul>';

			this.$el.append(listHtml);

			// disable click events and enable tap ones
			this.$('a.single-link').enableTap();

			var pagingHtml = '<div class="paging">' +
			this.pagingTemplate(pagingOpts) +
			'</div>';
			
			this.$el.append(pagingHtml);


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
	exports.NewsArticleList = ListFeedView.extend({
		itemTemplate: Handlebars.compile(newsListItemTpl)
	});

	exports.CategoryFilterView = Backbone.View.extend({
		template: Handlebars.compile(filterTpl),
		
		// TODO: doesn't delegate. no idea why
		// events: {
		// 	'change select': 'categorySelected'
		// },

		initialize: function(options) {
			_.bindAll(this, 'render', 'categorySelected');
		},

		render: function() {
			var list = this.collection.map(function(model) {
				return model.attributes;
			});
			var content = this.template({categories: list});
			this.$el.html(content);
			return this;
		},

		categorySelected: function(e) {
			var selectedEl = $(e.target).find("option:selected");
			var idSelected = selectedEl.val();
			this.trigger('selected', idSelected);
		}
	});

	return exports;
});