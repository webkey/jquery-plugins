/*! jquery.ms-switch-class.js
 * Version: 2018.1.0
 * Author: *
 * Description: Extended toggle class
 */

;(function ($) {
	'use strict';

	var countFixedScroll = 0;
	// Нужно для корректной работы с доп. классом фиксирования скролла

	var SwitchClass = function (element, config) {
		var self,
			$element = $(element),
			$html = $('html'),
			pref = 'jq-switch-class',
			pluginClasses = {
				initClass: pref + '_initialized'
			},
			mod = {
				scrollFixedClass: 'css-scroll-fixed'
			},
			$switchClassTo = $element.add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo),
			classIsAdded = false; //Флаг отвечающий на вопрос: класс добавлен?

		var callbacks = function () {
				/** track events */
				$.each(config, function (key, value) {
					if (typeof value === 'function') {
						$element.on('switchClass.' + key, function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			prevent = function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			},
			toggleFixedScroll = function () {
				$html.toggleClass(mod.scrollFixedClass, !!countFixedScroll);
			},
			add = function () {
				if (classIsAdded) return;

				// Callback before added class
				$element.trigger('switchClass.beforeAdded');

				// Добавить активный класс на:
				// 1) Основной элемент
				// 2) Дополнительный переключатель
				// 3) Элементы указанные в настройках экземпляра плагина
				$switchClassTo.addClass(config.modifiers.activeClass);

				classIsAdded = true;

				if (config.cssScrollFixed) {
					// Если в настойках указано, что нужно добавлять класс фиксации скролла,
					// То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
					++countFixedScroll;
					toggleFixedScroll();
				}

				// callback after added class
				$element.trigger('switchClass.afterAdded');
			},
			remove = function () {
				if (!classIsAdded) return;

				// callback beforeRemoved
				$element.trigger('switchClass.beforeRemoved');

				// Удалять активный класс с:
				// 1) Основной элемент
				// 2) Дополнительный переключатель
				// 3) Элементы указанные в настройках экземпляра плагина
				$switchClassTo.removeClass(config.modifiers.activeClass);

				classIsAdded = false;

				if (config.cssScrollFixed) {
					// Если в настойках указано, что нужно добавлять класс фиксации скролла,
					// То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
					--countFixedScroll;
					toggleFixedScroll();
				}

				// callback afterRemoved
				$element.trigger('switchClass.afterRemoved');
			},
			events = function () {
				$element.on('click', function (event) {
					if (classIsAdded) {
						remove();

						event.preventDefault();
						return false;
					}

					add();

					prevent(event);
				});

				$(config.switcher).on('click', function (event) {
					$element.click();
					prevent(event);
				});

				$(config.adder).on('click', function (event) {
					add();
					prevent(event);
				});

				$(config.remover).on('click', function (event) {
					remove();
					prevent(event);
				})

			},
			removeByClickOutside = function () {
				$html.on('click', function (event) {
					if (classIsAdded && config.removeOutsideClick && !$(event.target).closest('.' + config.modifiers.stopRemoveClass).length) {
						remove();
						// event.stopPropagation();
					}
				});
			},
			removeByClickEsc = function () {
				$html.keyup(function (event) {
					if (classIsAdded && config.removeEscClick && event.keyCode === 27) {
						remove();
					}
				});
			},
			init = function () {
				$element.addClass(pluginClasses.initClass).addClass(config.modifiers.initClass);
				$element.trigger('switchClass.afterInit');
			};

		self = {
			callbacks: callbacks,
			remove: remove,
			events: events,
			removeByClickOutside: removeByClickOutside,
			removeByClickEsc: removeByClickEsc,
			init: init
		};

		return self;
	};

	// $.fn.switchClass = function (options, params) {
	$.fn.switchClass = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].switchClass = new SwitchClass(_[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, opt));
				_[i].switchClass.callbacks();
				_[i].switchClass.events();
				_[i].switchClass.removeByClickOutside();
				_[i].switchClass.removeByClickEsc();
				_[i].switchClass.init();
			}
			else {
				ret = _[i].switchClass[opt].apply(_[i].switchClass, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.switchClass.defaultOptions = {
		switcher: null,
		/**
		 * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
		 * @example {String}{JQ Object} null - '.switcher-js', или $('.switcher-js')
		 */
		adder: null,
		/**
		 * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
		 * @example {String}{JQ Object} null - '.adder-js', или $('.adder-js')
		 */
		remover: null,
		/**
		 * @description - Дополнительный элемент, которым можно УДАЛЯТЬ класс
		 * @example {String}{JQ Object} null - '.remover-js', или $('.remover-js')
		 */
		switchClassTo: null,
		/**
		 * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
		 * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
		 * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
		 */
		removeOutsideClick: true,
		/**
		 * @description - Удалать класс по клику по пустому месту на странице? Если по клику на определенный элемент удалять класс не нужно, то на этот элемент нужно добавить дата-антрибут [data-tc-stop]
		 * @param {boolean} true - или false
		 */
		removeEscClick: true,
		/**
		 * @description - Удалять класс по клику на клавишу Esc?
		 * @param {boolean} true - или false
		 */
		cssScrollFixed: false,
		/**
		 * @description - Добавлять на html дополнительный класс 'css-scroll-fixed'? Через этот класс можно фиксировать скролл методами css
		 * @see - _mixins.sass =scroll-blocked()
		 * @param {boolean} true - или false.
		 */
		modifiers: {
			initClass: null,
			activeClass: 'active',
			stopRemoveClass: 'stop-remove-class' // Если кликнуть по елементу с этим классам, то событие удаления активного класса не будет вызвано
		}
		/**
		 * @description - Список классов-модификаторов
		 */
	};

})(jQuery);