KeyboardControlModule = function(presentation) {
	
	this.presentation = presentation;
	
	this.onkeydown = function(aEvent) {
    // Don't intercept keyboard shortcuts
    if (aEvent.altKey
      || aEvent.ctrlKey
      || aEvent.metaKey
      || aEvent.shiftKey) {
      return;
    }
    if ( aEvent.keyCode == 37 // left arrow
      || aEvent.keyCode == 38 // up arrow
      || aEvent.keyCode == 33 // page up
      || aEvent.keyCode == 81 // q
    ) {
      aEvent.preventDefault();
      this.presentation.back();
    }
    if ( aEvent.keyCode == 39 // right arrow
      || aEvent.keyCode == 40 // down arrow
      || aEvent.keyCode == 34 // page down
      || aEvent.keyCode == 68 // d
    ) {
      aEvent.preventDefault();
      this.presentation.forward();
    }
    if (aEvent.keyCode == 35) { // end
      aEvent.preventDefault();
      this.presentation.goEnd();
    }
    if (aEvent.keyCode == 36) { // home
      aEvent.preventDefault();
      this.presentation.goStart();
    }
    if (aEvent.keyCode == 70) { // f
      aEvent.preventDefault();
      this.presentation.goFullscreen();
    }
  }
  
   window.onkeydown = this.onkeydown.bind(this);
	
}
