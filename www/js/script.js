// Copypasta alert: 
function initialize() {
	var myOptions = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
}

$(document).ready(function(){
	$('.place-specials, .place-events').hide();
	console.log('adsaasdasdasd');
	// Hide/show single place sections
	var pages = ['.place-info', '.place-events', '.place-specials'];
	$.each(pages, function(i, id) {
		$('li.'+id).click(function() {
			$('.detail-nav').delay(200).hide();
			$(id+'.detail-nav li').fadeIn(200);
			$('.detail-nav li').removeClass('active');
			$(this).addClass('active');
		});
	});

});