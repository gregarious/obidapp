/* Assumes jQuery, Underscore, Backbone are defined */
define(['explore/models', 'text!/../templates/topbar.html', 'text!/../templates/navbar.html'],
function(models, topBarTpl, navBarTpl){
    var FeedViewmodel = Backbone.Model.extend({

    });

    // Top bar View class to handle top button clicks
    // Linked to a Viewmodel with the following interface:
    //  Attributes:
    //      - displayMode: string with current feed display type ('map' or 'list')
    //  Functions:
    //      - toggleDisplayMode(): when top bar display mode button chosen
    //      - requestSearch(): when top bar request button chosen
    var TopBar = Backbone.View.extend({
        template: Handlebars.compile(topBarTpl),
        initialize: function() {
            _.bindAll(this, 'render', 'modeClicked', 'searchClicked');
            this.model.on('change:displayMode', this.render, this); // render will handle correct icon display
        },

        events: {
            'click .mode-button': 'modeClicked',
            'click .search-button': 'searchClicked'
        },

        // render ensures correct display mode icon displayed
        render: function() {
            this.$el.html(this.template());
            var mode = this.model.get('displayMode');
            if(mode === 'map') {
                this.$('.mode-button-list').hide();
                this.$('.mode-button-map').show();
            }
            else {  // mode is list
                this.$('.mode-button-map').hide();
                this.$('.mode-button-list').show();
            }
            return this;
        },

        modeClicked: function() {
            this.model.toggleDisplayMode();
        },
        searchClicked: function() {
            this.model.requestSearch();
        }
    });

    // Nav bar View class to handle top button clicks
    // Linked to a Viewmodel with the following interface:
    //  Attributes:
    //      - contentType: string with current content type (linked to nav icon ids)
    //  Functions:
    //      - typeChosen(type): when any content button is chosen
    var NavBar = Backbone.View.extend({
        template: Handlebars.compile(navBarTpl),
        initialize: function() {
            _.bindAll(this, 'render', 'itemClicked');
            if(this.model.contentType) {
                this.setActiveItem(this.model.contentType);
            }
            this.model.on('change:contentType', this.render, this);
        },

        // render ensures active icon's li has an "active" class
        render: function() {
            this.$el.html(this.template());
            var activeId = this.model.get('contentType');
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
        },

        // UI and VM event handling
        events: {
            'click li': 'itemClicked'
        },

        // called when nav menu item is clicked
        itemClicked: function(event) {
            // event.currentTarget is the DOM element the handler was
            // bound to (the li in this case)
            this.model.typeChosen(event.currentTarget.id);
        }
    });

    var ExploreViewmodel = Backbone.Model.extend({
        defaults: {
            displayMode: null,
            contentType: null
        },

        // overridden constructor for Viewmodels.
        //  - eventHandler: object implementing Backbone Events
        //  - viewOpts: options to be passed thru to the resulting View
        //  - modelAttrs: initial values for this Model's attributes (these
        //                are passed thru to the parent Backbone.Model ctor)
        constructor: function(eventHandler, viewOpts, modelAttrs) {
            // TODO: move some of this to a Viewmodel ctor/initializer
            this.viewOpts = viewOpts;
            this.handler = eventHandler;
            var attrs = modelAttrs || {};
            Backbone.Model.apply(this, attrs);
        },

        initialize: function() {
            _.bindAll(this, 'toggleDisplayMode', 'typeChosen', 'requestSearch');

            // Define the 3 subViews:

            // TopBar interacts with displayMode, toggleDisplayMode, and requestSearch
            this.topBar = new TopBar({
                tagName: 'section',
                className: 'top-bar',
                model: this
            });

            // NavBar interacts with contentType and typeChosen
            this.navBar = new NavBar({
                tagName: 'nav',
                className: 'explore-menu',
                model: this
            });

            this.contentPane = new Backbone.View({className: 'content'});

            // group the subviews for the container view to iterator over when rendering
            var subViews = [this.topBar, this.navBar, this.contentPane];

            // TODO: get all of this set up in a Viewmodel ctor/initializer
            // TODO: allow better customization of rendered el layout. e.g. Need to wrap first two views in a <header>. maybe outer template?
            // instantiate a simple view that appends the html of each subView to it's el
            this.view = new (Backbone.View.extend({
                render: function() {
                    this.$el.html('');
                    _.each(subViews, function(v) {
                        this.$el.append(v.render().el);
                    }, this);
                    return this;
                }
            }))(this.viewOpts);     // these viewOpts are from the Viewmodel constructor
        },

        setFeedView: function(feedOpts) {
            if(feedOpts.displayMode) {
                this.set('displayMode', feedOpts.displayMode);
            }
            if(feedOpts.contentType) {
                this.set('contentType', feedOpts.contentType);
            }
        },

        activate: function() {
            this.render().$el.show();
        },

        render: function() {
            this.view.render();
            return this.view;
        },

        toggleDisplayMode: function() {
            if(this.get('displayMode') === 'map') {
                this.set('displayMode', 'list');
            }
            else {
                this.set('displayMode', 'map');
            }
        },

        typeChosen: function(contentType) {
            this.set('contentType', contentType);
        },

        requestSearch: function() {
            console.log('search requested');
        }
    });

    // Module contents returned
    return {
        'ExploreViewmodel': ExploreViewmodel
    };
});

