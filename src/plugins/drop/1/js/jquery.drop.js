/*! jquery.drop.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Toggle a drop menu
 */

;(function($){
	var defaults = {
		// container: '.ms-drop__container-js', // is element
		opener: '.ms-drop__opener-js',
		openerText: 'span',
		drop: '.ms-drop__drop-js',
		dropOption: '.ms-drop__drop-js a',
		dropOptionText: 'span',
		initClass: 'ms-drop--initialized',
		closeOutsideClick: true, // Close all if outside click
		closeEscClick: true, // Close all if click on escape key
		closeAfterSelect: true, // Close drop after selected option
		preventOption: false, // Add preventDefault on click to option
		selectValue: true, // Display the selected value in the opener
		modifiers: {
			isOpen: 'is-open',
			activeItem: 'active-item'
		}

		// Callback functions
		// afterInit: function () {} // Fire immediately after initialized
		// afterChange: function () {} // Fire immediately after added or removed an open-class
	};

	function MsDrop(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();
		self.event();
		// close drop if clicked outside active element
		if (self.config.closeOutsideClick) {
			self.closeOnClickOutside();
		}
		// close drop if clicked escape key
		if (self.config.closeEscClick) {
			self.closeOnClickEsc();
		}
		self.eventDropItems();
		self.init();
	}

	/** track events */
	MsDrop.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.msDrop', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	MsDrop.prototype.event = function () {
		var self = this;
		self.element.on('click', self.config.opener, function (event) {
			event.preventDefault();
			var curContainer = $(this).closest(self.element);

			if (curContainer.hasClass(self.config.modifiers.isOpen)) {

				curContainer.removeClass(self.config.modifiers.isOpen);

				// callback afterChange
				self.element.trigger('afterChange.msDrop');
				return;
			}

			self.element.removeClass(self.config.modifiers.isOpen);

			curContainer.addClass(self.config.modifiers.isOpen);

			// callback afterChange
			self.element.trigger('afterChange.msDrop');
		});
	};

	MsDrop.prototype.closeOnClickOutside = function () {

		var self = this;
		$(document).on('click', function(event){
			if( $(event.target).closest(self.element).length ) {
				return;
			}

			self.closeDrop();
			event.stopPropagation();
		});

	};

	MsDrop.prototype.closeOnClickEsc = function () {

		var self = this;
		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				self.closeDrop();
			}
		});

	};

	MsDrop.prototype.closeDrop = function (container) {

		var self = this,
			$element = $(container || self.element);

		if ($element.hasClass(self.config.modifiers.isOpen)) {
			$element.removeClass(self.config.modifiers.isOpen);
		}

	};

	MsDrop.prototype.eventDropItems = function () {

		var self = this;

		self.element.on('click', self.config.dropOption, function (e) {
			var cur = $(this);
			var curParent = cur.parent();

			if(curParent.hasClass(self.config.modifiers.activeItem)){
				e.preventDefault();
				return;
			}
			if(self.config.preventOption){
				e.preventDefault();
			}

			var curContainer = cur.closest(self.element);

			curContainer.find(self.config.dropOption).parent().removeClass(self.config.modifiers.activeItem);

			curParent
				.addClass(self.config.modifiers.activeItem);

			if(self.config.selectValue){
				curContainer
					.find(self.config.opener).find(self.config.openerText)
					.html(cur.find(self.config.dropOptionText).html());
			}

			if(self.config.closeAfterSelect) {
				self.closeDrop();
			}

		});

	};

	MsDrop.prototype.init = function () {

		this.element.addClass(this.config.initClass);

		this.element.trigger('afterInit.msDrop');

	};

	$.fn.msDrop = function (options) {
		'use strict';

		return this.each(function(){
			new MsDrop($(this), options);
		});

	};
})(jQuery);