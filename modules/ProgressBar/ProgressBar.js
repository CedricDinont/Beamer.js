var ProgressBarModule = function(presentation) {
	
	this.presentation = presentation;
	this.progressBar = $("#progress-bar");
	
	this.onShowSlide = function(newSlide, oldSlide) {
		var progress = (newSlide.slideNumber - 1) / (this.presentation.slides.length - 2) * 100;
		
		this.progressBar.css("width", progress + '%');
	}

}

/**
 * TODO : Gérer les animations internes au slide courant 
 * en reprenant le code suivant
 **/
 /*
  Dz.setProgress = function(aIdx, aStep) {
    var slide = $x("section:nth-of-type("+ aIdx +")");
    if (!slide)
      return;
    var steps = slide.$$('.incremental > *').length + 1,
        slideSize = 100 / (this.slides.length - 1),
        stepSize = slideSize / steps;
   // this.progressBar.style.width = ((aIdx - 1) * slideSize + aStep * stepSize) + '%';
  }
 */
