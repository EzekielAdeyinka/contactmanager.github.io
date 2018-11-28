$('#openMenu').on('click', function(evt) {
	$('.content')
		.removeClass('no-animation') //disable initial animation
		.toggleClass('shrink');
});