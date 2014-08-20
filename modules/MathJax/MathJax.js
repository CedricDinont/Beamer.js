MathJaxModule = function() {

	this.onPresentationLoad = function() {
		console.log("Calling MathJax...");
		try {
			var script = document.createElement("script");
                        //var cdn = "/cdn/mathjax/latest";
                        var cdn = "//cdn.mathjax.org/mathjax/latest";
			script.type = "text/javascript";
			script.src  = cdn + "/MathJax.js?config=TeX-AMS_HTML";

			var config = 'MathJax.Hub.Config({' +
					 'root:"' + cdn + '",' +
					 // 'jax: ["input/TeX","output/SVG"],' +
					 'jax: ["output/SVG"],' + 
					'tex2jax: {inlineMath: [["$","$"]], displayMath: [[\'$$\',\'$$\']], processEscapes: true}' +
				       '});' +
				       'MathJax.Hub.Startup.onload();';

			if (window.opera) {
				script.innerHTML = config
			} else {
				script.text = config
			}

			document.getElementsByTagName("head")[0].appendChild(script);
			console.log("Math jaxed.");
		} catch (e) {
			console.log("Mathjax error.");
		}
	}

}