////////////////////////////////////////////////////////////////////

//////////////////////////////////////
//--------------- V2 ---------------//
//////////////////////////////////////

// $(function(){
//     Scenable = Scenable || {};

//     /*** VIEW CLASS DEFINITIONS ***/
//     /*
//      * TopBar View: Static (mostly) top bar in charge of handing off explore
//      * mode changing and searching events.
//      * - One bit of dynamic content is present for the view: the username in
//      *   the center. Instead of complicating things by forcing a template, a simple
//      *   function call will update the text directly in the DOM.
//      *
//      * Events to subscribe to:
//      * - feed-mode-change (args: new mode name)
//     */
//     var TopBar = Backbone.View.extend({
//         feedModes: ['list', 'map'],
//         currModeIndex: 0,  // default to first array element
//         centerText: '',

//         // supported opts:
//         // - centerText
//         // - modeIndex (0 for list, 1 for map)
//         initialize: function(opts) {
//             _.bindAll(this, 'searchChosen', 'setCenterText', 'cycleFeedMode', 'render');
//             if(opts) {
//                 if(opts.centerText) {
//                     this.centerText = opts.centerText;
//                 }
//                 if(opts.centerText) {
//                     this.modeIndex = opts.modeIndex;
//                 }
//             }
//         },

//         setCenterText: function(text, render) {
//             this.centerText = text;
//             if(_.isUndefined(render) || render) {
//                 this.render();
//             }
//         },

//         setModeIndex: function(idx, render) {
//             this.modeIndex = idx;
//             if(_.isUndefined(render) || render) {
//                 this.render();
//             }
//         },

//         render: function() {
//             var nextMode = this.feedModes[(this.currModeIndex + 1) % this.feedModes.length];
//             // switch this to an icon setting (maybe conditional in a template?
//             this.$('.mode-button').html(nextMode);
//             this.$('.current-user').text(this.centerText);
//             return this;
//         },

//         events: {
//             'click .mode-button': 'cycleFeedMode',
//             'click .search-button': 'searchChosen'
//         },

//         searchChosen: function(event) {
//             // TODO: need to grab the query
//             var query = 'query';
//             this.trigger('search', query);
//         },

//         cycleFeedMode: function() {
//             this.currModeIndex = (this.currModeIndex + 1) % this.feedModes.length;
//             this.trigger('feed-mode-change', this.feedModes[this.currModeIndex]);
//             this.render();
//         }
//     });

//     /*
//      * NavBar View: Static nav bar in charge of handing off feed type change
//      * events
//     */
//     var NavBar = Backbone.View.extend({
//         activeType: 'now',

//         initialize: function(opts) {
//             _.bindAll(this, 'typeChosen', 'render');
//             if(opts) {
//                 if(opts.activeType) {
//                     this.activeType = activeType;
//                 }
//             }
//         },

//         events: {
//             'click li': 'typeChosen'
//         },

//         typeChosen: function(event) {
//             // event.currentTarget is the DOM element the handler was
//             // bound to (the li in this case)
//             this.activeType = event.currentTarget.id;
//             this.trigger('content-type-change', this.activeType);
//             this.render();
//         },

//         render: function() {
//             var activeId = this.activeType;
//             console.log(this.activeType);
//             // cycle through nav elements, ensuring active class is in sync with this.activeType
//             this.$('li').each(function() {
//                 var el = $(this);   // this is in the context of the jQuery .each
//                 if(el.attr('id') === activeId) {
//                     el.addClass('active');
//                 }
//                 else {
//                     el.removeClass('active');
//                 }
//             });
//             return this;
//         }
//     });

//     var FeedView = Backbone.View.extend({

//     });

