$(function(){
    Scenable = Scenable || {};

    /*** VIEW CLASS DEFINITIONS ***/
    /*
     * TopBar View: Static (mostly) top bar in charge of handing off explore
     * mode changing and searching events.
     * - One bit of dynamic content is present for the view: the username in
     *   the center. Instead of complicating things by forcing a template, a simple
     *   function call will update the text directly in the DOM.
     *
     * Events to subscribe to:
     * - feed-mode-change (args: new mode name)
    */
    var TopBar = Backbone.View.extend({
        feedModes: ['list', 'map'],
        currModeIndex: 0,  // default to first array element
        centerText: '',

        // supported opts:
        // - centerText
        // - modeIndex (0 for list, 1 for map)
        initialize: function(opts) {
            _.bindAll(this, 'searchChosen', 'setCenterText', 'cycleFeedMode', 'render');
            if(opts) {
                if(opts.centerText) {
                    this.centerText = opts.centerText;
                }
                if(opts.centerText) {
                    this.modeIndex = opts.modeIndex;
                }
            }
        },

        setCenterText: function(text, render) {
            this.centerText = text;
            if(_.isUndefined(render) || render) {
                this.render();
            }
        },

        setModeIndex: function(idx, render) {
            this.modeIndex = idx;
            if(_.isUndefined(render) || render) {
                this.render();
            }
        },

        render: function() {
            var nextMode = this.feedModes[(this.currModeIndex + 1) % this.feedModes.length];
            // switch this to an icon setting (maybe conditional in a template?
            this.$('.mode-button').html(nextMode);
            this.$('.current-user').text(this.centerText);
            return this;
        },

        events: {
            'click .mode-button': 'cycleFeedMode',
            'click .search-button': 'searchChosen'
        },

        searchChosen: function(event) {
            // TODO: need to grab the query
            var query = 'query';
            this.trigger('search', query);
        },

        cycleFeedMode: function() {
            this.currModeIndex = (this.currModeIndex + 1) % this.feedModes.length;
            this.trigger('feed-mode-change', this.feedModes[this.currModeIndex]);
            this.render();
        }
    });

    /*
     * NavBar View: Static nav bar in charge of handing off feed type change
     * events
    */
    var NavBar = Backbone.View.extend({
        activeType: 'now',

        initialize: function(opts) {
            _.bindAll(this, 'typeChosen', 'render');
            if(opts) {
                if(opts.activeType) {
                    this.activeType = activeType;
                }
            }
        },

        events: {
            'click li': 'typeChosen'
        },

        typeChosen: function(event) {
            // event.currentTarget is the DOM element the handler was
            // bound to (the li in this case)
            this.activeType = event.currentTarget.id;
            this.trigger('content-type-change', this.activeType);
            this.render();
        },

        render: function() {
            var activeId = this.activeType;
            console.log(this.activeType);
            // cycle through nav elements, ensuring active class is in sync with this.activeType
            this.$('li').each(function() {
                var el = $(this);   // this is in the context of the jQuery .each
                if(el.attr('id') === activeId) {
                    el.addClass('active');
                }
                else {
                    el.removeClass('active');
                }
            });
            return this;
        }
    });

    var FeedView = Backbone.View.extend({

    });

    var MapFeedView = FeedView.extend({
        render: function() {
            this.$el.html('map!');
            return this;
        }
    });

    var ListFeedView = FeedView.extend({
        render: function() {
            this.$el.html('list!');
            return this;
        }
    });

    var FSBar = Backbone.View.extend({
        activeSorter: 0,
        activeFilter: 0,

        events: {
            'click .sorter1': function() { this.selectSorter(0); },
            'click .sorter2': function() { this.selectSorter(1); },
            // TODO: this won't be click. more like a radio button select
            'click .filter': 'selectFilter'
        },

        selectSorter: function(sorterIndex) {
            console.log('FSBar:selectSorter: ' + sorterIndex);
            this.activeSorter = sorterIndex;
            this.trigger('sorter', sorterIndex);
            this.render();
        },
        selectFilter: function() {
            console.log('FSBar:selectFilter');
            this.trigger('filter');
            this.render();
        },

        render: function() {
            // TODO: make sure active filter/sorter is displayed
            var html = 'sorter: ' + this.activeSorter;
            html += '<br/>filter: ' + this.activeFilter;
            this.$el.html(html);
            return this;
        }
    });


    /*
     * ContentFrame: container and event handler for actual feed view and
     * filter/sorter bar instances. In charge of responding to header events
     * that change the content/display mode of the feeds.
     *
     * Manages a FeedItemCollection for passing off to the current feed view.
     */
     var ContentFrame = Backbone.View.extend({

        feedView: null,
        fsBar: null,

        initialize: function() {
            _.bindAll(this, 'render', 'setFeedView', 'setFSBar');
            _.bindAll(this, 'setDisplayMode', 'runSearch', 'setContentType');
        },

        render: function() {
            if(this.feedView) {
                this.feedView.render();
            }
            if(this.fsBar) {
                this.fsBar.render();
            }
            return this;
        },

        setFeedView: function(mode) {
            this.feedView = new FeedView(this.collection);
        },

        updateFSBar: function() {
            if(this.fsBar) {
                this.fsBar.off();
            }
            this.fsBar = new FSBar();
            // TODO: turn off events on old FSBar
            this.fsBar.on('filter', this.runFilter, this);
            this.fsBar.on('sort', this.runSorter, this);
        },

        /*** External interface to change display/contents of feed ***/
        setDisplayMode: function(mode) {
            console.log('ContentFrame.setDisplayMode');
			console.log(arguments);
        },

        runSearch: function() {
            console.log('ContentFrame.runSearch:');
			console.log(arguments);
        },

        setContentType: function(type) {
            this.collection = new Scenable.FeedItemCollection();
            this.setFeedView();
            this.updateFSBar();
            this.collection.sync();
            console.log('ContentFrame.setContentType:');
        },

        /* Event infrastructure designed to support events from FSBar */
        events: {
            'filter': 'runFilter',
            'sort': 'runSorter'
        },

        runFilter: function() {
            console.log('ContentFrame.runFilter:');
			console.log(arguments);
        },

        runSorter: function() {
            console.log('ContentFrame.runSorter:');
			console.log(arguments);
        }

     });

    // Container view that creates subviews and handles event propagation between subviews
    Scenable.ExploreMasterView = new (Backbone.View.extend({
        initialize: function() {
            this.topBar = new TopBar({el: this.$('.top-bar')});
            this.navBar = new NavBar({el: this.$('.feed-nav')});
            this.contentFrame = new ContentFrame({el: this.$('.content')});

            // subscribe and pass off various subview events
            this.topBar.on('feed-mode-change', this.contentFrame.setDisplayMode, this);
            this.topBar.on('search', this.contentFrame.runSearch, this);
            this.navBar.on('content-type-change', this.contentFrame.setContentType, this);
        },

        render: function() {
            // simply render the 3 composite views
            this.topBar.render();
            this.navBar.render();
            this.contentFrame.render();
            return this;
        },

        displayFeed: function(type) {
            this.contentFrame.setContentType(type);

        }
    }))({el: $('#explore-frame')});
});
// $(function(){
//     Scenable = Scenable || {};
//     Scenable.views = Scenable.views || {};
//     Scenable.views.inst = Scenable.views.inst || {};

