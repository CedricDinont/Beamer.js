BootstrapModule = function() {

	Presentation.prototype.updateVerticalAlignment = function(slide) {
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
	}

	function tables(){
		$("table").each(function(clazz,node){
			node = $(node);
			node.removeClass("power");
			node.addClass("table table-striped table-bordered table-condensed table-hover");
			node.css("margin-top","5px").css("margin-bottom","5px");
			node.wrap("<div class='well well-small' style='background: white;'>");
		});
	}

	function buttons(){
		$("input[type='button']").addClass("btn btn-mini");
	}

	function svgs(){
		$("div[id^='anim']").addClass("well well-small");
	}


	this.afterCreatingSlides = function() {
		console.log("hello bootstrap");

		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/slides.css"+'" >')
		   .appendTo("head");

		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/css/bootstrap.css"+'" >')
		   .appendTo("head");
		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/css/bootstrap-responsive.css"+'" >')
		   .appendTo("head");

		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/slide/css/bootstrap.css"+'" >')
		   .appendTo("head");
		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/slide/css/bootstrap-responsive.css"+'" >')
		   .appendTo("head");

		function presentationTitle(){
			$(".presentation-title").each(function(clazz,node){
				node = $(node);
				var text = node.text();
				node.html("<h1>"+text+"</h1>");
			});
		}

		presentationTitle();

		function presentationSubtitle(){
			$(".presentation-subtitle").each(function(clazz,node){
				node = $(node);
				var text = node.text();
				node.html("<h3>"+text+"</h3>");
			});
		}

		presentationSubtitle();

		function presentationAuthor(){
			$(".presentation-author").each(function(clazz,node){
				node = $(node);
				var text = node.text();
				node.html("<h5>"+text+"</h5>");
			});
		}

		presentationAuthor();

		function exercices(){
			$(".block[data-type='exercice']").each(function(clazz,node){
				node = $(node);
				node.removeClass("block").addClass("alert alert-block");

				node.children(".block-title").each(function(clazz,node){
					node = $(node);
					var nnode = node.wrap("<div class=\"label label-warning\">");
					node.children().unwrap();
				});

				node.children(".block-content").each(function(clazz,node){
					node = $(node);
					node.removeClass("block-content");
				});
				node.find("#answer").wrap("<p class=\"slide-content text-success well well-small\">");
			});
		}

		exercices();

		function blocks(){
			$(".block").each(function(clazz,node){
				node = $(node);
				node.removeClass("block").addClass("alert alert-danger");

				node.children(".block-title").each(function(clazz,node){
					node = $(node);
					var text = node.html();
					node.removeClass("block-title");
					node.html("<span class=\"label label-important\">"+text+"</span>");
				});

				node.children(".block-content").each(function(clazz,node){
					node = $(node);
					var content = node.html();
					node.replaceWith(content);
				});
			});
		}

		blocks();

		function slideContainer(){
			$("#slides-container").each(function(clazz,node){
				node = $(node);
				node.removeAttr("id").addClass("row");
			});
		}

		slideContainer();

		function slideWithAlgoview(){
			$(".section-with-title").each(function(clazz,node){
				node = $(node);
				if(node.children("div.right-column-algoview-animation-comment").length > 0){
					node.css("padding-top","85px");
					var title = node.children("div.slide-title");
					var text = title.text();
				
					var textAlign = title.css("text-align");
					title.removeClass("slide-title");
					title.html("<h1>"+text+"</h1>");
					title.children().css("margin-top","10px").css("line-height","5px");

					var slideContent = node.children("div.horizontally-centered")
						.removeClass("right-column-algoview-animation-comment")
						.removeClass("horizontally-centered").addClass("slide-content");

					title.wrap("<div class=\"row-fluid\"><div class=\"offset1 span10\"></div></div>")
					slideContent.wrap("<div class=\"row-fluid\"><div class=\"offset6 span6\"></div></div>")
					node.children().wrapAll("<div></div>");
				}
			});
		}

		slideWithAlgoview();

		function slideWithIframe(){
			$(".section-with-title").each(function(clazz,node){
				node = $(node);
				if(node.children("iframe").length > 0){
					node.children("iframe").addClass("well well-small fill");
					node.css("padding-top","85px");
					var title = node.children("div.slide-title");
					var text = title.text();
				
					var textAlign = title.css("text-align");
					title.removeClass("slide-title");
					title.html("<h1>"+text+"</h1>");
					title.children().css("margin-top","10px").css("line-height","5px");

					var slideContent = node.children("div.horizontally-centered")
						.removeClass("right-column-algoview-animation-comment")
						.removeClass("horizontally-centered").addClass("slide-content");

					title.wrap("<div class=\"row-fluid\"><div class=\"offset1 span10\"></div></div>")
					slideContent.wrap("<div class=\"row-fluid\"><div class=\"offset6 span6\"></div></div>")
					node.children().wrapAll("<div></div>");
					node.children().css("height","100%");
				}
			});
		}

		slideWithIframe();

		function slide(){
			$(".section-with-title").each(function(clazz,node){
				node = $(node);
				node.css("padding-top","85px");
				var title = node.children("div.slide-title");
				var text = title.text();
				
				var textAlign = title.css("text-align");
				title.removeClass("slide-title");
				title.html("<h1>"+text+"</h1>");
				title.children("h1").css("line-height","40px");

				var slideContent = node.children("div.horizontally-centered");
				var sl = slideContent.children("div.slide-content");
				//sl.css("padding-left","0px");

				title.wrap("<div class=\"row-fluid\"><div class=\"offset1 span10\"></div></div>")
				slideContent.wrap("<div class=\"row-fluid\"><div class=\"offset1 span10\"></div></div>")
				node.children().each(function(i,elem){node.prepend(elem)})
				node.children().wrapAll("<div></div>");
			});

			$(".section-without-title").each(function(clazz,node){
				node = $(node);
				node.css("padding-top","85px");

				var slideContent = node.children("div.horizontally-centered");
				var sl = slideContent.children("div.slide-content");
				sl.css("padding-left","0px");

				slideContent.wrap("<div class=\"row-fluid\"><div class=\"offset1 span10\"></div></div>")
				node.children().wrapAll("<div></div>");
			});
		}

		slide();

		function toc(){
			$("#table-of-contents ul").each(function(clazz,node){
				node = $(node);
				$("#table-of-contents li .table-of-contents-home-link").each(function(clazz,a){
					a = $(a);
					a.html("<i class=\"icon-home\"></i>");
				});

				$("#table-of-contents li .table-of-contents-up-link").each(function(clazz,a){
					a = $(a);
					a.html("<i class=\"icon-arrow-up\"></i>");
				});

				var lis = $("#table-of-contents li");

				lis.each(function(clazz,li){
					// pour gecko
					li.addEventListener('DOMAttrModified', function(e){
						  if (e.attrName === 'class') {
							if($(li).hasClass('current-section') || $(li).hasClass('current-subsection') ){
								$(li).addClass("active");
							}else{
								$(li).removeClass("active");
							}
						  }
					}, false);
					li = $(li);
					// pour webkit
					li.on('classChanged',function(){
						lis.each(function(clazzz,li_){
							li_ = $(li_);
							if( !li_.hasClass('current-section') && !li_.hasClass('current-subsection') ){
								li_.removeClass("active");
							}
						});
						if(li.hasClass('current-section') || li.hasClass('current-subsection') ){
							li.addClass("active");
						}
					});
					if(li.hasClass('current-section') || li.hasClass('current-subsection') ){
						li.addClass("active");
					}
				});
				var content = node.html();
				node.replaceWith("<ul class=\"nav nav-pills\">"+content+"</ul>");
				$("#table-of-contents ul").css("margin-bottom","0px");
			});
	
			$("#table-of-contents ul .current-subsections").each(function(clazz,node){
				node = $(node);
				node.addClass("nav nav-pills").css("position","inherit");
			});

			$("#table-of-contents ul .hidden-subsections").each(function(clazz,node){
				node = $(node);
				node.addClass("nav nav-pills");
				node.css("position","inherit");
			});

			$("#table-of-contents").each(function(clazz,node){
				node = $(node);
				node.removeAttr("id");
				node.wrap("<div class='navbar-inverse'>");
				node.wrap("<div class=\"row-fluid navbar-inner\">");
				node.parent().css("margin","0 auto").css("padding-bottom","0px").css("position","absolute").css("width","100%");
			});
		}

		toc();

		function slideNumber(){
			$("#current-slide-number").css("width","inherit");
		}

		slideNumber();

		function progressBar(){
			var bar = $("#progress-bar");
			bar.removeAttr("id").addClass("bar");
			bar.css("position","absolute").css("bottom","0px").css("height","10px");
			bar.wrap("<div class=\"progress progress-striped active progress-danger\" />");

			var left = $("#back-control");
			left.html("<i class=\"icon-chevron-left\"></i>");

			var left = $("#forward-control");
			left.html("<i class=\"icon-chevron-right\"></i>");

			var fullscreen = $("#go-fullscreen-button");
			fullscreen.html("<i class=\"icon-resize-full\"></i>");
		}

		progressBar();

		buttons();
	}

	this.onPresentationLoad = function() {
		tables();
		buttons();
		svgs();
		console.log("bootstrap loaded");
	};
}

