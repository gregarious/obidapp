/* Main entrypoint for app. Assumes jQuery and Backbone are defined */
define(['core/router'],
function(Router) {
    $(function(){
        window.app = new Router();
        Backbone.history.start();
    });
});