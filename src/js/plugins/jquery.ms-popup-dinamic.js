;(function($){
	var defaults = {
		opener: '.ms-popup-d__opener-js',
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		addClass: false,
		outsideClick: true, // Close all if outside click
		escapeClick: true // Close all if escape key click
	};

	function SimplePopupDinamic(element, options, index) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;
		self.index = index;
		self.stopPropogation = '.ms-popup-d__no-close-js';
		self.modifiers = {
			init: 'ms-popup-d--initialized',
			isOpen: 'ms-popup-d--is-open'
		};

		self.callbacks();

		// close popup if clicked outside active element
		if (self.config.outsideClick) {
			self.clickOutside();
		}
		if (self.config.escapeClick) {
			self.clickEscape();
		}
		self.eventOnOpener();

		self.init();
	}

	/** track events */
	SimplePopupDinamic.prototype.callbacks = function () {
		var self = this;

		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.simplePopupDinamic', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	SimplePopupDinamic.prototype.eventOnOpener = function () {
		var self = this;

		self.element.on('click', self.config.opener, function (event) {
			self.consoleInfo('openerClick','before');
			
			var curOpener = $(this);
			
			var curId = curOpener.attr('href').substring(1);
			var curPopup = $('#' + curId);

			var isOpenElement = $('.' + self.modifiers.isOpen);
			if(isOpenElement.length) {

			}

			if (curPopup.hasClass(self.modifiers.isOpen)) {
				self.closePopup();

				event.preventDefault();
				event.stopPropagation();
				return;
			}

			self.closePopup();

			// open current popup
			curOpener.addClass(self.modifiers.isOpen);
			curPopup.addClass(self.modifiers.isOpen);

			event.preventDefault();
			event.stopPropagation();

		});

		$(self.config.closeBtn).on('click', function (event) {
			self.closePopup();

			event.preventDefault();
		});
	};

	SimplePopupDinamic.prototype.clickOutside = function () {

		var self = this;
		$(document).on('click', function(event){
			self.consoleInfo('clickOutside','before');

			var isOpenElement = $('.' + self.modifiers.isOpen);

			if(isOpenElement.length && !$(event.target).closest(self.stopPropogation).length) {

				self.consoleInfo('clickOutside','after');

				self.closePopup();
				event.stopPropagation();

			}
		});

	};

	SimplePopupDinamic.prototype.clickEscape = function () {

		var self = this;

		$(document).keyup(function(e) {
			self.consoleInfo('clickEscape','before');

			var isOpenElement = $('.' + self.modifiers.isOpen);

			if (isOpenElement.length && e.keyCode === 27) {

				self.consoleInfo('clickEscape','after');

				self.closePopup();
			}
		});

	};

	SimplePopupDinamic.prototype.closePopup = function () {

		var self = this;

		$('.' + self.modifiers.isOpen).removeClass(self.modifiers.isOpen);

		// callback afterClose
		self.element.trigger('afterClose.simplePopupDinamic');
	};

	/**удалить*/
	SimplePopupDinamic.prototype.consoleInfo = function (key, suffix, param) {
		console.log('==' + this.index + '-' + key + '-' + suffix + '==', param || '');
	};

	SimplePopupDinamic.prototype.init = function () {

		var self = this;

		this.element.addClass(self.modifiers.init);

		this.element.trigger('afterInit.simplePopupDinamic');

	};

	$.fn.simplePopupDinamic = function (options) {
		return this.each(function(index){
			new SimplePopupDinamic($(this), options, index);
		});

	};
})(jQuery);