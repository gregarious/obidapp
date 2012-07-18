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
            // TODO: move some of this to a base class Viewmodel ctor/initializer
            this.handler = eventHandler;
            var attrs = modelAttrs || {};
            Backbone.Model.apply(this, attrs);
        },

        initialize: function() {
            _.bindAll(this, 'spawnView', 'toggleDisplayMode', 'typeChosen', 'requestSearch');
        },

        // since views carry no state, simple ones should be lightweight and easily spawnable given a viewmodel
        // these options are passed on directly to the View ctor
        spawnView: function(options) {
            var mainView = new Backbone.View(options);
            // Define the 3 subViews:
            // TopBar interacts with displayMode, toggleDisplayMode, and requestSearch
            var topBar = new TopBar({
                el: mainView.$('.top-bar'),
                model: this
            });

            // NavBar interacts with contentType and typeChosen
            var navBar = new NavBar({
                el: mainView.$('.explore-menu'),
                model: this
            });

            var contentPane = new Backbone.View({
                el: mainView.$('.content'),
                render:function(){this.$el.html('content!');}
            });

            mainView.render = function() {
                // all subviews are already bound to DOM elements. just render them.
                topBar.render();
                navBar.render();
                contentPane.render();
                return this;
            };
            _.bind(mainView.render, mainView);  // ensures "this" is always correct inside render

            return mainView;
        },

        setFeedView: function(feedOpts) {
            if(feedOpts.displayMode) {
                this.set('displayMode', feedOpts.displayMode);
            }
            if(feedOpts.contentType) {
                this.set('contentType', feedOpts.contentType);
            }
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
