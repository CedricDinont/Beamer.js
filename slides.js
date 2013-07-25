//////////////////////////////////////
// Utility classes
//////////////////////////////////////

var Slide = function(slideNumber, id, domElement, presentation, presentationElement) {
	this.slideNumber = slideNumber;
	this.id = id;
	this.domElement = domElement;
	this.presentationElement = presentationElement;
	this.presentation = presentation;
	
	this.onShow = new Array(); 
	this.onLeave = new Array();
	
	this.onShow.push("defaultOnShowSlide");
	this.onLeave.push("defaultOnLeaveSlide");
}

//////////////////////////////////////
// Main class
//////////////////////////////////////

function Presentation(completePresentationName, presentationFile) {
	this.completePresentationName = completePresentationName;
	this.presentationFile = presentationFile;

	this.currentSlide = undefined;
	this.currentStepNumber = 0;
	
	this.slides = new Array();
	this.modules = new Array();
	
	var self = this;

	
	this.onPresentationParsed = function() {
		self.callModulesHandler("onPresentationLoad");
		
		window.onhashchange = self.onHashChange.bind(self);
		this.onHashChange();
		
		$("#slides").css("display", "block"); // TODO : Voir pourquoi ça ne marche pas -> $("#slides").addClass("loaded");
		$("#loading").remove();
		$("#loading-mask").fadeOut(250); 
		
		window.onresize = this.onResize.bind(this);
		this.onResize();
	}

	this.load = function(presentationFile, onError, onSuccess) {
		console.log("Load "+presentationFile);
		$.ajax({
   			type: "GET",
			url: presentationFile,
			error: onError,
			success: onSuccess,
			dataType: "text",
		});
	};

	this.loadXML(presentationFile+".xml", function(){
		console.log("Trying Jade");
		self.loadJade(presentationFile+".jade",
			function(){
				console.log("Error while loading presentation: no file found");
		});
	});
}

Presentation.prototype.loadXML = function(presentationFile, errorCallback){
	this.xmlPresentationParser = new XmlPresentationParser();
	var self = this;
	
	this.loadXMLErrorHandler = function(msg) {
		$("#loading-indicator").remove();
		console.log("Error while loading XML: file not found");
		var errorMessage = $('#error-message');
		errorMessage.removeClass('error-message-hidden');
		errorMessage.addClass('error-message-display');
	}

	this.loadXMLSuccessHandler = function(presentationData) {	
		self.xmlPresentationParser.parse(self, presentationData);
	}

	this.load(presentationFile,
		function(){
			self.loadXMLErrorHandler();
			if(errorCallback !== undefined){
				errorCallback();
			}
		},
		this.loadXMLSuccessHandler);
}

Presentation.prototype.loadJade = function(presentationFile, errorCallback){
	this.jadePresentationParser = new JadePresentationParser();
	var self = this;

	this.loadJadeErrorHandler = function(msg) {
		console.log("Error while loading Jade: file not found");
		$("#loading-indicator").remove();
		
		var errorMessage = $('#error-message');
		errorMessage.removeClass('error-message-hidden');
		errorMessage.addClass('error-message-display');
	}

	this.loadJadeSuccessHandler = function(presentationData) {
		self.xmlPresentationParser.parse(self, self.jadePresentationParser.parse(self, presentationData));	
	}
	
	this.load(presentationFile,
		function(){
			self.loadJadeErrorHandler();
			if(errorCallback !== undefined){
				errorCallback();
			}
		},
		this.loadJadeSuccessHandler);
}

Presentation.prototype.onHashChange = function() {	
    var cursor = window.location.hash.split("#");
    var newSlideReference = 1;
    var newStepNumber = 0;
 
    if (cursor.length == 2) {
      newSlideReference = cursor[1].split(".")[0];
      newStepNumber = ~~cursor[1].split(".")[1];
      /* TODO : A revoir
      if (newstep > Dz.slides[newidx - 1].$$('.incremental > *').length) { // 
        newstep = 0;
        newidx++;
      } */
    }
    
    this.showSlide(newSlideReference, newStepNumber);
}

Presentation.prototype.setCursor = function(slideNumber, stepNumber) {
	stepNumber = (stepNumber != 0 && typeof stepNumber !== "undefined") ? "." + stepNumber : "";
	
	var slideReference;
	if (this.slides[slideNumber] && this.slides[slideNumber].id !== undefined) {
		slideReference = this.slides[slideNumber].id;
	} else {
		slideReference = slideNumber;
	}
	
	window.location.hash = "#" + slideReference + stepNumber;
}

