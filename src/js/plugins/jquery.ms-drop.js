;(function($){
	var defaults = {
		// container: '.ms-drop__container-js', // is element
		opener: '.ms-drop__opener-js',
		openerText: 'span',
		drop: '.ms-drop__drop-js',
		dropItem: 'a',
		dropItemText: 'span',
		initClass: 'ms-drop--initialized',
		closeAreOpen: true, // Close those that are open
		outsideClick: true, // Close all if outside click
		modifiers: {
			isOpen: 'is-open',
			activeItem: 'active-item'
		}

		// Callback functions
		// afterInit: function () {} // Вызов вконце функции init()
		// afterChange: function () {} // Вызов после добавления или удаления класса открытия дропа
	};

	function MsDrop(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();
		self.event();
		// close drop if clicked outside active element
		if (self.config.outsideClick) {
			self.clickOutside();
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

			if(self.config.closeAreOpen) {
				self.element.removeClass(self.config.modifiers.isOpen);
			}
			curContainer.removeClass(self.config.modifiers.isOpen);

			curContainer.addClass(self.config.modifiers.isOpen);

			// callback afterChange
			self.element.trigger('afterChange.msDrop');
		});
	};

	MsDrop.prototype.clickOutside = function () {

		var self = this;
		$(document).on('click', function(event){
			if( $(event.target).closest(self.element).length ) {
				return;
			}

			self.closeDrop();
			event.stopPropagation();
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

		self.element.on('click', self.config.dropItem, function (e) {
			var cur = $(this);
			var curContainer = $(this).closest(self.element);

			console.log("cur: ", cur);
			
			// if data-window-location is true, prevent default
			// if (curContainer.attr('data-window-location') === 'true') {
			// 	e.preventDefault();
			// }

			// if data-select is false, do not replace text
			// if (curContainer.attr('data-select') === 'false') {
			// 	return;
			// }

			curContainer.find(self.config.dropItem).removeClass(self.config.modifiers.activeItem);

			cur
				.addClass(self.config.modifiers.activeItem);

			console.log(".text(): ", curContainer.find(self.config.dropItemText).text());

			curContainer
				.find(self.config.opener).find(self.config.openerText)
				.text(cur.find(self.config.dropItemText).text());
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