//     // holds collections of feed item models
//     Scenable.views.inst.exploreFrameView = new (Backbone.View.extend({
//         activeContentType: null,   // stores name of active section. corresponds to css class of button

//         feedView: null,         // should be a FeedView subclass instance
//         filterSortView: null,   // should be a FilterSortView instance

//         initialize: function() {
//             _.bindAll(this, 'render');
//         },

//         render: function() {
//             var contentEl = this.$('.content');
//             contentEl.html(this.feedView.render().el);
//             contentEl.append(this.filterSortView.render().el);
//             return this;
//         },

//         // a consequence of E1/E4/E5
//         setContentFrame: function(feedView) {
//             this.feedView = feedView;
//             this.feedView.className = 'feed-container';

//             this.filterSortView = feedView.getfsBar(); // can be null          
//             this.filterSortView.className = 'fs-container';

//             this.activeContentType = feedView.contentType;
//             // set 'active' class in correct nav item
//             this.$('nav li.active').removeClass('active');
//             if(this.activeContentType) {
//                 // find nav item with class matching the active content type
//                 var selector = 'nav li.' + this.activeContentType;
//                 this.$(selector).addClass('active');
//             }

//         }
//     }))({el: $('#explore-frame')});

//     // FilterSortView: bottom bar with sort/filter options
//     Scenable.views.FilterSortView = Backbone.View.extend({
//         initialize: function(opts) {
//             this.template = opts.template;
//             // sorters and filters are from FeedItemCollection instances
//             this.sorters = opts.sorters;
//             this.filters = opts.filters;
//         },

