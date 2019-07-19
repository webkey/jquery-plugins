/*!==================================================
/*!jquery.popup.js
/*!Version: 1
/*!Description: Open a simple popup, if an element is added dynamically
/*!==================================================*/

;(function($){
	var defaults = {
		opener: '.ms-popup-d__opener-js',
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		outsideClose: true, // Close all if outside click
		escapeClose: true // Close all if escape key click
	};

	function SimplePopupDynamic(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;
		self.stopPropogation = '.ms-popup-d__no-close-js';
		self.modifiers = {
			init: 'ms-popup-d--initialized',
			isOpen: 'ms-popup-d--is-open'
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
			curOpener.addClass(self.modifiers.isOpen);
			curPopup.addClass(self.modifiers.isOpen);

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
			console.log(self.element);
			console.log(self.config.outsideClose);

			if(self.config.outsideClose){
				console.log('outsideClose is true');
			}

			if(isOpenElement.length && !$(event.target).closest(self.stopPropogation).length) {

				self.closePopup();
				event.stopPropagation();
			}
		});

	};

	SimplePopupDynamic.prototype.clickEscape = function () {

		var self = this;

		$(document).keyup(function(e) {
			var isOpenElement = $('.' + self.modifiers.isOpen);

			if (isOpenElement.length && e.keyCode === 27) {

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

	$.fn.simplePopupDynamic = function (options) {
		return this.each(function(){
			// check for re-initialization
			if(!$(this).data('simplePopupDynamic')) {
				$(this).data('simplePopupDynamic', new SimplePopupDynamic($(this), options));
			}
		});
	};
})(jQuery);