$(function(){
    // main global namespace
    Scenable = {};

    /* DISABLED CORE VIEW FOR THE MOMENT. BEST TO DRAFT NEW ONE GIVEN NEW EXPERIENCE. */

    // Scenable.CoreView = new (Backbone.View.extend({
    //     currentFocusView: null,
    //     // Closes currently focused view and sets the argument as the focus.
    //     // New view is expected to have a close() method.
    //     setNewFocus: function(view) {
    //         if(this.currentFocusView && this.currentFocusView !== view) {
    //             this.currentFocusView.$el.hide();
    //             this.currentFocusView.close();
    //         }
    //         this.currentFocusView = view;
    //         this.render();
    //         this.currentFocusView.$el.show();
    //     },
    //     render: function() {
    //         if(this.currentFocusView) {
    //             console.log('rendering core');
    //             this.$el.html(this.currentFocusView.render().el);
    //         }
    //         return this;
    //     }
    // }))({el: $('#app-view')});

    // Scenable.utils = Scenable.utils || {};
    // Scenable.utils.selectorToTemplate = function(selector) {
    //     return Handlebars.compile($(selector).html());
    // };
});

