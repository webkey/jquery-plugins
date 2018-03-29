/*! jquery.ms-popup-dynamic
 * Version: 2018.1.0
 * Author: Serhii Ilchenko
 * Description: Open a simple popup, if an element is added dynamically
 */

;(function($){
	'use strict';

	var SimplePopupDynamic = function(element, config){
		var self,
			$element = $(element),
			$doc = $(document),
			noCloseWrap = '.ms-popup-d__no-close-js',
			modifiers = {
				init: 'ms-popup-d--initialized',
				isOpen: 'ms-popup-d--is-open'
			},
			data = {
				dataClickOutside: 'click-outside',
				dataClickEsc: 'click-esc'
			};

		var callbacks = function() {
				/** track events */
				$.each(config, function (key, value) {
					if(typeof value === 'function') {
						$element.on(key + '.simplePopupDynamic', function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			close = function () {
				$('.' + modifiers.isOpen).removeClass(modifiers.isOpen);

				// callback afterClose
				$element.trigger('afterClosed.simplePopupDynamic');
			},
			toggle = function () {
				$element.on('click', config.opener, function (event) {
					var $curOpener = $(this),
						$currentPopup = $('#' + $curOpener.attr('href').substring(1));

					if ($curOpener.hasClass(modifiers.isOpen)) {
						close();

						event.preventDefault();
						event.stopPropagation();
						return;
					}

					if($('.' + modifiers.isOpen).length){
						close();
					}

					// open current popup and add data attributes
					$curOpener.addClass(modifiers.isOpen)
						.data(data.dataClickOutside, config.dataClickOutside)
						.data(data.dataClickEsc, config.dataClickEsc);
					$currentPopup.addClass(modifiers.isOpen)
						.data(data.dataClickOutside, config.dataClickOutside)
						.data(data.dataClickEsc, config.dataClickEsc);

					// callback after opened popup
					$element.trigger('afterOpened.simplePopupDynamic');

					event.preventDefault();
					event.stopPropagation();
				});
			},
			closeByClickBtnClose = function () {
				$doc.on('click', config.closeBtn, function (event) {
					close();

					event.preventDefault();
				});
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){
					var activeElement = $('.' + modifiers.isOpen);

					if(activeElement.length && activeElement.data(data.dataClickOutside) && !$(event.target).closest(noCloseWrap).length) {
						close();
						event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					var activeElement = $('.' + modifiers.isOpen);

					if (activeElement.length && activeElement.data(data.dataClickEsc) && event.keyCode === 27) {
						close();
					}
				});
			},
			init = function () {
				$element.addClass(modifiers.init);
				$element.trigger('afterInit.simplePopupDynamic');
			};

		self = {
			callbacks: callbacks,
			close: close,
			toggle: toggle,
			closeByClickBtnClose: closeByClickBtnClose,
			closeByClickOutside: closeByClickOutside,
			closeByClickEsc: closeByClickEsc,
			init: init
		};

		return self;
	};

	$.fn.simplePopupDynamic = function (options) {
		return this.each(function(){
			var simplePopupDynamic;
			// check for re-initialization
			if(!$(this).data('simplePopupDynamic')) {
				simplePopupDynamic = new SimplePopupDynamic(this, $.extend(true, {}, $.fn.simplePopupDynamic.defaultOptions, options));
				simplePopupDynamic.callbacks();
				simplePopupDynamic.toggle();
				simplePopupDynamic.closeByClickBtnClose();
				simplePopupDynamic.closeByClickOutside();
				simplePopupDynamic.closeByClickEsc();
				simplePopupDynamic.init();

				// set data for check re-initialization
				$(this).data('simplePopupDynamic', simplePopupDynamic);
			}
		});
	};

	$.fn.simplePopupDynamic.defaultOptions = {
		opener: '.ms-popup-d__opener-js',
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		dataClickOutside: true, // Close all if outside click
		dataClickEsc: true // Close all if escape key click
	}

})(jQuery);