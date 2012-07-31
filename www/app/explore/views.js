$(function(){
    Scenable = Scenable || {};
    Scenable.views = Scenable.views || {};
    Scenable.views.inst = Scenable.views.inst || {};

    // holds collections of feed item models
    Scenable.views.inst.exploreFrameView = new (Backbone.View.extend({
        activeContentType: null,   // stores name of active section. corresponds to css class of button

        feedView: null,         // should be a FeedView subclass instance
        filterSortView: null,   // should be a FilterSortView instance

        render: function() {
            // set 'active' class in correct nav item
            this.$('nav li.active').removeClass('active');
            if(this.activeContentType) {
                // find nav item with class matching the active content type
                var selector = 'nav li.' + this.activeContentType;
                this.$(selector).addClass('active');
            }

            // instead of replacing entire html, replace the two subdivs' html
            // NOTE: alternatively, could set subview's tag/class elements. this is 
            //  probably better if the entirety of "content" remains two empty divs 
            //  like this
            this.$('.feed-container').html(this.feedView.render().el);
            if(this.filterSortView) {
                this.$('.fs-container').html(this.filterSortView.render().el);
            }
            return this;
        },

        // a consequence of E1/E4/E5
        setContentView: function(feedView) {
            this.feedView = feedView;
            this.filterSortView = feedView.getFSView(); // can be null          
            this.activeContentType = feedView.contentType;
            // render here?
        }
    }))({el: $('#explore-frame')});

    // FilterSortView: bottom bar with sort/filter options
    Scenable.views.FilterSortView = Backbone.View.extend({
        initialize: function(opts) {
            this.template = opts.template;
            // sorters and filters are from FeedItemCollection instances
            this.sorters = opts.sorters;
            this.filters = opts.filters;
        },

        render: function() {
            this.$el.html(this.template({
                filters: this.filters,
                sorters: this.sorters
            }));
            return this;
        },

        events: {
            // TODO: hook up event handlers when sorters/filters chosen            
        },

        // E3
        filterSelected: function(filter) {
            // change order/status of collection items
            console.log('filterSelected: '+filter);
        },

        // E2
        sorterSelected: function(sorter) {
            console.log('sorterSelected: '+sorter);
            // change order/status of collection items
        },

        // E7
        showFilters: function() {
            console.log('showFilters');
            // pop up filter selection box
        }
    });

    /* Responsibilities of a FeedView:
     *
     *  contentType: a string to indicate the current section (corresponds to nav item classes)
     *  template: compiled template
     *
     *  Expects a FeedItemCollection as it's model
     */
    Scenable.views.FeedView = Backbone.View.extend({
        // override with a class name from a nav element
        contentType: '',
        template: null,

        // Returns a FilterSortView instance corresponding to the FeedViewCollection parameters,
        //  or null if not applicable
        getFSView: function() {
            if(!this.collection.sorters && !this.collection.filters) {
                return null;
            }
            else {
                return new Scenable.views.FilterSortView({
                    template: Scenable.utils.selectorToTemplate('#tpl-fs-basic'),
                    sorters: this.collection.sorters,
                    filters: this.collection.filters
                });
            }
        },

        // show corresponding detail page for model with given id
        showDetail: function(id) {
            console.log('showDetail: '+id);
            // TODO: fire some kind of context switching event with this.collection.get(id)
        }
    });

    Scenable.views.PlaceListItem = Backbone.View.extend({
        initialize: function(opts) {
            this.template = opts.template;
            _.bindAll(this, 'render');
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    Scenable.views.PlacesFeedList = Scenable.views.FeedView.extend({
        contentType: 'places',
        tagName: 'ol',

        initialize: function(opts) {
            _.bindAll(this, 'render');
        },

        render: function() {            
            // create PlaceListItem views for each list item
            var itemViews = this.collection.map(function(item) {
                return new Scenable.views.PlaceListItem({
                    model: item,
                    template: Scenable.utils.selectorToTemplate('#tpl-place-list-item'),
                    tagName: 'li'
                }).render();
            });

            // replace the entire contents of the html
            this.$el.empty();
            _.each(itemViews, function(itemView){
                this.$el.append(itemView.el);
            }, this);
            return this;
        }
    });

    Scenable.views.PlacesFeedMap = Scenable.views.FeedView.extend({
        contentType: 'places'
    });

});
