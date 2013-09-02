var XmlPresentationParser = function() {
	this.presentation;
	this.presentationData;
	
	this.modulesToWait = new Array();

	this.xmlSerializer = new XMLSerializer();
	this.tagHandlerManager = new TagHandlerManager();
}

XmlPresentationParser.prototype.getFileExtension = function() {
	return ".xml";
}

XmlPresentationParser.prototype.parseTag = function(tag) {
	var tagHandler = this.tagHandlerManager.getTagHandler(tag.tagName);
	var htmlContent = tagHandler.parseTag(tag, this);
	return htmlContent;
}

XmlPresentationParser.prototype.parseHtml = function(htmlToParse) {
	var sectionContent = this.xmlSerializer.serializeToString(htmlToParse); 
	sectionContent = sectionContent.replace("<!\[CDATA\[", "").replace("\]\]>", "");
	return sectionContent;
}

XmlPresentationParser.prototype.parse = function(presentation, presentationDataText) {
	this.presentation = presentation;
	
	// TODO: A mettre ailleurs et à améliorer
	var reg = new RegExp("<c-code>", "g");
	var reg2 = new RegExp("</c-code>", "g");
	presentationDataText = presentationDataText.replace(reg, '<pre class="prettyprint lang-c linenums"><![CDATA[').replace(reg2, "]]></pre>");
	
	reg = new RegExp("<sl-code>", "g");
	reg2 = new RegExp("</sl-code>", "g");
	presentationDataText = presentationDataText.replace(reg, '<pre class="prettyprint lang-sl linenums"><![CDATA[').replace(reg2, "]]></pre>");
	
/*	var reg = new RegExp("<c-code>(.*)</c-code>", "g");
	presentationDataText = presentationDataText.replace(reg, "<pre class='prettyprint lang-c linenums'><![CDATA[$1]]></pre>"); */
	
	var domParser = new DOMParser();
	this.presentationData = domParser.parseFromString(presentationDataText, "application/xml");  
	
	console.log("Parsed XML");

	console.log("Loading modules");
	this.loadModules();
}

function waitForFunction(functionName) {
	var test;
	eval("test = typeof " + functionName);
	if (test === "undefined") {
		console.log("retrying");
		window.setTimeout("waitForFunction(" + functionName + ")", 50);
	}
}

XmlPresentationParser.prototype.parseContent = function() {
	this.presentation.callModulesHandler("beforeParsing");

	console.log("Adding head");
	this.appendSection('head');

	this.loadTheme();
	
	this.presentation.callModulesHandler("beforeCreatingSlides");
	
	this.createTitleSlide();
	
	console.log("Creating slides");
	this.createSlides();
	this.presentation.callModulesHandler("afterCreatingSlides");
	
	console.log("Appending foot");
	this.appendSection('foot');
	
	this.presentation.onPresentationParsed();
}

XmlPresentationParser.prototype.loadModules = function() {
	var self = this;
	var modules = $("modules", this.presentationData);
	var isBootstrap = false;
	$("module", modules).each(function() {
		var moduleName = $(this).attr("name");
		var args = $(this).attr("args");
		if(moduleName === "Bootstrap"){
			isBootstrap = true;
		}
		self.presentation.loadModule(moduleName);
		self.modulesToWait.push({moduleName:moduleName,args:args});
	});

	// on charge par défaut bootstrap s'il n'est pas dans la liste des modules
	if(!isBootstrap){
		self.presentation.loadModule("Bootstrap");
		self.modulesToWait.push({moduleName:"Bootstrap",args:{}});
	}

	waitForModules(this);
}

waitForModules = function(parser) {
	for (var i in parser.modulesToWait) {
		var module = parser.modulesToWait[i];
		var moduleName = module.moduleName;
		var args = module.args;
		// console.log("Verifying if " + moduleName + " is loaded.");
		var test;
		eval("test = typeof " + moduleName + "Module");
		if (test === "function") {
			// console.log("Yes.");
			parser.modulesToWait.splice(i, 1);
			var moduleInstance = eval("new " + moduleName + "Module(parser.presentation,"+args+")");
			parser.presentation.modules.push(moduleInstance);
			break;
		} else {
			// console.log("No.");
		}
	}
	
	if (parser.modulesToWait.length == 0) {
		// console.log("No more module to wait for.");
		parser.parseContent();
	} else {
		// console.log("Waiting before retrying.");
		window.setTimeout(function() {
			waitForModules(parser);
		}, 50);
	}
}

XmlPresentationParser.prototype.appendSection = function(sectionName) {
	var section = $(sectionName, this.presentationData);
	var self = this;
	section.contents().each(function(index) {
		$('#body').append(self.parseTag(this));
	});
}

XmlPresentationParser.prototype.loadTheme = function() {
	var dir = $('theme', this.presentationData).text();
	if(!dir)	dir = 'default';
	var pathCSS = './themes/'+dir+'/slides.css';
	var pathJS = './themes/'+dir+'/slides.js';
	
	var style = document.createElement('link');
	style.setAttribute('rel','stylesheet');
	style.setAttribute('type','text/css');
	style.setAttribute('href',pathCSS);
	document.getElementsByTagName('head')[0].appendChild(style); 
	
	var script = document.createElement('script');
	script.setAttribute('language','JavaScript');
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',pathJS);
	document.getElementsByTagName('head')[0].appendChild(script); 
}

XmlPresentationParser.prototype.createTitleSlide = function() {
	var title = $('presentation > title', this.presentationData).text();
	var subTitle = $('presentation > subtitle', this.presentationData).text();
	var author = $('presentation > author', this.presentationData).text();
	
	$('#presentation-title-div').text(title);
	$('#presentation-subtitle-div').text(subTitle);
	$('#presentation-author-div').text(author);
	
	var windowTitle = title;
	if (subTitle != "") {
		windowTitle += " - " + subTitle;
	}
	document.title = windowTitle;
	
	var slide = new Slide(1, "presentation-title", $("#presentation-title"), this.presentation, undefined); // TODO: Voir quel noeud XML fournir dans l'objet Slide
	this.presentation.slides[1] = slide;
}

XmlPresentationParser.prototype.createSlides = function() {
	var slideCounter = 2;
	var self = this;

	$('slide', this.presentationData).each(function(index) {
		var slideHtml = self.parseTag(this);
		$('#slides-container').append(slideHtml).addClass("algoviewAnchor");
		
		var slideId = $(this).attr('id');
		console.log("Slide id", slideId);

		var slide = new Slide(slideCounter, slideId, slideHtml, self.presentation, this);
		var onShowAttribute = this.getAttribute("onshow");
		if (onShowAttribute) {
			slide.onShow.push(onShowAttribute);
		}
		var onLeaveAttribute = this.getAttribute("onleave");
		if (onLeaveAttribute) {
			slide.onLeave.push(onLeaveAttribute);
		}
		self.presentation.slides[slideCounter] = slide;
		slideCounter++;
	});
}

