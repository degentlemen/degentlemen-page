(function($) {
	$(function() {
		$('[data-event-category][data-event-action]').click(function() {
			ga('send', 'event', $(this).attr('data-event-category'), $(this).attr('data-event-action'));
		});
		$('[data-event-goal]').click(function() {
			ga('send', 'pageview', $(this).attr('data-event-goal'));
		;});
		$('[data-load-goal]').each(function() {
			ga('send', 'pageview', $(this).attr('data-load-goal'));
		;});
	});
})(jQuery);