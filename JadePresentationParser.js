var JadePresentationParser = function(xmlPresentationParser) {
	this.xmlPresentationParser = xmlPresentationParser;
}

JadePresentationParser.prototype.getFileExtension = function() {
	return ".jade";
}

JadePresentationParser.prototype.parse = function(presentation, presentationDataText) {
	var fn = jade.compile(presentationDataText, {});
	var xml = fn({});
	console.log(xml);
	return this.xmlPresentationParser.parse(presentation, xml);
}
