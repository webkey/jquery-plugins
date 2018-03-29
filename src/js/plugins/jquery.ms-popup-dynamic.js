/*! jquery.ms-popup-dynamic
 * Version: 2018.1.0
 * Author: Serhii Ilchenko
 * Description: Open a simple popup, if an element is added dynamically
 */

;(function($){
	'use strict';

	var isOpen = false;

	var SimplePopupDynamic = function(element, config){
		var self,
			$element = $(element),
			$doc = $(document),
			noCloseWrap = '.ms-popup-d__no-close-js',
			data = {
				dataClickOutside: 'msPopupClickOutside',
				dataClickEsc: 'msPopupClickEsc',
				dataIsOpen: 'msPopupIsOpen'
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
				console.log("close: ", $doc.data(data.dataIsOpen));
				// $('.' + config.modifiers.isOpen).removeClass(config.modifiers.isOpen);
				$('.' + $doc.data(data.dataIsOpen)).removeClass($doc.data(data.dataIsOpen));
				// isOpen = false;
				$doc.data(data.dataIsOpen, false);

				// callback afterClose
				$element.trigger('afterClosed.simplePopupDynamic');
			},
			toggle = function () {
				$element.on('click', config.opener, function (event) {
					if (!config.opener) {
						return false;
					}

					console.log("config.modifiers.isOpen: ", config.modifiers.isOpen);

					var $curOpener = $(this), $curPopup = $('#' + $curOpener.attr('href').substring(1));

					if ($curOpener.hasClass(config.modifiers.isOpen)) {
						close();

						event.preventDefault();
						event.stopPropagation();
						return;
					}

					/*
										if($('.' + config.modifiers.isOpen).length){
											close();
										}
					*/
					console.log("isOpen?", !!$doc.data(data.dataIsOpen));
					if ($doc.data(data.dataIsOpen)) {
						close();
					}

					var arr = [$curOpener, $curPopup];

					$.each(arr, function () {
						// console.log("$(this): ", $(this));
						$(this).addClass(config.modifiers.isOpen);
					});

					$doc
						.data(data.dataClickOutside, config.dataClickOutside)
						.data(data.dataClickEsc, config.dataClickEsc);

					// open current popup and add data attributes
					// $curOpener.addClass(config.modifiers.isOpen)
					// 	.data(data.dataClickOutside, config.dataClickOutside)
					// 	.data(data.dataClickEsc, config.dataClickEsc);
					// $curPopup.addClass(config.modifiers.isOpen)
					// 	.data(data.dataClickOutside, config.dataClickOutside)
					// 	.data(data.dataClickEsc, config.dataClickEsc);

					// callback after opened popup
					$element.trigger('afterOpened.simplePopupDynamic');

					// isOpen = true;
					console.log("$.data($doc): ", $.data($doc));
					console.log("$doc.data(): ", $doc.data());
					console.log("$doc.data(data.dataIsOpen) before: ", $doc.data(data.dataIsOpen));
					// console.log("$.data($doc, data.dataIsOpen) before: ", $.data($doc, data.dataIsOpen));
					$doc.data(data.dataIsOpen, config.modifiers.isOpen);
					// console.log("$.hasData($doc) after: ", $.hasData($doc, data.dataIsOpen));
					// console.log("$.data($doc, data.dataIsOpen) after: ", $.data($doc, data.dataIsOpen));
					console.log("$doc.data(data.dataIsOpen) after: ", $doc.data(data.dataIsOpen));

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

					// console.log("dataClickOutside: ", $doc.data());

					if(activeElement.length && $doc.data(data.dataClickOutside) && !$(event.target).closest(noCloseWrap).length) {
						close();
						event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					var activeElement = $('.' + config.modifiers.isOpen);

					// console.log("dataClickEsc: ", $doc.data());

					if (activeElement.length && $doc.data(data.dataClickEsc) && event.keyCode === 27) {
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