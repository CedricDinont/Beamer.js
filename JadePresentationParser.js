var JadePresentationParser = function() {
}

JadePresentationParser.prototype.parse = function(presentation, presentationDataText) {
	//console.log("Jade loaded",presentationDataText);
	var fn = jade.compile(presentationDataText, {});
	var xml = fn({});
	//console.log("Jade out: ", xml);
	return xml;
}
