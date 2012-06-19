$(function(){
    // main global namespace
    Scenable = {};

    Scenable.views = Scenable.views || {};
    Scenable.views.coreView = new (Backbone.View.extend({
        currentFocusView: null,
        // Closes currently focused view and sets the argument as the focus.
        // New view is expected to have a close() method.
        setNewFocus: function(view) {
            if(this.currentFocusView) {
                this.currentFocusView.close();
            }
            this.currentFocusView = view;
            this.render();
        },
        render: function() {
            if(this.currentFocusView) {
                console.log('rendering core');
                this.$el.html(this.currentFocusView.render().el);
            }
            return this;
        }
    }))({el: $('#app-view')});
});

var testView = Backbone.View.extend({
    initialize: function(label) {
        this.label = label || "";
    },
    render: function() {
        console.log('rendering testView');
        this.$el.html(this.label);
        return this;
    },
    close: function() {
        console.log('closing'+this.label);
    }
});

// $(function(){
//     // main global namespace
//     Scenable = {};

//     /*
//      *  Main Header Subview
//      *
//      *  The constant header on top of the main app view.
//      *
//      *  Currently does nothing, but this will change.
//     */
//     var mainHeader = new (Backbone.View.extend({
//         template: Handlebars.compile($('#template-main-header').html()),
//         render: function() {
//             // currently no template vbls. this will change.
//             this.$el.html(this.template());
//         }
//     }))({el: $('#header-view')});   // craziness: both ending the class def and instantiating it here
        
//     /*
//      *  Main Content Subview
//      *
//      *  Main app content. Mostly a global frame for inserting context-
//      *  specific content.
//     */
//     var mainContent = new Backbone.View({
//         el: $('#content-view')
//     });

//     /*
//      *  Main Settings Popup Subview
//      *
//      *  A static drawer usually hidden at the bottom of the app.
//     */
//     var mainSettingsDrawer = new Backbone.View({
//         el: $('#settings-drawer')
//     });

//     /*
//      * Main View
//      *
//      * This is the container for all the non-login action. Mostly just a
//      * wrapper to contain and manage the header, content, and settings drawer.
//      */
//     var mainView = new (Backbone.View.extend({
//         headerView: mainHeader,
//         contentView: mainContent,
//         settingsDrawer: mainSettingsDrawer,

//         initialize: function() {
//             _.bindAll(this, 'showDrawer', 'hideDrawer');
//         },
//         render: function() {
//             this.headerView.render();
//             this.contentView.render();
//             this.settingsDrawer.render();
//         },
//         showDrawer: function() {
//             this.settingsDrawer.$el.show();
//         },
//         hideDrawer: function() {
//             this.settingsDrawer.$el.hide();
//         }
//     }))({el: $('#main-view')});

//     /*
//      * Login View
//      *
//      * Login screen to greet logged out users. Currently just provides a
//      * "Log In" button that redirects to the main app.
//      */
//     var loginView = new (Backbone.View.extend({
//         initialize: function() {
//             _.bindAll(this, 'login');
//         },

//         events: {
//             'click button': 'login'
//         },

//         login: function() {
//             Scenable.appRouter.navigate("/", {trigger: true});
//         }
//     }))({el: $('#login-view')}).render();

//     /* Master App View
//      *
//      * Frame around entire app. Currently just manages which view
//      * is active: Login or Main.
//     */
//     Scenable.appView = new (Backbone.View.extend({
//         mainView: mainView,
//         loginView: loginView,
//         activeView: null,

//         initialize: function() {
//             // hide all views until told otherwise
//             this.mainView.$el.hide();
//             this.loginView.$el.hide();

//             // index.html purposefully hid this view until above setup could be done
//             this.$el.show();
//             _.bindAll(this, 'showLogin', 'showMain');
//         },

//         showLogin: function() {
//             if(this.activeView !== this.loginView) {
//                 this.mainView.$el.hide();
//                 this.loginView.$el.show();
//                 this.activeView = this.loginView;
//             }
//         },
//         showMain: function() {
//             if(this.activeView !== this.mainView) {
//                 this.loginView.$el.hide();
//                 this.mainView.$el.show();
//                 this.activeView = this.mainView;
//             }
//         },
//         render: function() {
//             this.mainView.render();
//             this.loginView.render();
//         }
//     }))({el: $('#app-view')});

//     // Main router. Likely to be split into subrouters later.
//     Scenable.appRouter = new (Backbone.Router.extend({
//         routes: {
//             "": 'main',
//             "login/": 'login'
//         },

//         login: function() {
//             Scenable.appView.showLogin();
//         },

//         main: function() {
//             // will need to check for authentication here
//             Scenable.appView.showMain();
//         }
//     }))();

//     // All done with setup -- time to launch the app
//     Backbone.history.start();
//     Scenable.appView.render();
// });