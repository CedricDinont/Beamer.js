BackForwardControlModule = function(presentation) {
	
	this.presentation = presentation;
	
	this.backControl = $("#back-control");
	this.forwardControl = $("#forward-control");
	
	this.onShowSlide = function(newSlide, oldSlide) {
		this.backControl.attr('disabled', newSlide.slideNumber == 1);
		this.forwardControl.attr('disabled', newSlide.slideNumber == this.presentation.slides.length - 1);
	}
	
	var self = this;
	this.backControl.click(function() { 
		self.presentation.back(); 
	});
	this.forwardControl.click(function() { 
		self.presentation.forward(); 
	});
}
