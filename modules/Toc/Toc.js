//////////////////////////////////////
// Utility classes
//////////////////////////////////////

function Section() {
	this.firstSlideNumber;
	this.lastSlideNumber;
	this.subsections = new Array();
}

function Subsection() {
	this.section;	
	this.firstSlideNumber;
	this.lastSlideNumber;
}

//////////////////////////////////////
// Main class
//////////////////////////////////////

var TocModule = function(presentation) {
	this.presentation = presentation;

	this.sections = new Array();

	this.currentSectionNumber = 0;
	this.currentSubsectionNumber = 0;
	
	this.beforeCreatingSlides = function() {
		console.log("Creating table of contents");
		this.createTableOfContents();
	}

	this.onShowSlide = function(newSlide, oldSlide) {
		this.updateTableOfContents();
	}
}

TocModule.prototype.updateTableOfContents = function() {
	this.updateCurrentSection();
	this.updateCurrentSubsection();
}

TocModule.prototype.updateCurrentSection = function() {
	var sectionNumber;
	var subSectionNumber;

	// Find the section in which the current slide is
	for (sectionNumber = this.sections.length - 1; sectionNumber > 0; sectionNumber--) {
		if ((this.presentation.currentSlide.slideNumber >= this.sections[sectionNumber].firstSlideNumber) 
				&& (this.presentation.currentSlide.slideNumber <= this.sections[sectionNumber].lastSlideNumber)) {
			break;
		}
	}

	// If the current section changed...
	if (sectionNumber != this.currentSectionNumber) {
		// Update old current section
		var oldCurrentTocSection = $('#table-of-contents-section-' + this.currentSectionNumber);
		var oldCurrentTocSectionSubsections = $('#table-of-contents-section-' + this.currentSectionNumber + "-subsections");
		oldCurrentTocSection.toggleClass('current-section');
		oldCurrentTocSection.trigger('classChanged');
		oldCurrentTocSectionSubsections.toggleClass('hidden-subsections');
		oldCurrentTocSectionSubsections.toggleClass('current-subsections');
		oldCurrentTocSectionSubsections.trigger('classChanged');
		$('.current-subsection').toggleClass('current-subsection');
		$('.current-subsection').trigger('classChanged');

		// Update new current section
		if (sectionNumber != 0) {
			$('#table-of-contents-section-' + sectionNumber).toggleClass('current-section');
			$('#table-of-contents-section-' + sectionNumber).trigger('classChanged');
			$('#table-of-contents-section-' + sectionNumber + "-subsections").toggleClass('hidden-subsections');
			$('#table-of-contents-section-' + sectionNumber + "-subsections").toggleClass('current-subsections');
			$('#table-of-contents-section-' + sectionNumber + "-subsections").trigger('classChanged');
		}
	}

	this.currentSectionNumber = sectionNumber;
}

TocModule.prototype.updateCurrentSubsection = function() {
	var subsectionNumber = 0;

	// Find the subsection in which the current slide is
	if (this.currentSectionNumber != 0)	{				
		var currentSection = this.sections[this.currentSectionNumber];
		for (subsectionNumber = currentSection.subsections.length - 1; subsectionNumber > 0 ; subsectionNumber--) {
			if ((this.presentation.currentSlide.slideNumber >= currentSection.subsections[subsectionNumber].firstSlideNumber) 
					&& (this.presentation.currentSlide.slideNumber <= currentSection.subsections[subsectionNumber].lastSlideNumber)) {
				break;
			}
		}
	}

	// If the current subsection changed...
	if (subsectionNumber != this.currentSubsectionNumber) {
		// Update old current subsection
		$('.current-subsection').toggleClass('current-subsection');
		$('.current-subsection').trigger('classChanged');

		// Update new current subsection		
		if (subsectionNumber > 0) {
			$('#table-of-contents-section-' + this.currentSectionNumber + '-subsection-' + subsectionNumber).toggleClass('current-subsection');
			$('#table-of-contents-section-' + this.currentSectionNumber + '-subsection-' + subsectionNumber).trigger('classChanged');
		}	
	}

	this.currentSubsectionNumber = subsectionNumber;
}

// TODO: A séparer en plusieurs fonctions
TocModule.prototype.createTableOfContents = function() {
	var sectionsList = $(document.createElement("ul"));

	sectionsList.append("<li><a href='#presentation-title' class='table-of-contents-home-link'></a></li>");

	var slideCount = 2;
	var sectionNumber = 1;
	var self = this;
	$('section', this.presentation.xmlPresentationParser.presentationData).each(function(index) {
		var section = new Section();
		section.firstSlideNumber = slideCount;
		
		var sectionSlideReference = slideCount;
		var slideElement = $('slide', $(self.presentation.xmlPresentationParser.presentationData)).eq(slideCount - 2);
		if (slideElement.attr("id") != undefined) {
			sectionSlideReference = slideElement.attr("id");
		}
		 
		sectionsList.append("<li id='table-of-contents-section-" 
			+ sectionNumber 
			+ "'><a href='#" + sectionSlideReference + "'>" 
			+ $('> title', this).text() 
			+ "</a><ul class='hidden-subsections' id='table-of-contents-section-" 
			+ sectionNumber + "-subsections'></ul></li>"
		);

		var subsectionNumber = 1;
		var subsectionSlideCount = 0;
		$('> subsection', this).each(function(index) {
			var subsection = new Subsection();
			subsection.firstSlideNumber = slideCount + subsectionSlideCount; // TODO: A modifier car cela peut être plus s'il y a des slides avant le début de la sous-section
			subsectionSlideCount += $('slide', this).length;
			subsection.lastSlideNumber = slideCount + subsectionSlideCount;
			section.subsections[subsectionNumber] = subsection;
			
			var subsectionSlideReference = subsection.firstSlideNumber;
			var slideElement = $('slide', $(self.presentation.xmlPresentationParser.presentationData)).eq(subsection.firstSlideNumber - 2);
			if (slideElement.attr("id") != undefined) {
				subsectionSlideReference = slideElement.attr("id");
			}
			
			var subsections = $('#table-of-contents-section-' + sectionNumber + '-subsections', sectionsList);
			subsections.append("<li id='table-of-contents-section-" 
				+ sectionNumber + "-subsection-" + subsectionNumber 
				+ "'><a href='#" + subsectionSlideReference + "'>" 
				+ $('> title', this).text() 
				+ "</a></li>"
			);
			subsectionNumber++;
		});

		self.sections[sectionNumber] = section;
		slideCount += $('slide', this).length;
		section.lastSlideNumber = slideCount - 1;
		sectionNumber++;
	});

	var lastSlashIndex = this.presentation.completePresentationName.lastIndexOf('/');
	if (lastSlashIndex != -1) {
		var parentPresentation = this.presentation.completePresentationName.substring(0, lastSlashIndex);
		sectionsList.append("<li><a href='?presentation=" + 
			parentPresentation  + 
			"#toc' class='table-of-contents-up-link'></a></li>"
		);
	}

	$('#table-of-contents').append(sectionsList);
}