//     var MapFeedView = FeedView.extend({
//         render: function() {
//             this.$el.html('map!');
//             return this;
//         }
//     });

//     var ListFeedView = FeedView.extend({
//         render: function() {
//             this.$el.html('list!');
//             return this;
//         }
//     });

//     var FSBar = Backbone.View.extend({
//         activeSorter: 0,
//         activeFilter: 0,

//         events: {
//             'click .sorter1': function() { this.selectSorter(0); },
//             'click .sorter2': function() { this.selectSorter(1); },
//             // TODO: this won't be click. more like a radio button select
//             'click .filter': 'selectFilter'
//         },

//         selectSorter: function(sorterIndex) {
//             console.log('FSBar:selectSorter: ' + sorterIndex);
//             this.activeSorter = sorterIndex;
//             this.trigger('sorter', sorterIndex);
//             this.render();
//         },
//         selectFilter: function() {
//             console.log('FSBar:selectFilter');
//             this.trigger('filter');
//             this.render();
//         },

//         render: function() {
//             // TODO: make sure active filter/sorter is displayed
//             var html = 'sorter: ' + this.activeSorter;
//             html += '<br/>filter: ' + this.activeFilter;
//             this.$el.html(html);
//             return this;
//         }
//     });


//     /*
//      * ContentFrame: container and event handler for actual feed view and
//      * filter/sorter bar instances. In charge of responding to header events
//      * that change the content/display mode of the feeds.
//      *
//      * Manages a FeedItemCollection for passing off to the current feed view.
//      */
//      var ContentFrame = Backbone.View.extend({

//         feedView: null,
//         fsBar: null,

//         initialize: function() {
//             _.bindAll(this, 'render', 'setFeedView', 'setFSBar');
//             _.bindAll(this, 'setDisplayMode', 'runSearch', 'setContentType');
//         },

//         render: function() {
//             if(this.feedView) {
//                 this.feedView.render();
//             }
//             if(this.fsBar) {
//                 this.fsBar.render();
//             }
//             return this;
//         },

//         setFeedView: function(mode) {
//             this.feedView = new FeedView(this.collection);
//         },

//         updateFSBar: function() {
//             if(this.fsBar) {
//                 this.fsBar.off();
//             }
//             this.fsBar = new FSBar();
//             // TODO: turn off events on old FSBar
//             this.fsBar.on('filter', this.runFilter, this);
//             this.fsBar.on('sort', this.runSorter, this);
//         },

//         /*** External interface to change display/contents of feed ***/
//         setDisplayMode: function(mode) {
//             console.log('ContentFrame.setDisplayMode');
// 			console.log(arguments);
//         },

//         runSearch: function() {
//             console.log('ContentFrame.runSearch:');
// 			console.log(arguments);
//         },

//         setContentType: function(type) {
//             this.collection = new Scenable.FeedItemCollection();
//             this.setFeedView();
//             this.updateFSBar();
//             this.collection.sync();
//             console.log('ContentFrame.setContentType:');
//         },

//         /* Event infrastructure designed to support events from FSBar */
//         events: {
//             'filter': 'runFilter',
//             'sort': 'runSorter'
//         },

//         runFilter: function() {
//             console.log('ContentFrame.runFilter:');
// 			console.log(arguments);
//         },

//         runSorter: function() {
//             console.log('ContentFrame.runSorter:');
// 			console.log(arguments);
//         }

//      });

//     // Container view that creates subviews and handles event propagation between subviews
//     Scenable.ExploreMasterView = new (Backbone.View.extend({
//         initialize: function() {
//             this.topBar = new TopBar({el: this.$('.top-bar')});
//             this.navBar = new NavBar({el: this.$('.feed-nav')});
//             this.contentFrame = new ContentFrame({el: this.$('.content')});

//             // subscribe and pass off various subview events
//             this.topBar.on('feed-mode-change', this.contentFrame.setDisplayMode, this);
//             this.topBar.on('search', this.contentFrame.runSearch, this);
//             this.navBar.on('content-type-change', this.contentFrame.setContentType, this);
//         },

//         render: function() {
//             // simply render the 3 composite views
//             this.topBar.render();
//             this.navBar.render();
//             this.contentFrame.render();
//             return this;
//         },

//         displayFeed: function(type) {
//             this.contentFrame.setContentType(type);

//         }
//     }))({el: $('#explore-frame')});
// });

////////////////////////////////////////////////////////////////////

//////////////////////////////////////
//--------------- V1 ---------------//
//////////////////////////////////////

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
