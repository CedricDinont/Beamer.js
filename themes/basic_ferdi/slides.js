$(function(){
	$('#table-of-contents').after('<div id="hide-table-of-contents"></div>');
	
	(function() {
		var show = true;
		$('#hide-table-of-contents').click(function() {
			show = !show;
			if(show) {
				$('#table-of-contents').fadeIn(500);
				$('#slides-container').css('width', '620px');
				$('#hide-table-of-contents').css('left', '128px');
				$('#hide-table-of-contents').css('background-position', 'left top');
			} else {
				$('#table-of-contents').fadeOut(500, function() {
					$('#slides-container').css('width', '780px');
					$('#hide-table-of-contents').css('left', 0);
					$('#hide-table-of-contents').css('background-position', 'right top');				
				});
			}
		});
	})();
});