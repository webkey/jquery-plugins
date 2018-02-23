;(function($){
	var defaults = {
		popup: '.spl-popup__popup-js',
		closeBtn: '.spl-popup__close-js',
		noCloseWrap: '.spl-popup__no-close-js',
		addClass: 'spl-popup--initialized',
		outsideClick: true, // Close all if outside click
		escapeClick: true // Close all if escape key click

		// Callback functions
		// afterInit: function () {} // Fire immediately after initialized
		// afterChange: function () {} // Fire immediately after added or removed an open-class
	};

	function SimplePopup(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;
		self.initClass = 'spl-popup--initialized';
		self.classes = {
			popup: 'sp-Popup',
			opener: 'sp-PopupOpener',
			closeBtn: 'sp-PopupClose',
			noClose: 'sp-disableCloseOnClick'
		};
		self.modifiers = {
			isOpen: 'spl-popup--is-open'
		};

		self.callbacks();
		self.event();
		// close popup if clicked outside active element
		if (self.config.outsideClick) {
			self.clickOutside();
		}
		if (self.config.escapeClick) {
			self.clickEscape();
		}
		self.init();
	}

	/** track events */
	SimplePopup.prototype.callbacks = function () {
		var self = this;

		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.SimplePopup', function (e, param) {
					console.log('callback!');
					return value(e, self.element, param);
				});
			}
		});
	};

	SimplePopup.prototype.event = function () {
		var self = this;

		$(document).on('click', '.btn-qr-code-js', function (event) {
			var curOpener = $(this);

			var id = curOpener.attr('href').substring(1);
			var curPopup = $('#' + id);

			if (curPopup.hasClass(self.modifiers.isOpen)) {
				self.closePopup();

				self.element.trigger('afterClose.SimplePopup', curPopup);

				event.preventDefault();
				event.stopPropagation();
				return;
			}

			// close same popup
			self.closePopup();

			// open current popup
			$('html').addClass(self.modifiers.isOpen);
			curOpener.addClass(self.modifiers.isOpen);
			curPopup.addClass(self.modifiers.isOpen);

			event.preventDefault();
			event.stopPropagation();


		});

		$(self.config.closeBtn).on('click', function (event) {
			self.closePopup();
			var curPopup = $(this).closest(self.config.popup);

			event.preventDefault();

			// callback afterChange
			self.element.trigger('afterClose.SimplePopup', curPopup);
		});
	};

	SimplePopup.prototype.clickOutside = function () {

		var self = this;
		$(document).on('click', function(event){
			if( $(event.target).closest('.' + self.classes.noClose).length ) {
				return;
			}

			self.closePopup();
			event.stopPropagation();
		});

	};

	SimplePopup.prototype.clickEscape = function () {

		var self = this;
		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				self.closePopup();
			}
		});

	};

	SimplePopup.prototype.closePopup = function () {

		var self = this;

		$('.' + self.initClass).removeClass(self.modifiers.isOpen);
		$('html').removeClass(self.modifiers.isOpen);

	};

	SimplePopup.prototype.init = function () {

		var self = this;

		this.element.addClass(self.initClass).addClass(self.classes.opener);
		$(self.config.closeBtn).addClass(self.initClass).addClass(self.classes.closeBtn);
		$(self.config.popup).addClass(self.initClass).addClass(self.classes.popup);
		$(self.config.noCloseWrap).addClass(self.classes.noClose);

		this.element.trigger('afterInit.SimplePopup');

	};

	$.fn.SimplePopup = function (options) {
		'use strict';

		return this.each(function(){
			new SimplePopup($(this), options);
		});

	};
})(jQuery);