/*! jquery.switch-class.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function($){
	'use strict';

	var $doc = $(document);
	var $html = $('html');

	var TClass = function(element, config){
		var self,
			$element = $(element),
			dataStopRemove = '[data-tc-stop]',
			dataAttr = {
				dataRemoveOutsideClick: 'toggleClassRemoveOutsideClick',
				dataActiveClass: 'toggleClassActiveClass'
			};

		var callbacks = function() {
				/** track events */
				$.each(config, function (key, value) {
					if(typeof value === 'function') {
						$element.on(key + '.tClass', function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			add = function (event, $curOpener) {
				// console.log("$element: ", $element);
				// console.log("$.data($doc): ", $.data($doc));
				// console.log('add');

				// ========= Удалить все классы добавленные плагином =========
				// Если кнопка, на которую применяется событие,
				// является активной, то удаляем классы.
				// Останавливаем дальнейшее выполнение скрипта.
				if ($curOpener.hasClass(config.modifiers.currentClass)) {
					remove();

					event.preventDefault();
					return false;
				}

				// Если классы добавлены
				// (любым экземпляром плагина),
				// удаляем их.
				if ($.data($doc, dataAttr.dataActiveClass)) {
					remove();
				}

				// На документ устанавливаем data-атрибуты
				// со значением параметров
				// removeOutsideClick
				$.data($doc, dataAttr.dataRemoveOutsideClick, config.removeOutsideClick);

				// На документ устанавливаем атрибут (toggleClassActiveClass),
				// значение которого - текущий класс (config.modifiers.currentClass).
				$.data($doc, dataAttr.dataActiveClass, config.modifiers.currentClass);

				console.log("active class (current): ", $.data($doc, dataAttr.dataActiveClass));

				// На html, switcher и все указанные элементы
				// добавляем класс.
				// Примечание: если на странице switcher дублируется, то его класс
				// нужно добавить в параметр elements
				var arr = [$html, $curOpener, config.elements];

				$.each(arr, function () {
					var curElem = this;
					// если массив, то устанавливаем класс на каждый из элемент этого массива
					if ($.isArray(curElem)) {
						$.each(curElem, function () {
							var $curElem = $(this);
							if ($curElem.length) {
								$curElem.addClass(config.modifiers.currentClass);
							} else {
								// В консоль вывести предуприждение,
								// если указанного элемента не существует.
								console.warn('Element "' + this + '" does not exist!')
							}
						});
					} else {
						$(this).addClass(config.modifiers.currentClass);
					}
				});

				toggleScroll();

				// callback after added class
				$element.trigger('afterAdded.tClass');

				event.preventDefault();
				event.stopPropagation();
			},
			remove = function () {
				var curClass = $.data($doc, dataAttr.dataActiveClass);

				console.log("active class (prev): ", $.data($doc, dataAttr.dataActiveClass));

				// Со всех элементов с активным классом удаляем этот класс
				$('.' + curClass).removeClass(curClass);

				// На документ устанавливаем атрибут (toggleClassActiveClass),
				// со значение false.
				$.data($doc, dataAttr.dataActiveClass, false);

				console.log("active class (after remove): ", $.data($doc, dataAttr.dataActiveClass));

				toggleScroll();

				// callback afterRemoved
				$element.trigger('afterRemoved.tClass');
			},
			toggle = function () {
				if(config.switcher){
					$element.on('click', config.switcher, function (event) {
						var $curOpener = $(this);

						add(event, $curOpener);
					});
				} else {
					$element.on('click', function (event) {
						var $curOpener = $(this);

						add(event, $curOpener);
					});
				}

			},
			toggleScroll = function () {
				if ($.data($doc, dataAttr.dataActiveClass)) {
					// console.log('blocked');
					// Добавляем на тег html
					// класс блокирования прокрутки.
					$html.addClass(config.modifiers.cssScrollFixed);
				} else {
					// console.log('unblocked');
					// Удаляем с тега html
					// класс блокирования прокрутки
					$html.removeClass(config.modifiers.cssScrollFixed);
				}
			},
			closeByClickBtnClose = function () {
				$doc.on('click', config.closeBtn, function (event) {
					remove();

					event.preventDefault();
				});
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){

					if($.data($doc, dataAttr.dataActiveClass) && $.data($doc, dataAttr.dataRemoveOutsideClick) && !$(event.target).closest(dataStopRemove).length) {
						remove();
						// event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					if ($.data($doc, dataAttr.dataActiveClass) && event.keyCode === 27) {
						remove();
					}
				});
			},
			init = function () {
				$element.addClass(config.modifiers.init);
				$element.trigger('afterInit.tClass');
			};

		self = {
			callbacks: callbacks,
			remove: remove,
			toggle: toggle,
			toggleScroll: toggleScroll,
			closeByClickBtnClose: closeByClickBtnClose,
			closeByClickOutside: closeByClickOutside,
			closeByClickEsc: closeByClickEsc,
			init: init
		};

		return self;
	};

	$.fn.tClass = function (options) {
		return this.each(function(){
			var tClass;
			//
			if(!$(this).data('tClass')) {
				tClass = new TClass(this, $.extend(true, {}, $.fn.tClass.defaultOptions, options));
				tClass.callbacks();
				tClass.toggle();
				tClass.closeByClickBtnClose();
				tClass.closeByClickOutside();
				tClass.closeByClickEsc();
				tClass.toggleScroll();
				tClass.init();

				// set data for check re-initialization
				$(this).data('tClass', tClass);
			}
		});
	};

	$.fn.tClass.defaultOptions = {
		switcher: null,
		elements: null,
		closeBtn: '.ms-popup-d__close-js',
		removeOutsideClick: true,
		modifiers: {
			init: 'tc--initialized',
			currentClass: 'active',
			cssScrollFixed: 'css-scroll-fixed'
		}
	}

})(jQuery);