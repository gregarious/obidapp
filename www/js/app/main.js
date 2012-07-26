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
		var pageCtrlMap = {
			'explore': Scenable.controllers.ExploreController,
			'single': Scenable.controllers.DetailController
		};

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
				}
				currentSubctrl = subctrl;
				currentSubctrl.activate();
			}
		};

		return {
			handleRoute: function(urlString) {
				var urlObj = $.mobile.path.parseUrl(urlString);
				var match = /^\#(.+)\?(.*)/.exec(urlObj.hash);
				if (match) {
					var page = match[1];
					var args = parseArgs(match[2]);
					subctrl = pageCtrlMap[page];
					if (subctrl) {
						setActiveSubcontroller(subctrl);
						subctrl.act(args);
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