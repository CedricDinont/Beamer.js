var videoModule = null;

VideoModule = function(presentation) {

	this.presentation = presentation;
	
	this.beforeCreatingSlides = function() {
		videoModule = this;
	}
	
	this.onPresentationLoad = function() {
		this.createVideoContainer();
	}
	
	this.onShowSlide = function(newSlide, oldSlide) {

	}
	
	this.onLeaveSlide = function(newSlide, oldSlide) {
		// Empty
	}
	
	this.createVideoContainer = function () {
		this.videoTime = 0;
		this.endTime = -1;
		
		console.log("Creating video container");
		this.container = $(document.createElement("div"));
		this.container.attr('id', "video-container");
		this.container.attr('class', "video-container");
		this.videoElement = $(document.createElement("video"));
		//this.videoElement.attr("controls", "true");
		this.videoElement.attr("width", "640");
		this.videoElement.attr("height", "480");
		this.container.append(this.videoElement);
		this.videoSource = $(document.createElement("source"));
		this.videoSource.attr("type", "video/mp4");
		this.videoSource.attr("src", "/The_Countdown_Clock.mp4");
		this.videoElement.append(this.videoSource);
		
		var self = this;
		this.videoElement.context.addEventListener("canplay", function() {
			self.canPlayVideo = true;
			self.videoElement.context.currentTime = self.videoTime; 
		}, false);
		this.videoElement.context.addEventListener("timeupdate", function() {
			var currentTime = self.videoElement.context.currentTime;
			if ((self.endTime != -1) && (currentTime > self.endTime)) {
				self.videoElement.context.pause();
				self.presentation.forward();
			}
		}, false);	
		
		$(".algoviewAnchor").append(this.container);
	}

	this.show = function() {
		this.container.css("display", "block");
	}

	this.hide = function() {
		this.container.css("display", "none");
		this.videoElement.context.pause();
	}
	
	this.goToTime = function(beginTime, endTime, newSlide, oldSlide) {
		this.show();
		
		this.endTime = endTime;
		
		if (this.canPlayVideo) {
			this.videoElement.context.currentTime = beginTime;
		} else {
			this.videoTime = beginTime;
		}
		this.videoElement.context.play();
	}

}

function videoGoToTime(beginTime, endTime, newSlide, oldSlide) {
	videoModule.goToTime(beginTime, endTime, newSlide, oldSlide);
}

function videoOnLeaveSlide() {
	videoModule.hide();
}
