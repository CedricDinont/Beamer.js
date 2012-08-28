PrettifyModule = function() {

	this.onPresentationLoad = function() {
		try {
			prettyPrint();
			console.log("Pretty printed.");
		} catch (e) {
			console.log("No pretty print.");
		}
	}

}
