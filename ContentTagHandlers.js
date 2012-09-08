var TagHandlerManager = function() {
	this.handlers = new Array();
	this.defaultTagHandler = new DefaultTagHandler();

	this.registerDefaultTagHandlers = function() {
		this.registerTagHandler("a", new ATagHandler());
		this.registerTagHandler("script", new ScriptTagHandler());
		this.registerTagHandler("link", new LinkTagHandler());
		this.registerTagHandler("slide", new SlideTagHandler());
		this.registerTagHandler("columns", new ColumnsTagHandler());
		this.registerTagHandler("block", new BlockTagHandler());
		this.registerTagHandler("iframe", new IFrameTagHandler());
		this.registerTagHandler("img", new ImgTagHandler());
	}

	this.registerTagHandler = function(tagName, tagHandler) {
		this.handlers[tagName] = tagHandler;
	}

	this.getTagHandler = function(tagName) {
		if (this.handlers[tagName] !== undefined) {
			return this.handlers[tagName];
		}
		return this.defaultTagHandler;
	}

	this.registerDefaultTagHandlers();
}

function DefaultTagHandler() {
	this.parseTag = function(tag, presentation) {
		if (tag.tagName == undefined) {
			return presentation.parseHtml(tag);
		}
		var element = $(document.createElement(tag.tagName));
		$(element).attr($(tag).getAttributes());
		$(tag).contents().each(function() {
			$(element).append(presentation.parseTag(this));
		});
		return element;
	}
}

function IFrameTagHandler() {
	this.linkChecker = new LinkChecker();
	
	this.parseTag = function(tag, presentation) {
		console.log("parsing iframe");
		
		this.linkChecker.checkLink(tag, "src", presentation);
		this.linkChecker.checkLink(tag, "deferred-src", presentation);
		
		var element = $(document.createElement(tag.tagName));
		$(element).attr($(tag).getAttributes());
		// TODO: Recopier les noeuds enfants s'il y en a mais pas le document lié à l'iframe
		return element;
	}
}

// TODO: A séparer en plusieurs fonctions
function SlideTagHandler() {
	this.parseTag = function(tag, presentation) {
		var section = $(document.createElement("section"));
		
		// Recopie de l'attribut id
		// Bizarre : Génère un bug d'affichage des slides
		var slideId = $(tag).attr('id');
		if (slideId !== undefined) {
			console.log("Setting section element id", slideId);
			// $(section).attr('id', "slide-" + slideId);
		} 
		
		var sectionContentDiv;
		
		var alignAttribute = $(tag).attr('align');
		if (alignAttribute == "none") {
			sectionContentDiv = section;
		} else {
			var horizontalCenteringDiv = $(document.createElement("div"));
			horizontalCenteringDiv.addClass("horizontally-centered");
			section.append(horizontalCenteringDiv);
	
			sectionContentDiv = $(document.createElement("div"));
			sectionContentDiv.addClass("slide-content");
			horizontalCenteringDiv.append(sectionContentDiv);
		}
				
		var title = $("> title", $(tag)).detach();
		if (title.length != 0) {
			var titleDiv = $(document.createElement("div"));
			titleDiv.addClass("slide-title");
			$(title).contents().each(function(index) {
				$(titleDiv).append(presentation.parseTag(this));
			}); 
			$(section).append(titleDiv);
			
			section.addClass("section-with-title");
		} else {
			section.addClass("section-without-title");		
		}
		
		$(tag).contents().each(function() {
			$(sectionContentDiv).append(presentation.parseTag(this));
		});
		return section;
	}
}

function ColumnsTagHandler() {
	this.parseTag = function(tag, presentation) {
		var columns = $(document.createElement("div"));
		columns.addClass("columns");
		var columnNumber = 1;
		$('> column', $(tag)).each(function(index) {
			var column = $(document.createElement("div"));
			column.addClass("column");
			column.addClass("column-" + columnNumber + "-on-2");  // TODO: Gérer plus de 2 colonnes
			$(this).contents().each(function() {
				column.append(presentation.parseTag(this));
			});
			columns.append(column);
			columnNumber++;	
		});
		return columns;
	}
}

