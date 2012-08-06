define(["text!templates/single-place.html", "text!templates/single-event.html", "text!templates/single-special.html"],
	function(placeTpl, eventTpl, specialTpl){
		var BaseDetailView = Backbone.View.extend({
			template: null,

			events: {
				'click .button-back': 'backClicked'
			},

			initialize: function(options) {
				_.bindAll(this, 'render');
			},

			render: function() {
				// TODO: bad inline, bad
				var topbar = '<div class="topbar">'+
				'<nav id="top-bar-single">'+
				'<a class="button-back" href="#"><img src="http://localhost/obidapp/www/img/assets/back-btn.png"></a>'+
				'<h1>{{name}}</h1></nav></div>';
				this.$el.html(topbar);
				if (this.template) {
					this.$el.append(this.template(this.model.attributes));
				}
				return this;
			},

			backClicked: function(e) {
				console.log('backClicked');
				e.preventDefault();
				this.trigger('back');
			}
		});

		var exports = {
			PlaceDetail: BaseDetailView.extend({
				template: Handlebars.compile(placeTpl)
			}),
			EventDetail: BaseDetailView.extend({
				template: Handlebars.compile(eventTpl)
			}),
			SpecialDetail: BaseDetailView.extend({
				template: Handlebars.compile(specialTpl)
			})
		};
		return exports;
	}
);