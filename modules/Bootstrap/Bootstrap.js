BootstrapModule = function() {

	this.afterCreatingSlides = function() {
		console.log("hello bootstrap");

		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/css/bootstrap.css"+'" >')
		   .appendTo("head");

		$('<link rel="stylesheet" type="text/css" href="'+"./modules/Bootstrap/slide/css/bootstrap.css"+'" >')
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

		function blocks(){
			$(".block").each(function(clazz,node){
				node = $(node);
				node.removeClass("block").addClass("alert alert-info");

				$(".block-title").each(function(clazz,node){
					node = $(node);
					var text = node.text();
					node.removeClass("block-title");
					node.html("<span class=\"label label-info\">"+text+"</span>");
				});

				$(".block-content").each(function(clazz,node){
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

		function tables(){
			$("table").each(function(clazz,node){
				node = $(node);
				node.removeClass("power");
				node.addClass("table table-striped table-bordered table-condensed table-hover");
			});
		}

		tables();

		function slide(){
			$(".section-with-title").each(function(clazz,node){
				node = $(node);
				node.css("padding-top","85px");
				var title = node.children("div.slide-title");
				var text = title.text();
				var textAlign = title.css("text-align");
				title.removeClass("slide-title");
				title.html("<h1>"+text+"</h1>");

				var slideContent = node.children("div.horizontally-centered");
				node.html("<div>\
				<div class=\"row-fluid\">\
					<div class=\"offset0 span12\">"+title.html()+"</div>\
				</div>\
				<div class=\"row-fluid\">\
					<div class=\"offset1 span10\">"+slideContent.html()+"</div>\
				</div>\
				</div>");
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
					li = $(li);
					li.on('classChanged',function(){
						if(li.hasClass('current-section') || li.hasClass('current-subsection') ){
							li.addClass("active");
						}
						lis.each(function(clazzz,li_){
							li_ = $(li_);
							if( !li_.hasClass('current-section') && !li_.hasClass('current-subsection') ){
								li_.removeClass("active");
							}
						});
					});
					if(li.hasClass('current-section') || li.hasClass('current-subsection') ){
						li.addClass("active");
					}
				});
				var content = node.html();
				node.replaceWith("<ul class=\"nav nav-pills\">"+content+"</ul>");
				$("#table-of-contents ul").css("margin-bottom","5px");
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
				node.removeAttr("id").addClass("offset1 span10");
				node.wrap("<div class=\"row-fluid navbar-inner\">")
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
			bar.wrap("<div class=\"progress\" />");

			var left = $("#back-control");
			left.html("<i class=\"icon-chevron-left\"></i>");

			var left = $("#forward-control");
			left.html("<i class=\"icon-chevron-right\"></i>");

			var fullscreen = $("#go-fullscreen-button");
			fullscreen.html("<i class=\"icon-fullscreen\"></i>");
		}

		progressBar();
	}

}
