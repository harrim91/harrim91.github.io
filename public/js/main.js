$(document).ready(function() {
	new WOW().init();

	$('.navbar-collapse').on('click',function(e) {
		if( $(e.target).is('a') && 
				$(e.target).attr('class') != 'dropdown-toggle' ) {
			$(this).collapse('hide');
		}
	});

	$('.slick-portfolio').slick({
		arrows: true,
		prevArrow: $('.slick-prev'),
		nextArrow: $('.slick-next'),
		dots: false,
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 7000,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});


});