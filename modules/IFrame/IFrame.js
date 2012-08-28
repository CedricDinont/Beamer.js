var IFrameModule = function() {
	
	this.beforeCreatingSlides = function() {
		
	}
	
	this.onPresentationLoad = function() {
		// Empty	
	}
	
	this.onShowSlide = function(newSlide, oldSlide) {
			console.log("Iframe module", newSlide);
			$("iframe", newSlide.domElement).each(function() {
				console.log("found iframe");
				if (($(this).attr("deferred-src") != undefined)
					&& ($(this).attr("src") == undefined)) {
					console.log("Loading iframe");
					$(this).attr("src", $(this).attr("deferred-src"));
				}
			});
	}
	
	this.onLeaveSlide = function(newSlide, oldSlide) {
		// Empty
	}
}

