Scenable = {
	constants: {
		MODE: 'DEBUG',
		SITEURL: 'http://www.scenable.com'
	}
};

moment.fn.formatRange = function(start, end) {
	var now = moment();
	if (now.year() < start.year()) {
		start = start.format('MMM D, YYYY, H:mm');
	}
	else {
		start = start.format('MMM D, H:mm');
	}
	if (end.diff(start, 'days') < 1) {
		end = end.format('H:mm');
	}
	else {
		end = end.format('MMM D');
	}
};

// custome date formatting overrides
moment.calendar.sameElse = "M/DD/YYYY";
moment.longDateFormat.LLL = "MMMM D YYYY, LT";

// create a paths alias for the templates dir
requirejs.config({
	paths: {
		'templates': '../../templates'
	}
});

requirejs(['explore/controller', 'detail/controller'], function(exploreCtrl, detailCtrl) {
	
	// global overrides for Backbone sync functions
	var jsonpSync = function(method, model, options) {
		var opts = options || {};
		opts.dataType = "jsonp";
		return Backbone.sync(method, model, opts);
	};

	Backbone.Model.prototype.sync = jsonpSync;
	Backbone.Collection.prototype.sync = jsonpSync;

	// helper to create domain-absolute urls
	Handlebars.registerHelper('domainUri', function(string) {
		return Scenable.constants.SITEURL + string;
	});

	// various date-formatting helpers for Handlebars
	Handlebars.registerHelper('formatArticleDate', function(isoDate) {
		var date = moment(isoDate);
		// if date is more than 2 moinths ago, add the year
		if (date < moment().subtract('months', 2)) {
			return date.format('MMM D, YYYY');
		}
		else {
			return date.format('MMM D');
		}
		
		var expires = moment(isoDate);
		var human = expires.calendar().split(' at')[0];

		// get the tense correct
		if (expires < moment()) {
			return 'Expired ' + human;
		}
		else {
			return 'Expires ' + human;
		}
	});


	Handlebars.registerHelper('formatExpires', function(isoDate) {
		var expires = moment(isoDate);
		var human = expires.calendar().split(' at')[0];

		// get the tense correct
		if (expires < moment()) {
			return 'Expired ' + human;
		}
		else {
			return 'Expires ' + human;
		}
	});

	Handlebars.registerHelper('formatDateRange', function(isoStart, isoEnd) {
		var start = moment(isoStart),
			end = moment(isoEnd),
			now = moment();

		if (start < now && now < end) {
			return 'ends ' + end.calendar(false);
		}
		else if (end.diff(start,'days') < 1) {
			return start.calendar(false) + ' - ' + end.format('LT');
		}
		else {
			return start.calendar(false) + ' - ' + end.calendar(false);
		}
	});

	Handlebars.registerHelper('formatLongDate', function(isoDate) {
		return moment(isoDate).format('LLL');
	});

	Handlebars.registerHelper('formatSimple', function(isoDate) {
		return moment(isoDate).format('M/D/YY');
	});

	Handlebars.registerHelper('getStaticMap', function(lat, lng) {
		return "http://maps.googleapis.com/maps/api/staticmap?markers=" +
				lat + "," + lng + "&zoom=15&size=300x100&sensor=true&" +
				"key=AIzaSyBs7pwJR2UazpCXdmAdcCnl0jjn1ML9Du0";
	});

	window.app = new (Backbone.Router.extend({
		states: {
			explore: exploreCtrl,
			detail: detailCtrl
		},
		currentState: null,

		routes: {
			"": 'index',
			"app/:resource/:id": 'detailPage',
			"app/:resource": 'exploreFeed'
		},

		index: function() {
			this.navigate("app/now", {trigger: true});
		},

		pageTransition: function(toState) {
			if (this.currentState === toState) {
				return;
			}
			if (this.currentState) {
				this.currentState.deactivate();
			}
			this.currentState = toState;
			toState.activate();
			// no rules restricting transition

		},

		exploreFeed: function(resourceType) {
			console.log('+ appController.exploreFeed: ' + resourceType);
			this.pageTransition(this.states.explore);
			this.states.explore.setState({
				resourceType: resourceType
			});
		},

		detailPage: function(resourceType, objectId) {
			console.log('+ appController.detailPage: ' + resourceType + ',' + objectId);
			this.pageTransition(this.states.detail);
			this.states.detail.setState({
				resourceType: resourceType,
				objectId: objectId
			});
		}
	}))();

	$.ajaxSetup({
		timeout: 5000
	});

	// after DOM load, initialze and run the app
	$(function(){
		// hide all DOM to begin with
		$('#panel-explore').hide();
		$('#panel-detail').hide();

		window.app.states.explore.setState({
			displayMode: 'list'
		}, false);

		Backbone.history.start();
	});
});