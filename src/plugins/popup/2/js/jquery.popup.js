/*!==================================================
/*!jquery.popup.js
/*!Version: 2
/*!Description: Open a simple popup, if an element is added dynamically
/*!==================================================*/

;(function($){
	'use strict';

	var $doc = $(document);
	var $html = $('html');

	var SimplePopupDynamic = function(element, config){
		var self,
			$element = $(element),
			noCloseWrap = '.ms-popup-d__no-close-js',
			dataAttr = {
				dataClickOutside: 'msPopupClickOutside',
				dataClickEsc: 'msPopupClickEsc',
				dataIsOpenClass: 'msPopupIsOpenClass'
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
			open = function (event, $curOpener, $curPopup) {
				// console.log("$element: ", $element);
				// console.log("$curOpener: ", $curOpener);
				// console.log("$.data($doc): ", $.data($doc));

				/** если кнопка, на которую применяется событие,
				 * является активной, то закрываем попап,
				 * останавливаем дальнейшее выполнение скрипта*/
				if ($curOpener.hasClass(config.modifiers.isOpen)) {
					close();

					event.preventDefault();
					return false;
				}

				/** если попап открыт (любой попап, открытый плагином),
				 * зфкрыаем его*/
				if ($.data($doc, dataAttr.dataIsOpenClass)) {
					close();
				}

				/** на документ устанавливаем data-атрибуты
				 * со значением параметров,
				 * нужно ли закрывать текущий попап
				 * по клику вне попапа,
				 * и по клику на Esc*/
				$.data($doc, dataAttr.dataClickOutside, config.dataClickOutside);
				$.data($doc, dataAttr.dataClickEsc, config.dataClickEsc);

				/** на кнопку открытия и попап
				 * добавляем классы активности*/
				var arr = [$curOpener, $curPopup];
				$.each(arr, function () {
					$(this).addClass(config.modifiers.isOpen);
				});

				/** Добавляем на тег html
				 * класс блокирования прокрутки*/
				$html.addClass(config.modifiers.cssScrollFixed);

				/** на документ устанавливаем атрибут
				 * с классом активности текущего попапа*/
				$.data($doc, dataAttr.dataIsOpenClass, config.modifiers.isOpen);

				// callback after opened popup
				$element.trigger('afterOpen.simplePopupDynamic');

				event.preventDefault();
				event.stopPropagation();
			},
			close = function () {
				$('.' + $.data($doc, dataAttr.dataIsOpenClass)).removeClass($.data($doc, dataAttr.dataIsOpenClass));
				$.data($doc, dataAttr.dataIsOpenClass, false);

				/** Удаляем с тега html
				 * класс блокирования прокрутки*/
				$html.removeClass(config.modifiers.cssScrollFixed);

				// callback afterClose
				$element.trigger('afterClose.simplePopupDynamic');
			},
			toggle = function () {
				if(config.opener){
					$element.on('click close', config.opener, function (event) {
						var $curOpener = $(this),
							$curPopup = $('#' + $curOpener.attr('href').substring(1));

						open(event, $curOpener, $curPopup);
					});
				} else {
					$element.on('click close', function (event) {
						var $curOpener = $(this),
							$curPopup = $('#' + $curOpener.attr('href').substring(1));

						open(event, $curOpener, $curPopup);
					});
				}

			},
			closeByClickBtnClose = function () {
				$doc.on('click', config.closeBtn, function (event) {
					close();

					event.preventDefault();
				});
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){
					var activeElement = $('.' + $.data($doc, dataAttr.dataIsOpenClass));

					if(activeElement.length && $.data($doc, dataAttr.dataClickOutside) && !$(event.target).closest(noCloseWrap).length) {
						close();
						event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					var activeElement = $('.' + $.data($doc, dataAttr.dataIsOpenClass));

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
		dataClickOutside: true, // Close all if Outside click
		dataClickEsc: true, // Close all if Escape key click
		modifiers: {
			init: 'ms-popup-d--initialized',
			isOpen: 'ms-popup-d--is-open',
			cssScrollFixed: 'css-scroll-fixed'
		}
	}

})(jQuery);