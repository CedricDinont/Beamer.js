TouchScreenControlModule = function(presentation) {

	this.presentation = presentation;

	this.setupTouchEvents = function() {
		var orgX, newX;
		var tracking = false;

		var db = document.body;
		db.addEventListener("touchstart", start.bind(this), false);
		db.addEventListener("touchmove", move.bind(this), false);

		function start(aEvent) {
			aEvent.preventDefault();
			tracking = true;
			orgX = aEvent.changedTouches[0].pageX;
		}

		function move(aEvent) {
			if (!tracking)
				return;
			
			newX = aEvent.changedTouches[0].pageX;
			if (orgX - newX > 100) {
				tracking = false;
				this.presentation.forward();
			} else {
				if (orgX - newX < -100) {
					tracking = false;
					this.presentation.back();
				}
			}
		}
	}
	
	this.setupTouchEvents();
}
