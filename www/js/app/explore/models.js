define([],function(){
    return {
        FeedItemCollection: Backbone.Collection.extend({
            sorters: [
                        {'label': 's1'},
                        {'label': 's2'}
                     ],
            filters: [
                        {'label': 'f1'}
                     ]
         })
    };
});