Presentation.prototype.showSlide = function(slideReference, step) {
	var newSlide;
	if (isInteger(slideReference)) {
		newSlide = this.slides[slideReference];
	} else {
		newSlide = this.findSlideById(slideReference);
	}
	
	if (newSlide == undefined) {
		// Slide does not exist. Going home.
		this.setCursor("1");
		return;
	}
	
	var oldSlide = this.currentSlide;
	this.currentSlide = newSlide;
	this.currentStepNumber = step;
	
	if (oldSlide !== undefined) {
		$(oldSlide.domElement).removeAttr("aria-selected");
		this.callOnLeaveSlideHandlers(newSlide, oldSlide);
	}
	
	// TODO: Gérer le step
	
	$(newSlide.domElement).attr("aria-selected", "true");
	this.callOnShowSlideHandlers(newSlide, oldSlide);
}
  
Presentation.prototype.goStart = function() {
    this.setCursor(1, 0);
}

Presentation.prototype.goEnd = function() {
	var lastIdx = this.slides.length - 1;
    var lastStep = 0; //this.slides[lastIdx - 1].domElement.$$('.incremental > *').length;
    this.setCursor(lastIdx, lastStep);
}

Presentation.prototype.back = function() {	
	if (this.currentSlide.slideNumber == 1 && this.currentStepNumber == 0) {
		return;
	}
	
	if (this.currentStepNumber == 0) {
      this.setCursor(this.currentSlide.slideNumber - 1, 0); //this.slides[this.idx - 2].$$('.incremental > *').length);
    } else {
      this.setCursor(this.currentSlide.slideNumber, this.currentStepNumber - 1);
    }
}

Presentation.prototype.forward = function() {
	if ((this.currentSlide.slideNumber >= this.slides.length - 1) && (this.currentStepNumber >= 0)) { // this.slides[this.idx - 1].$$('.incremental > *').length)
		return;
	}

    if (this.currentStepNumber >= 0) { //this.slides[this.idx - 1].$$('.incremental > *').length) {
      this.setCursor(this.currentSlide.slideNumber + 1, 0);
    } else {
      this.setCursor(this.currentSlide.slideNumber, this.currentStepNumber + 1);
    }
}

Presentation.prototype.goFullscreen = function() {
	var html = document.getElementsByTagName("html")[0];
	var requestFullscreen = html.requestFullscreen 
		|| html.requestFullScreen 
		|| html.mozRequestFullScreen 
		|| html.webkitRequestFullScreen
	;
   
	if (requestFullscreen) {
      requestFullscreen.apply(html);
    }
}
  
Presentation.prototype.onResize = function() {
/*	var db = document.body;
	var sx = db.clientWidth / window.innerWidth;
	var sy = db.clientHeight / window.innerHeight;
	var transform = "scale(" + (1 / Math.max(sx, sy)) + ")";

	db.style.MozTransform = transform;
	db.style.WebkitTransform = transform;
	db.style.OTransform = transform;
	db.style.msTransform = transform;
	db.style.transform = transform; */
	
	this.updateVerticalAlignments();
}

Presentation.prototype.callModulesHandler = function(handlerName) {
	for (var i in this.modules) {
		var handler = "this.modules[" + i + "]['" + handlerName + "']";
		if (this.isFunctionDefined(handler)) {
			try {
				eval(handler + "()");
			} catch (exception) {
				console.log("Error while calling module handler", handler, exception);
			}
		}
	}
}

Presentation.prototype.loadModule = function(moduleName) {
	var script = document.createElement('script');
	script.setAttribute('language', 'JavaScript');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', "./modules/" + moduleName + "/" + moduleName + ".js");
	document.getElementsByTagName('head')[0].appendChild(script);
}

Presentation.prototype.findSlideById = function(slideId) {
	for (var i in this.slides) {
		if (this.slides[i].id === slideId) {
			return this.slides[i];
		}
	}
	return undefined;
}

Presentation.prototype.isFunctionDefined = function(functionName) {
	var test;
	eval("test = typeof " + functionName);
	return (test === "function");
}

Presentation.prototype.callSlideHandler = function(handler, newSlide, oldSlide) {
	var functionCall;
	var functionName;
	var parametersPosition = handler.indexOf("(");
	
	if (parametersPosition == -1) {
		functionName = handler;
		functionCall = handler + "(newSlide, oldSlide)";
	} else {
		var functionName = handler.substring(0, parametersPosition);
		var parameters = handler.substring(parametersPosition + 1, handler.length - 1);
		var functionCall = functionName + "(" + parameters + ", newSlide, oldSlide)";
	}
	
	if (this.isFunctionDefined(functionName)) {
		try {
			eval(functionCall);
		} catch (exception) {
			console.log("Error while calling slide handler", functionCall, exception);
		}
	}
}

