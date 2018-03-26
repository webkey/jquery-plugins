/*! jquery.ms-popup-dynamic
 * Version: 2018.1.0
 * Author: Serhii Ilchenko
 * Description: Open a simple popup, if an element is added dynamically
 */

;(function($){
	'use strict';



	function SimplePopupDynamic(element, config) {
		var self = this;

		self.config = config;
		// self.config = $.extend(true, {}, defaults, options);

		self.element = $(element);
		self.stopPropogation = '.ms-popup-d__no-close-js';
		self.modifiers = {
			init: 'ms-popup-d--initialized',
			isOpen: 'ms-popup-d--is-open'
		};
		self.datas = {
			outsideClose: 'outside-close',
			escapeClose: 'esc-close'
		};

		self.callbacks();

		// close popup if clicked outside active element
		self.clickOutside();
		if (self.config.outsideClose) {
		}
		// close popup if clicked escape key
		self.clickEscape();
		if (self.config.escapeClose) {
		}
		self.eventOnOpener();

		self.init();
	}

	/** track events */
	SimplePopupDynamic.prototype.callbacks = function () {
		var self = this;

		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.simplePopupDynamic', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	SimplePopupDynamic.prototype.eventOnOpener = function () {
		var self = this;

		self.element.on('click', self.config.opener, function (event) {
			var curOpener = $(this);
			
			var curId = curOpener.attr('href').substring(1);
			var curPopup = $('#' + curId);

			if (curOpener.hasClass(self.modifiers.isOpen)) {
				self.closePopup();

				event.preventDefault();
				event.stopPropagation();
				return;
			}

			if($('.' + self.modifiers.isOpen).length){
				self.closePopup();
			}

			// open current popup
			curOpener.addClass(self.modifiers.isOpen)
				.data(self.datas.outsideClose, self.config.outsideClose)
				.data(self.datas.escapeClose, self.config.escapeClose);
			curPopup.addClass(self.modifiers.isOpen)
				.data(self.datas.outsideClose, self.config.outsideClose)
				.data(self.datas.escapeClose, self.config.escapeClose);

			// callback after opened popup
			self.element.trigger('afterOpened.simplePopupDynamic');

			event.preventDefault();
			event.stopPropagation();

		});

		$(self.config.closeBtn).on('click', function (event) {
			self.closePopup();

			event.preventDefault();
		});
	};

	SimplePopupDynamic.prototype.clickOutside = function () {

		var self = this;

		$(document).on('click', function(event){
			var isOpenElement = $('.' + self.modifiers.isOpen);

			if(isOpenElement.length && isOpenElement.data(self.datas.outsideClose) && !$(event.target).closest(self.stopPropogation).length) {

				self.closePopup();
				event.stopPropagation();
			}
		});

	};

	SimplePopupDynamic.prototype.clickEscape = function () {

		var self = this;


		$(document).keyup(function(e) {
			var isOpenElement = $('.' + self.modifiers.isOpen);

			if (isOpenElement.length && isOpenElement.data(self.datas.escapeClose) && e.keyCode === 27) {

				self.closePopup();
			}
		});

	};

	SimplePopupDynamic.prototype.closePopup = function () {

		var self = this;

		$('.' + self.modifiers.isOpen).removeClass(self.modifiers.isOpen);

		// callback afterClose
		self.element.trigger('afterClosed.simplePopupDynamic');
	};

	SimplePopupDynamic.prototype.init = function () {

		var self = this;

		this.element.addClass(self.modifiers.init);

		this.element.trigger('afterInit.simplePopupDynamic');

	};

	// var defaults = {
	// 	opener: '.ms-popup-d__opener-js',
	// 	popup: '.ms-popup-d__popup-js',
	// 	closeBtn: '.ms-popup-d__close-js',
	// 	outsideClose: true, // Close all if outside click
	// 	escapeClose: true // Close all if escape key click
	// };

	$.fn.simplePopupDynamic = function (options) {
		return this.each(function(){
			// check for re-initialization
			var simplePopupDynamic;
			if(!$(this).data('simplePopupDynamic')) {
				simplePopupDynamic = new SimplePopupDynamic(this, $.extend(true, {}, $.fn.simplePopupDynamic.defaultOptions, options));
				$(this).data('simplePopupDynamic', simplePopupDynamic);
			}
		});
	};

	$.fn.simplePopupDynamic.defaultOptions = {
		opener: '.ms-popup-d__opener-js',
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		outsideClose: true, // Close all if outside click
		escapeClose: true // Close all if escape key click
	}

})(jQuery);