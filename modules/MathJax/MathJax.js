MathJaxModule = function() {

	this.onPresentationLoad = function() {
                
                console.log("Calling MathJax...");
                
                var cdn = "/mathjax/latest/";
                var local = false;
                
                if (window.location.host == "localhost") {
                
                        jQuery.ajax({
                                url: cdn,
                                async: false,
                                success: function() {
                                        local = true;
                                },
                                error: function() {
                                        console.log("Local MathJax not found; using public CDN instead");
                                }
                        });
                        
                }

                cdn = ( (local) ? "" : "//cdn.mathjax.org" ) + cdn;
                
		try {
			var script = document.createElement("script");
                        
			script.type = "text/javascript";
			script.src  = cdn + "MathJax.js?config=TeX-AMS_HTML";

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
