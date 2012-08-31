var ExerciceModule = function(presentation) {
	this.presentation = presentation;
	
	this.beforeParsing = function() {
		presentation.xmlPresentationParser.tagHandlerManager.registerTagHandler("exercice", new ExerciceTagHandler());
		presentation.xmlPresentationParser.tagHandlerManager.registerTagHandler("answer", new AnswerTagHandler());
	}
}

function ExerciceTagHandler() {
	this.number = 0;
	this.parseTag = function(tag, presentation) {
		var exercice = $(document.createElement("div"));
		exercice.addClass("block");

		var exerciceType = $(tag).attr("type");
		if (exerciceType !== undefined) {
			exercice.addClass(exerciceType + "-block");
		}

		var title = $('> title', $(tag)).detach();  // detach sert à ne pas remettre le titre dans le contenu du bloc
		var exerciceTitle = $(document.createElement("div"));
		exerciceTitle.addClass('block-title');
		$(title).contents().each(function(index) {
			$(exerciceTitle).append(presentation.parseTag(this));
		}); 
		exercice.append(exerciceTitle);

		var exerciceContent = $(document.createElement("div"));
		exerciceContent.addClass('block-content');
		$(tag).contents().each(function(index) {
			$(exerciceContent).append(presentation.parseTag(this));
		});
		exercice.append(exerciceContent);

		this.number++;
		return exercice;	
	}
}

function AnswerTagHandler() {
	this.parseTag = function(tag, presentation) {
		var element = $(document.createElement("div"));
		$(element).attr($(tag).getAttributes());

		$(tag).contents().each(function(index) {
			$(element).append(presentation.parseTag(this));
		});

		return element;
	}
}
