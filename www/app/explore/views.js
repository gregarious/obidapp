$(function(){
    Scenable = Scenable || {};

    /*** VIEW CLASS DEFINITIONS ***/
    /* 
     * TopBar View: Static (mostly) top bar in charge of handing off explore
     * mode changing and searching events.
     * - One bit of dynamic content is present for the view: the username in
     *   the center. Instead of complicating things by forcing a template, a simple
     *   function call will update the text directly in the DOM.
    */
    var TopBar = Backbone.View.extend({
        events: {
            'click .mode-button': 'modeChosen',
            'click .search-button': 'searchChosen'
        },

        // supported opts:
        // - centerText
        initialize: function(opts) {
            _.bindAll(this, 'modeChosen', 'searchChosen', 'setCenterText');
            if(opts) {
                this.setCenterText(opts.centerText || '');
            }
        },

        modeChosen: function() {
            console.log('TopBar.modeChosen:');
			console.log(arguments);
        },

        searchChosen: function() {
            console.log('TopBar.searchChosen:');
			console.log(arguments);
        },

        setCenterText: function(text) {
            this.$('.current-user').text(text);
        }
    });

    /* 
     * NavBar View: Static nav bar in charge of handing off feed type change
     * events
    */
    var NavBar = Backbone.View.extend({
        events: {
            'click li': 'typeChosen'
        },

        initialize: function(opts) {
            _.bindAll(this, 'typeChosen');
        },

        typeChosen: function(event) {
            // event.currentTarget is the DOM element the handler was 
            // bound to (the li in this case)
            console.log('NavBar.typeChosen: ' + event.currentTarget.id);
            // TODO: change li with active class
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
        events: {
            // top bar events
            'set-display-mode': 'setDisplayMode',
            'run-search': 'runSearch',
            
            // feed bar events
            'set-content-type': 'setContentType',

            // fs bar events (generated from internally-managed FSBar View)
            'filter': 'runFilter',
            'sort': 'runSorter'
        },

        initialize: function() {
            _.bindAll(this, 'setDisplayMode', 'runSearch', 'setContentType', 'runFilter', 'runSorter', 'render');
            this.feedView = null;
            this.fsView = null;
        },

        render: function() {
            if(this.feedView) {
                this.feedView.render();
            }
            if(this.fsView) {
                this.fsView.render();
            }
            return this;
        },

        /*** Event handlers ***/
        setDisplayMode: function() {
            console.log('ContentFrame.setDisplayMode:');
			console.log(arguments);
        },

        runSearch: function() {
            console.log('ContentFrame.runSearch:');
			console.log(arguments);
        },

        setContentType: function() {
            console.log('ContentFrame.setContentType:');
			console.log(arguments);
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

    Scenable.ExploreMasterView = new (Backbone.View.extend({
        initialize: function() {
            this.topBar = new TopBar({el: this.$('.top-bar')});
            this.navBar = new NavBar({el: this.$('.feed-nav')});
            this.contentFrame = new ContentFrame({el: this.$('.content')});
        },

        render: function() {
            // simply render the 3 composite views
            this.topBar.render();
            this.navBar.render();
            this.contentFrame.render();
            return this;
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

//             this.filterSortView = feedView.getFSView(); // can be null          
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
//         getFSView: function() {
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
