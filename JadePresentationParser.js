var JadePresentationParser = function() {
	this.xmlPresentationParser = new XmlPresentationParser();
}

JadePresentationParser.prototype.getFileExtension = function() {
	return ".jade";
}

JadePresentationParser.prototype.parse = function(presentation, presentationDataText) {
	var fn = jade.compile(presentationDataText, {});
	var xml = fn({});
	return this.xmlPresentationParser.parse(presentation, xml);
}
