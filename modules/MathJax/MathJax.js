MathJaxModule = function() {

	this.onPresentationLoad = function() {
                
                var cdn = (window.location.host == "localhost") ? "" : "//cdn.mathjax.org";
                cdn += "/mathjax/latest";

		console.log("Calling MathJax from " + cdn + "...");
                
		try {
			var script = document.createElement("script");
                        
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
			console.log("...Math successfully Jaxed");
		} catch (e) {
			console.log("...MathJax error!");
		}
	}

}
