/*! jquery.ms-popup-dynamic
 * Version: 2018.1.0
 * Author: Serhii Ilchenko
 * Description: Open a simple popup, if an element is added dynamically
 */

;(function($){
	'use strict';

	var $doc = $(document);

	var SimplePopupDynamic = function(element, config){
		var self,
			$element = $(element),
			noCloseWrap = '.ms-popup-d__no-close-js',
			dataAttr = {
				dataClickOutside: 'msPopupClickOutside',
				dataClickEsc: 'msPopupClickEsc',
				dataIsOpenClass: 'msPopupIsOpen'
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
				$('.' + $.data($doc, dataAttr.dataIsOpenClass)).removeClass($.data($doc, dataAttr.dataIsOpenClass));
				$.data($doc, dataAttr.dataIsOpenClass, false);

				// callback afterClose
				$element.trigger('afterClosed.simplePopupDynamic');
			},
			toggle = function () {
				$element.on('click', config.opener, function (event) {
					if (!config.opener) {
						return false;
					}

					console.log("config.modifiers.isOpen: ", config.modifiers.isOpen);

					var $curOpener = $(this),
						$curPopup = $('#' + $curOpener.attr('href').substring(1));

					console.log("$.data($doc): ", $.data($doc));

					if ($curOpener.hasClass(config.modifiers.isOpen)) {
						close();

						event.preventDefault();
						event.stopPropagation();
						return;
					}

					if ($.data($doc, dataAttr.dataIsOpenClass)) {
						close();
					}

					// open current popup and add data-attributes attributes
					// $doc
					// 	.data(dataAttr.dataClickOutside, config.dataClickOutside)
					// 	.data(dataAttr.dataClickEsc, dataAttr.dataClickEsc);
					$.data($doc, dataAttr.dataClickOutside, config.dataClickOutside);
					$.data($doc, dataAttr.dataClickEsc, config.dataClickEsc);

					var arr = [$curOpener, $curPopup];
					$.each(arr, function () {
						// console.log("$(this): ", $(this));
						$(this).addClass(config.modifiers.isOpen);
					});

					$.data($doc, dataAttr.dataIsOpenClass, config.modifiers.isOpen);

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
					var activeElement = $('.' + config.modifiers.isOpen);

					if(activeElement.length && $.data($doc, dataAttr.dataClickOutside) && !$(event.target).closest(noCloseWrap).length) {
						close();
						event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					var activeElement = $('.' + config.modifiers.isOpen);

					if (activeElement.length && $.data($doc, dataAttr.dataClickEsc) && event.keyCode === 27) {
						close();
					}
				});
			},
			init = function () {
				$element.addClass(config.modifiers.init);
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
		opener: null,
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		dataClickOutside: true, // Close all if outside click
		dataClickEsc: true, // Close all if escape key click
		modifiers: {
			init: 'ms-popup-d--initialized',
			isOpen: 'ms-popup-d--is-open'
		}
	}

})(jQuery);