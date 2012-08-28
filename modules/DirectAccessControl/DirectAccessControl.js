DirectAccessControlModule = function(presentation) {
	
	this.presentation = presentation;
	
	this.slideCountText = $("#slide-count");
	this.currentSlideNumberTextInput = $("#current-slide-number");
	this.goFullScreenButton = $("#go-fullscreen-button");
	
	this.onPresentationLoad = function() {
		this.slideCountText.text(this.presentation.slides.length - 1);
	}
	
	this.onShowSlide = function(newSlide, oldSlide) {
		this.currentSlideNumberTextInput.attr('value', newSlide.slideNumber);
	}
	
	var self = this;
	this.goFullScreenButton.click(function() { 
		self.presentation.goFullscreen(); 
	});
	this.currentSlideNumberTextInput.on("change", function() {
		self.presentation.setCursor(this.value);
	});
}
