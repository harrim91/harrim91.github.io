$(document).ready(function() {
	new WOW().init();

	$('.navbar-collapse').on('click',function(e) {
		if( $(e.target).is('a') && 
				$(e.target).attr('class') != 'dropdown-toggle' ) {
			$(this).collapse('hide');
		}
	});

	
});