function BlockTagHandler() {
	this.parseTag = function(tag, presentation) {
		var block = $(document.createElement("div"));
		block.addClass("block");

		var blockType = $(tag).attr("type");
		if (blockType !== undefined) {
			block.addClass(blockType + "-block");
		}

		var title = $('> title', $(tag)).detach();  // detach sert à ne pas remettre le titre dans le contenu du bloc
		var blockTitle = $(document.createElement("div"));
		blockTitle.addClass('block-title');
		$(title).contents().each(function(index) {
			$(blockTitle).append(presentation.parseTag(this));
		}); 
		block.append(blockTitle);

		var blockContent = $(document.createElement("div"));
		blockContent.addClass('block-content');
		$(tag).contents().each(function(index) {
			$(blockContent).append(presentation.parseTag(this));
		});
		block.append(blockContent);

		return block;	
	}
}

function ScriptTagHandler() {
	this.linkChecker = new LinkChecker();
	
	this.parseTag  = function(tag, presentation) {
		this.linkChecker.checkLink(tag, "src", presentation);
		var html = presentation.parseHtml(tag);
		return html;
	}	
}

function ATagHandler() {
	this.linkChecker = new LinkChecker();
	
	this.parseTag = function(tag, presentation) {
		this.linkChecker.checkLink(tag, "href", presentation);
		var html = presentation.parseHtml(tag);
		return html;
	}
}

function LinkTagHandler() {
	this.linkChecker = new LinkChecker();
	
	this.parseTag = function(tag, presentation) {
		this.linkChecker.checkLink(tag, "href", presentation);
		var html = presentation.parseHtml(tag);
		return html;
	}
}

function ImgTagHandler() {
	this.linkChecker = new LinkChecker();
	
	this.parseTag = function(tag, presentation) {
		this.linkChecker.checkLink(tag, "src", presentation);
		var html = presentation.parseHtml(tag);
		return html;
	}
}

function LinkChecker() {
	this.checkLink = function(tag, linkAttribute, presentation) {
		var link = $(tag).attr(linkAttribute);
		if (link != undefined) {
			if (link.indexOf("//") == 0) {
				var newLink = "./slides/" + presentation.presentation.completePresentationName + "/" + link.substring(2);
				$(tag).attr(linkAttribute, newLink);
			}
		}
	}
}

/* TODO: A revoir 
XmlPresentationParser.prototype.parseQuizTags = function() {
	$('quiz').each(function(indexQuiz) {
		var quiz = new Quiz();
		quiz.type = $(this).attr('type');
		quiz.question = $(this).children('question').html();
		$(this).children('answer').each(function(indexAnswer) {
			quiz.answer.push({	html: $(this).html(), 
								correct: $(this).attr('correct')
							});
		});
		$(this).replaceWith(quiz.parse());
	});
}
*/

//////////////////////////////////////
// Quiz Class
//////////////////////////////////////

/**
 * Classe Quiz contenant une question
 */
var Quiz = function() {
	this.question = '';
	this.answer = new Array();
	this.type = 'single';
};

/**
 * Parse les questions en html
 */
Quiz.prototype.parse = function() {
	var html = '';
	
	html +=	'<div class="quiz" type="'+(this.type=='single'?'radio':'checkbox')+'">';
	html +=		'<div class="question">'+this.question+'</div>';
	
	for(key in this.answer) {
		html +=	'<div class="answer unchecked" correct="'+this.answer[key].correct+'">';
		html +=		this.answer[key].html;
		html +=	'</div>';
	}
	html +=		'<input type="button" value="Vérifier" />';
	html +=	'</div>';
	
	return html;
};

/**
 * Ajoute un attribut au quiz lorsque l'on clique sur le bouton de vérification
 * Méthode statique
 */
Quiz.plugListeners = function() {
	// Vérification du quiz
	$('body').on('click', '.quiz > input[type="button"]', function(e) {
		var quiz = $(this).parent('.quiz')
		quiz.attr('show_answer','true');
		
		quiz.children('.answer').each(function(indexAnswer) {
			var isCorrect = $(this).attr('correct') == 'true' ? true : false;
		});
	});
	
	// Clique sur une réponse
	$('body').on('click', '.quiz > .answer', function(e) {
		var quiz = $(this).parent('.quiz');
		
		if($(this).hasClass('checked')) {
			$(this).removeClass('checked');
			$(this).addClass('unchecked');
		} else {
			if(quiz.attr('type') === 'radio') {
				quiz.children('.answer').removeClass('checked');
				quiz.children('.answer').addClass('unchecked');
			}
			$(this).removeClass('unchecked');
			$(this).addClass('checked');
		}
	});
};

