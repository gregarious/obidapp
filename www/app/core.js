$(function(){

    /* The following instantiated views will become members
       of higher-level singletons set below them.

       Many of their render methods are no-ops because their immediate DOM
       contents are fixed in index.html.
    */
    
    /*
     *  Main Header Subview
     *
     *  The constant header on top of the main app view.
     *
     *  Currently does nothing, but this will change. Content is preset.
    */
    var mainHeader = new (Backbone.View.extend({}))(
        {el: $('#header-view')});

    /*
     *  Main Content Subview
     *
     *  Main app content. Mostly a global frame for inserting context-
     *  specific content.
    */
    var mainContent = new (Backbone.View.extend({}))(
        {el: $('#content-view')});

    /*
     *  Main Settings Popup Subview
     *
     *  A static drawer usually hidden at the bottom of the app.
    */
    var mainSettingsDrawer = new (Backbone.View.extend({}))(
        {el: $('#settings-drawer')});

    /*
     * Main View
     *
     * This is the container for all the non-login action. Mostly just a
     * wrapper to contain and manage the header, content, and settings drawer.
     */
    var mainView = new (Backbone.View.extend({
        headerView: mainHeader,
        contentView: mainContent,
        settingsDrawer: mainSettingsDrawer,

        initialize: function() {
            _.bindAll(this, 'showDrawer', 'hideDrawer');
        },
        showDrawer: function() {
            this.settingsDrawer.$el.show();
        },
        hideDrawer: function() {
            this.settingsDrawer.$el.hide();
        }
    }))({el: $('#main-view')}).render();

    /*
     * Login View
     *
     * Login screen to greet logged out users. Currently just provides a
     * "Log In" button that redirects to the main app.
     */
    var loginView = new (Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'login');
        },

        events: {
            'click button': 'login'
        },

        login: function() {
            Scenable.appRouter.navigate("/", {trigger: true});
        }
    }))({el: $('#login-view')});

    /* Master App View
     *
     * Frame around entire app. Currently just manages which view
     * is active: Login or Main.
    */
    Scenable.appView = new (Backbone.View.extend({
        mainView: mainView,
        loginView: loginView,
        activeView: null,

        initialize: function() {
            // hide all views until told otherwise
            this.mainView.$el.hide();
            this.loginView.$el.hide();

            // index.html purposefully hid this view until above setup could be done
            this.$el.show();
            _.bindAll(this, 'showLogin', 'showMain');
        },

        showLogin: function() {
            if(this.activeView !== this.loginView) {
                this.mainView.$el.hide();
                this.loginView.$el.show();
                this.activeView = this.loginView;
            }
        },
        showMain: function() {
            if(this.activeView !== this.mainView) {
                this.loginView.$el.hide();
                this.mainView.$el.show();
                this.activeView = this.mainView;
            }
        }
    }))({el: $('#app-view')}).render();

    // Main router. Likely to be split into subrouters later.
    Scenable.appRouter = new (Backbone.Router.extend({
        routes: {
            "": 'main',
            "login/": 'login'
        },

        login: function() {
            Scenable.appView.showLogin();
        },

        main: function() {
            // will need to check for authentication here
            Scenable.appView.showMain();
        }
    }))();
});