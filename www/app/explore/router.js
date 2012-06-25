// requires explore/views.js, explore/models.js
$(function(){
    new (Backbone.Router.extend({
        routes: {
            'explore/places': 'placesList',
            'explore/places/list': 'placesList',
            'explore/places/map': 'placesMap'
        },

        placesList: function() {
            var items = new Scenable.models.FeedItemCollection();
            items.reset([{'name': 'p1'}, {'name': 'p2'}]);
            var view = new Scenable.views.PlacesFeedList({
                collection: items
            });
            Scenable.views.inst.exploreFrameView.setContentView(view);
            Scenable.views.inst.exploreFrameView.render();
            Scenable.views.inst.exploreFrameView.$el.show();
        },

        placesMap: function() {

        }
    }))();
});
