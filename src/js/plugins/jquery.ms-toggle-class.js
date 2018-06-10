/*! jquery.ms-toggle-class.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function($){
	'use strict';

	var $doc = $(document),
		$html = $('html'),
		count = 0;

	var TClass = function(element, config){
		var self,
			$element = $(element),
			dataStopRemove = '[data-tc-stop]';

		var classIsAdded = false;

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
			add = function ($curOpener) {
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

				count = ++count;
				console.log("++count: ", count);

				classIsAdded = true;

				toggleScroll();

				// callback after added class
				$element.trigger('afterAdded.tClass');
			},
			remove = function () {

				$('.' + config.modifiers.currentClass).removeClass(config.modifiers.currentClass);

				classIsAdded = false;

				count = --count;
				console.log("count: ", count);
				toggleScroll();

				// callback afterRemoved
				$element.trigger('afterRemoved.tClass');
			},
			toggle = function () {
				if(config.switcher){
					$element.on('click', config.switcher, function (event) {
						var $curOpener = $(this);

						if (classIsAdded) {

							remove();

							// $.data($doc, dataAttr.dataClassAdded, false);
							classIsAdded = false;

							event.preventDefault();
							return false;
						}

						add($curOpener);

						event.preventDefault();
						event.stopPropagation();
					});
				} else {
					$element.on('click', function (event) {
						var $curOpener = $(this);

						if (classIsAdded) {
							console.log('initial remove...');

							remove();

							// $.data($doc, dataAttr.dataClassAdded, false);
							classIsAdded = false;

							event.preventDefault();
							return false;
						}

						add($curOpener);

						event.preventDefault();
						event.stopPropagation();
					});
				}

			},
			toggleScroll = function () {
				console.log("classIsAdded: ", classIsAdded);
				console.log("count: ", count);
				if (!count) {
					// Удаляем с тега html
					// класс блокирования прокрутки
					$html.removeClass(config.modifiers.cssScrollFixed);
				} else {
					// Добавляем на тег html
					// класс блокирования прокрутки.
					$html.addClass(config.modifiers.cssScrollFixed);
				}
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){

					if(classIsAdded && config.removeOutsideClick && !$(event.target).closest(dataStopRemove).length) {
						remove();
						// event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					if (classIsAdded && event.keyCode === 27) {
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
			closeByClickOutside: closeByClickOutside,
			closeByClickEsc: closeByClickEsc,
			init: init
		};

		return self;
	};

	// $.fn.tClass = function (options, params) {
	$.fn.tClass = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].tClass = new TClass(_[i], $.extend(true, {}, $.fn.tClass.defaultOptions, opt));
				_[i].tClass.callbacks();
				_[i].tClass.toggle();
				_[i].tClass.closeByClickOutside();
				_[i].tClass.closeByClickEsc();
				_[i].tClass.init();
			}
			else {
				console.log("opt: ", opt);
				console.log("args: ", args);
				ret = _[i].tClass[opt].apply(_[i].slick, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.tClass.defaultOptions = {
		switcher: null,
		elements: null,
		removeOutsideClick: true,
		modifiers: {
			init: 'tc--initialized',
			currentClass: 'tc--active',
			cssScrollFixed: 'css-scroll-fixed'
		}
	};

})(jQuery);