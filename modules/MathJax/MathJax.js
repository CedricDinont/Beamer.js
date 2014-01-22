MathJaxModule = function() {

	this.onPresentationLoad = function() {
		console.log("Calling MathJax...");
		try {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src  = "/cdn/mathjax/latest/MathJax.js?config=default";

			var config = 'MathJax.Hub.Config({' +
					 'root:"/cdn/mathjax/latest",' +
					 'jax: ["input/TeX","output/SVG"],' +
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
