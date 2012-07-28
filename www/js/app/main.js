// helper function to be used in template to encode resource uri's embedded in links
Handlebars.registerHelper('uriEncode', function(string) {
	return encodeURIComponent(string);
});

// helper function to be used in template to encode resource uri's embedded in links
Handlebars.registerHelper('domainUri', function(string) {
	return 'http://127.0.0.1:8000' + string;
});

// Define controller after app load
// (note this isn't strictly necessary, but more complicated to maintain
//  otherwise. Keep this way unless we need performance gains.)
$(function(){
	Scenable.appController = (function(){

		var currentSubctrl = null;

		// converts a url querystring into a JS object
		var parseArgs = function(hashargs) {
			var args = {};
			_.each(hashargs.split("&"), function(clause){
				var match = /(.*)=(.*)/.exec(clause);
				if (match[1]) {
					args[match[1]] = match[2];
				}
			});
			return args;
		};

		// ensurs the given sub-controller is the active one. if not, activates it.
		var setActiveSubcontroller = function(subctrl) {
			if (currentSubctrl !== subctrl) {
				if (currentSubctrl) {
					currentSubctrl.deactivate();
					currentSubctrl.off();	// turn off ALL event handlers
				}
				currentSubctrl = subctrl;
				currentSubctrl.activate();
			}
		};

		// currently just uses the "type" arg to call setContent
		var handleRouteExplore = function(args) {
			var ctrl = Scenable.controllers.exploreController;
			if (currentSubctrl !== ctrl) {
				setActiveSubcontroller(ctrl);
				ctrl.on('ready',function(){console.log('sub ready');});
			}
			ctrl.setContent(args.type);
			ctrl.displayData('list');
		};

		var handleRouteDetail = function(args) {
			var ctrl = Scenable.controllers.detailController;
			if (currentSubctrl !== ctrl) {
				setActiveSubcontroller(ctrl);
			}
			ctrl.setContent(args.type,
				decodeURIComponent(args.id));
		};

		return {
			handleRoute: function(urlString) {
				var urlObj = $.mobile.path.parseUrl(urlString);
				var match = /^\#(.+)\?(.*)/.exec(urlObj.hash);
				if (match) {
					var page = match[1];
					var args = parseArgs(match[2]);
					if (page === 'explore') {
						handleRouteExplore(args);
					}
					else if (page === 'single') {
						handleRouteDetail(args);
					}
					else {
						console.log('Warning: unregistered controller "' + page + '" requested.');
					}
					// if no controller registered, no-op
				}
				else {
					console.log('Warning: invalid hash "' + urlString + '" requested.');
				}
			}
		};

	})();

	$(document).bind( "pagebeforechange", function(e, data) {
		if (typeof data.toPage === "string") {
			Scenable.appController.handleRoute(data.toPage);
		}
	});
});