//         render: function() {
//             this.$el.html(this.template({
//                 filters: this.filters,
//                 sorters: this.sorters
//             }));
//             return this;
//         },

//         events: {
//             // TODO: hook up event handlers when sorters/filters chosen            
//         },

//         // E3
//         filterSelected: function(filter) {
//             // change order/status of collection items
//             console.log('filterSelected: '+filter);
//         },

//         // E2
//         sorterSelected: function(sorter) {
//             console.log('sorterSelected: '+sorter);
//             // change order/status of collection items
//         },

//         // E7
//         showFilters: function() {
//             console.log('showFilters');
//             // pop up filter selection box
//         }
//     });

//     /* Responsibilities of a FeedView:
//      *
//      *  contentType: a string to indicate the current section (corresponds to nav item classes)
//      *  template: compiled template
//      *
//      *  Expects a FeedItemCollection as it's model
//      */
//     Scenable.views.FeedView = Backbone.View.extend({
//         // override with a class name from a nav element
//         contentType: '',
//         template: null,

//         // Returns a FilterSortView instance corresponding to the FeedViewCollection parameters,
//         //  or null if not applicable
//         getfsBar: function() {
//             if(!this.collection.sorters && !this.collection.filters) {
//                 return null;
//             }
//             else {
//                 return new Scenable.views.FilterSortView({
//                     template: Scenable.utils.selectorToTemplate('#tpl-fs-basic'),
//                     sorters: this.collection.sorters,
//                     filters: this.collection.filters,
//                     className: 'hello'
//                 });
//             }
//         },

//         // show corresponding detail page for model with given id
//         showDetail: function(id) {
//             console.log('showDetail: '+id);
//             // TODO: fire some kind of context switching event with this.collection.get(id)
//         }
//     });

//     Scenable.views.PlaceListItem = Backbone.View.extend({
//         initialize: function(opts) {
//             this.template = opts.template;
//             _.bindAll(this, 'render');
//         },

//         render: function() {
//             this.$el.html(this.template(this.model.attributes));
//             return this;
//         }
//     });

//     Scenable.views.PlacesFeedList = Scenable.views.FeedView.extend({
//         contentType: 'places',
//         tagName: 'ol',

//         initialize: function(opts) {
//             _.bindAll(this, 'render');
//         },

//         render: function() {            
//             // create PlaceListItem views for each list item
//             var itemViews = this.collection.map(function(item) {
//                 return new Scenable.views.PlaceListItem({
//                     model: item,
//                     template: Scenable.utils.selectorToTemplate('#tpl-place-list-item'),
//                     tagName: 'li'
//                 }).render();
//             });

//             // replace the entire contents of the html
//             this.$el.empty();
//             _.each(itemViews, function(itemView){
//                 this.$el.append(itemView.el);
//             }, this);
//             return this;
//         }
//     });

//     Scenable.views.PlacesFeedMap = Scenable.views.FeedView.extend({
//         contentType: 'places'
//     });

// });