Presentation.prototype.callSlideHandlers = function(targetSlide, handlerName, newSlide, oldSlide) {
	for (var i in this.modules) {
		var handler = "this.modules[" + i + "]['" + handlerName + "Slide']";
		if (handler != undefined) {
			this.callSlideHandler(handler, newSlide, oldSlide);
		}
	}
	
	var handlers = targetSlide[handlerName];
	for (var i in handlers) {
		this.callSlideHandler(handlers[i], newSlide, oldSlide);
	}
}

Presentation.prototype.callOnLeaveSlideHandlers = function(newSlide, oldSlide) {
	this.callSlideHandlers(oldSlide, "onLeave", newSlide, oldSlide);
}

Presentation.prototype.callOnShowSlideHandlers = function(newSlide, oldSlide) {
	this.callSlideHandlers(newSlide, "onShow", newSlide, oldSlide);
}

Presentation.prototype.updateVerticalAlignments = function() {
	this.updateVerticalAlignment(this.currentSlide);
}

Presentation.prototype.updateVerticalAlignment = function(slide) {
    // console.log("Update alignment for", slide);

	var slideElement = slide.domElement;
	var slideHeight = slideElement.height();
	var slideWidth = slideElement.width();
	// console.log(slideWidth, slideHeight);	

	/* Condition empirique :
	 * 	 les éléments sont initialisés avec une taille 100*100
	 *   et ensuite, les CSS prennent la main.
	 *   800 correspond à la taille initiale définie pour les slides
	 */
	if (((slideHeight == 100) && (slideWidth == 100)) 
		|| ((slideWidth == 800))){
		 // console.log("Init not completed yet.");
			var self = this;
			window.setTimeout(function() { self.updateVerticalAlignment(slide); }, 50);
	}

	var slideContentElement = $("div[class='slide-content']", slideElement);

	var slideContentHeight = slideContentElement.height();
	var paddingTop = (((slideHeight - 0)- slideContentHeight) / 2);
	if (paddingTop < 0) {
		paddingTop = 0;
	}
	slideContentElement.css("padding-top", paddingTop + "px");
	
	if (navigator.userAgent.indexOf("Firefox") != -1) {
		var slideContentWidth = slideContentElement.width();
		var paddingLeft = (((slideWidth - 0)- slideContentWidth) / 2);
		if (paddingLeft < 0) {
			paddingLeft = 0;
		}
		slideContentElement.css("padding-left", paddingLeft + "px");
	}
}

//////////////////////////////////////
// Default slide events handlers
//////////////////////////////////////

function defaultOnShowSlide(newSlide, oldSlide) {
	console.log('Showing slide number ' + newSlide.slideNumber + " - id " + newSlide.id);
	newSlide.presentation.updateVerticalAlignment(newSlide);
}

function defaultOnLeaveSlide(newSlide, oldSlide) {
	console.log('Leaving slide number ' + oldSlide.slideNumber + " - id " + oldSlide.id);
}

//////////////////////////////////////
// Bootstrap
//////////////////////////////////////

$(document).ready(function() {
	var completePresentationName = $.getUrlVar('presentation');
	if (! completePresentationName) {
		document.location = "index.html";
		return;
	}
	
	if (completePresentationName.substr(-1) == "/") {
		completePresentationName = completePresentationName.substr(0, completePresentationName.length - 1);
	}
	
	var presentationName = completePresentationName.substring(completePresentationName.lastIndexOf('/'));

	var presentationFile = "./slides/" + completePresentationName + "/" + presentationName;

	var presentation = new Presentation(completePresentationName, presentationFile);
});


//////////////////////////////////////
// Helpers
//////////////////////////////////////

$.extend({
  getUrlVars: function() {
    var vars = [], hash;
    var args = window.location.href.slice(window.location.href.indexOf('?') + 1);
    var index = args.indexOf('#');
    if (index != -1) {
	args = args.slice(0, index);
    }
    var hashes = args.split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

(function($) {
    $.fn.getAttributes = function() {
        var attributes = {}; 

        if(!this.length)
            return this;

        $.each(this[0].attributes, function(index, attr) {
            attributes[attr.name] = attr.value;
        }); 

        return attributes;
    }
})(jQuery);

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {

      // closest thing possible to the ECMAScript 5 internal IsCallable
      // function 
      if (typeof this !== "function")
      throw new TypeError(
        "Function.prototype.bind - what is trying to be fBound is not callable"
      );

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply( this instanceof fNOP ? this : oThis || window,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
}

function isInteger(s) {
	return (s.toString().search(/^-?[0-9]+$/) == 0);
}

