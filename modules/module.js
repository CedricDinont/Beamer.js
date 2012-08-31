var Module = function() {
	this.beforeParsing = function() {}; // avant le parsing du fichier
	this.onPresentationLoad = function() {}; // après le parsing au premier affichage
	this.onShowSlide = function(newSlide, oldSlide) {};
	this.onLeaveSlide = function(newSlide, oldSlide) {};
}
