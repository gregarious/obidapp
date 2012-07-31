$(function(){
    Scenable = Scenable || {};
    Scenable.models = Scenable.models || {};

    Scenable.models.FeedItemCollection = Backbone.Collection.extend({
        sorters: [
                    {'label': 's1'},
                    {'label': 's2'}
                 ],
        filters: [
                    {'label': 'f1'}
                 ]
    });

});

