/* File for all common Backbone code involved in feeds */

/*
 *  Feed Nav Subview
 *
 *  The constant feed header on top of the main app view.
 *
 *  Currently does nothing, but this will change.
*/

$(function(){
    var FeedView = Backbone.View.extend({
        template: Handlebars.compile($('template-feed').html()),

        initialize: function(){
            /* Define the 3 subviews that are part of every feed:
               - navView: top nav/search bar
               - contentView: feed list/map content
               - filterView: botton filter buttons
            */
            this.navView = new (Backbone.View.extend({
                // nav-specific controls here
            }))({el: this.$('.feed-nav')});
            
            contentView = new (Backbone.View.extend({
                // content-specific controls here
            }))({el: this.$('.feed-content')});

            filterView = new (Backbone.View.extend({
                // filter-specific controls here
            }))({el: this.$('.feed-filter')});
        },

        render: function() {
            this.navView.render();
            this.contentView.render();
            this.filterView.render();
            return this;
        }
    });

    // set up new router functions
    Scenable.appRouter.route('places/', 'placesFeed', function(){
        console.log('triggering feed:activate');
        this.trigger('feed:activate', new FeedView());
    });
});