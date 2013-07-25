MathJaxModule = function() {

	this.onPresentationLoad = function() {
		console.log("Calling MathJax...");
		try {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src  = "slides/lib/mathjax/MathJax.js?config=default";

			var config = 'MathJax.Hub.Config({' +
					 'root:"../slides/lib/mathjax",' +
					 'jax: ["input/TeX","output/SVG"],' +
					 'tex2jax: {inlineMath: [["$","$"]]}' +
				       '});' +
				       'MathJax.Hub.Startup.onload();';

			if (window.opera) {script.innerHTML = config}
				       else {script.text = config}

			document.getElementsByTagName("head")[0].appendChild(script);
			console.log("Math jaxed.");
		} catch (e) {
			console.log("Mathjax error.");
		}
	}

}
